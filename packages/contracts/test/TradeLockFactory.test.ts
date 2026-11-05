import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('TradeLockFactory Contract', () => {
  let factory: any;
  let mockUSDC: any;
  let owner: any;
  let buyer: any;
  let supplier: any;

  beforeEach(async () => {
    [owner, buyer, supplier] = await ethers.getSigners();

    const MockUSDCFactory = await ethers.getContractFactory('MockUSDC');
    mockUSDC = await MockUSDCFactory.deploy();

    const Factory = await ethers.getContractFactory('TradeLockFactory');
    factory = await Factory.deploy();
  });

  it('should deploy a new TradeLock instance and track its address', async () => {
    const agreementHash = ethers.keccak256(ethers.toUtf8Bytes('TG-FACTORY-TEST-001'));
    const amount = ethers.parseUnits('2500', 6);

    const tx = await factory.createEscrow(
      buyer.address,
      supplier.address,
      await mockUSDC.getAddress(),
      amount,
      7,
      agreementHash
    );

    await expect(tx)
      .to.emit(factory, 'TradeLockCreated')
      .withArgs(
        (addr: string) => ethers.isAddress(addr),
        buyer.address,
        supplier.address,
        agreementHash,
        amount
      );

    expect(await factory.totalEscrows()).to.equal(1);
    const escrows = await factory.getDeployedEscrows();
    expect(escrows.length).to.equal(1);
    expect(await factory.escrowByAgreement(agreementHash)).to.equal(escrows[0]);
  });

  it('should reject creating duplicate escrow for the same agreement hash', async () => {
    const agreementHash = ethers.keccak256(ethers.toUtf8Bytes('TG-DUPLICATE-CHECK'));
    const amount = ethers.parseUnits('1000', 6);

    await factory.createEscrow(
      buyer.address,
      supplier.address,
      await mockUSDC.getAddress(),
      amount,
      7,
      agreementHash
    );

    await expect(
      factory.createEscrow(
        buyer.address,
        supplier.address,
        await mockUSDC.getAddress(),
        amount,
        7,
        agreementHash
      )
    ).to.be.revertedWith('TradeLockFactory: escrow already exists for agreement');
  });
});

