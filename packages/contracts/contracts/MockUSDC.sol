// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Test stablecoin for TradeGuard MVP matching real USDC parameters (6 decimals).
 * Admin can mint to simulate fiat on-ramp funding conversions.
 */
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USD Coin", "mUSDC") Ownable(msg.sender) {
        // Initial faucet supply to deployer for local testing: 1,000,000 mUSDC
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Mint test stablecoin tokens to a recipient address.
     * @param to Target address to receive tokens.
     * @param amount Amount to mint (scaled by 10^6).
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

