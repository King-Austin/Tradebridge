// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TradeLock.sol";

/**
 * @title TradeLockFactory
 * @notice Factory contract that deploys and indexes isolated TradeLock escrow instances.
 */
contract TradeLockFactory {
    event TradeLockCreated(
        address indexed escrowAddress,
        address indexed buyer,
        address indexed supplier,
        bytes32 agreementHash,
        uint256 amount
    );

    address[] public deployedEscrows;
    mapping(bytes32 => address) public escrowByAgreement;

    /**
     * @notice Deploys a new isolated TradeLock escrow contract for a specific trade agreement.
     * @param _buyer Address of the purchasing importer
     * @param _supplier Address of the fulfilling exporter
     * @param _token ERC-20 token address (MockUSDC)
     * @param _amount Agreed escrow amount
     * @param _inspectionPeriodDays Inspection duration in days
     * @param _agreementHash Keccak256 hash of the canonical agreed terms
     */
    function createEscrow(
        address _buyer,
        address _supplier,
        address _token,
        uint256 _amount,
        uint256 _inspectionPeriodDays,
        bytes32 _agreementHash
    ) external returns (address) {
        require(escrowByAgreement[_agreementHash] == address(0), "TradeLockFactory: escrow already exists for agreement");

        TradeLock escrow = new TradeLock(
            _buyer,
            _supplier,
            _token,
            _amount,
            _inspectionPeriodDays,
            _agreementHash
        );

        address escrowAddress = address(escrow);
        deployedEscrows.push(escrowAddress);
        escrowByAgreement[_agreementHash] = escrowAddress;

        emit TradeLockCreated(escrowAddress, _buyer, _supplier, _agreementHash, _amount);
        return escrowAddress;
    }

    function getDeployedEscrows() external view returns (address[] memory) {
        return deployedEscrows;
    }

    function totalEscrows() external view returns (uint256) {
        return deployedEscrows.length;
    }
}

