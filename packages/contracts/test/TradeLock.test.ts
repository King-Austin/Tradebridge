import { expect } from 'chai';
import { ethers } from 'hardhat';
import { time } from '@nomicfoundation/hardhat-network-helpers';

describe('TradeLock Contract', () => {
  let mockUSDC: any;
  let tradeLock: any;
  let owner: any;
  let buyer: any;
  let supplier: any;
  let other: any;

  const tradeAmount = ethers.parseUnits('1000', 6); // 1000 mUSDC
  const inspectionDays = 7;
  const agreementHash = ethers.keccak256(ethers.toUtf8Bytes('TG-TEST-AGREEMENT-001'));

  beforeEach(async () => {
    [owner, buyer, supplier, other] = await ethers.getSigners();

    const MockUSDCFactory = await ethers.getContractFactory('MockUSDC');
    mockUSDC = await MockUSDCFactory.deploy();

    // Mint tokens to buyer
    await mockUSDC.connect(owner).mint(buyer.address, tradeAmount);

    const TradeLockFactory = await ethers.getContractFactory('TradeLock');
    tradeLock = await TradeLockFactory.deploy(
      buyer.address,
      supplier.address,
      await mockUSDC.getAddress(),
      tradeAmount,
      inspectionDays,
      agreementHash
    );
  });

  it('should initialize in AwaitingFunding state with correct parameters', async () => {
    expect(await tradeLock.buyer()).to.equal(buyer.address);
    expect(await tradeLock.supplier()).to.equal(supplier.address);
    expect(await tradeLock.amount()).to.equal(tradeAmount);
    expect(await tradeLock.getState()).to.equal(0); // AwaitingFunding
  });

  it('should successfully complete full happy path: Fund -> Ship -> Accept -> Release', async () => {
    // 1. Buyer approves and funds
    const escrowAddr = await tradeLock.getAddress();
    await mockUSDC.connect(buyer).approve(escrowAddr, tradeAmount);

    await expect(tradeLock.connect(buyer).fund())
      .to.emit(tradeLock, 'EscrowFunded')
      .withArgs(buyer.address, tradeAmount, (val: any) => val > 0);

    expect(await tradeLock.getState()).to.equal(1); // Funded
    expect(await mockUSDC.balanceOf(escrowAddr)).to.equal(tradeAmount);

    // 2. Supplier confirms shipment
    await expect(tradeLock.connect(supplier).confirmShipment())
      .to.emit(tradeLock, 'ShipmentConfirmed')
      .withArgs(supplier.address, (val: any) => val > 0);

    expect(await tradeLock.getState()).to.equal(3); // Shipped

    // 3. Buyer accepts delivery
    const initialSupplierBalance = await mockUSDC.balanceOf(supplier.address);

    await expect(tradeLock.connect(buyer).acceptDelivery())
      .to.emit(tradeLock, 'DeliveryAccepted')
      .and.to.emit(tradeLock, 'FundsReleased')
      .withArgs(supplier.address, tradeAmount, (val: any) => val > 0);

    expect(await tradeLock.getState()).to.equal(7); // Released
    expect(await mockUSDC.balanceOf(supplier.address)).to.equal(initialSupplierBalance + tradeAmount);
    expect(await mockUSDC.balanceOf(escrowAddr)).to.equal(0);
  });

  it('should block release when buyer raises a dispute', async () => {
    const escrowAddr = await tradeLock.getAddress();
    await mockUSDC.connect(buyer).approve(escrowAddr, tradeAmount);
    await tradeLock.connect(buyer).fund();
    await tradeLock.connect(supplier).confirmShipment();

    // Buyer raises dispute
    await expect(tradeLock.connect(buyer).raiseDispute('Damaged electronics upon delivery'))
      .to.emit(tradeLock, 'DisputeRaised')
      .withArgs(buyer.address, 'Damaged electronics upon delivery', (val: any) => val > 0);

    expect(await tradeLock.getState()).to.equal(6); // Disputed

    // Attempting normal acceptDelivery should fail
    await expect(tradeLock.connect(buyer).acceptDelivery()).to.be.revertedWith(
      'TradeLock: invalid state for action'
    );

    // Settlement after mutual resolution
    await expect(tradeLock.connect(buyer).settleDispute())
      .to.emit(tradeLock, 'FundsReleased');

    expect(await tradeLock.getState()).to.equal(7); // Released
  });

  it('should transition to PendingReview if inspection expires without buyer action', async () => {
    const escrowAddr = await tradeLock.getAddress();
    await mockUSDC.connect(buyer).approve(escrowAddr, tradeAmount);
    await tradeLock.connect(buyer).fund();
    await tradeLock.connect(supplier).confirmShipment();

    // Fast-forward past inspection period (7 days + 1 hour)
    await time.increase(7 * 24 * 60 * 60 + 3600);

    expect(await tradeLock.isInspectionExpired()).to.be.true;

    // Trigger review
    await expect(tradeLock.connect(other).triggerPendingReview())
      .to.emit(tradeLock, 'MovedToPendingReview');

    expect(await tradeLock.getState()).to.equal(8); // PendingReview
  });

  it('should allow buyer cancellation before funding', async () => {
    await expect(tradeLock.connect(buyer).cancel())
      .to.emit(tradeLock, 'EscrowCancelled');

    expect(await tradeLock.getState()).to.equal(9); // Cancelled
  });
});

