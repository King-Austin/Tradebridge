import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('MockUSDC Contract', () => {
  let mockUSDC: any;
  let owner: any;
  let buyer: any;
  let supplier: any;

  beforeEach(async () => {
    [owner, buyer, supplier] = await ethers.getSigners();
    const MockUSDCFactory = await ethers.getContractFactory('MockUSDC');
    mockUSDC = await MockUSDCFactory.deploy();
  });

  it('should initialize with 6 decimals and correct name/symbol', async () => {
    expect(await mockUSDC.name()).to.equal('Mock USD Coin');
    expect(await mockUSDC.symbol()).to.equal('mUSDC');
    expect(await mockUSDC.decimals()).to.equal(6);
  });

  it('should mint tokens only when authorized owner requests', async () => {
    const mintAmount = ethers.parseUnits('5000', 6);
    await mockUSDC.connect(owner).mint(buyer.address, mintAmount);

    expect(await mockUSDC.balanceOf(buyer.address)).to.equal(mintAmount);

    // Non-owner mint attempt should revert
    await expect(
      mockUSDC.connect(buyer).mint(supplier.address, mintAmount)
    ).to.be.revertedWithCustomError(mockUSDC, 'OwnableUnauthorizedAccount');
  });
});

