import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  // 1. Deploy MockUSDC
  const MockUSDC = await ethers.getContractFactory('MockUSDC');
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log('MockUSDC deployed to:', mockUSDCAddress);

  // 2. Deploy TradeLockFactory
  const TradeLockFactory = await ethers.getContractFactory('TradeLockFactory');
  const factory = await TradeLockFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log('TradeLockFactory deployed to:', factoryAddress);

  console.log('\n--- Deployment Summary ---');
  console.log(`NEXT_PUBLIC_MOCK_USDC_ADDRESS="${mockUSDCAddress}"`);
  console.log(`NEXT_PUBLIC_TRADELOCK_FACTORY_ADDRESS="${factoryAddress}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

