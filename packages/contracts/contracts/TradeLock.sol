// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TradeLock
 * @notice Individual smart-contract escrow instance for a TradeGuard trade agreement.
 * Protects cross-border trade settlements between buyers and suppliers.
 */
contract TradeLock is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum State {
        AwaitingFunding,    // 0
        Funded,             // 1
        AwaitingShipment,   // 2
        Shipped,            // 3
        AwaitingInspection, // 4
        Accepted,           // 5
        Disputed,           // 6
        Released,           // 7
        PendingReview,      // 8
        Cancelled           // 9
    }

    address public immutable buyer;
    address public immutable supplier;
    IERC20 public immutable token;
    uint256 public immutable amount;
    uint256 public immutable inspectionPeriodDays;
    bytes32 public immutable agreementHash;

    State public state;
    uint256 public fundedAt;
    uint256 public shippedAt;
    uint256 public inspectionDeadline;

    event EscrowFunded(address indexed buyer, uint256 amount, uint256 timestamp);
    event ShipmentConfirmed(address indexed supplier, uint256 timestamp);
    event InspectionStarted(uint256 deadline);
    event DeliveryAccepted(address indexed buyer, uint256 timestamp);
    event DisputeRaised(address indexed buyer, string reason, uint256 timestamp);
    event FundsReleased(address indexed supplier, uint256 amount, uint256 timestamp);
    event EscrowCancelled(uint256 timestamp);
    event MovedToPendingReview(uint256 timestamp);

    modifier onlyBuyer() {
        require(msg.sender == buyer, "TradeLock: only buyer authorized");
        _;
    }

    modifier onlySupplier() {
        require(msg.sender == supplier, "TradeLock: only supplier authorized");
        _;
    }

    modifier inState(State expectedState) {
        require(state == expectedState, "TradeLock: invalid state for action");
        _;
    }

    constructor(
        address _buyer,
        address _supplier,
        address _token,
        uint256 _amount,
        uint256 _inspectionPeriodDays,
        bytes32 _agreementHash
    ) {
        require(_buyer != address(0), "TradeLock: invalid buyer");
        require(_supplier != address(0), "TradeLock: invalid supplier");
        require(_token != address(0), "TradeLock: invalid token");
        require(_amount > 0, "TradeLock: amount must be positive");
        require(_inspectionPeriodDays > 0, "TradeLock: inspection period must be positive");

        buyer = _buyer;
        supplier = _supplier;
        token = IERC20(_token);
        amount = _amount;
        inspectionPeriodDays = _inspectionPeriodDays;
        agreementHash = _agreementHash;
        state = State.AwaitingFunding;
    }

    /**
     * @notice Buyer deposits the agreed stablecoin amount into escrow.
     */
    function fund() external onlyBuyer inState(State.AwaitingFunding) nonReentrant {
        state = State.Funded;
        fundedAt = block.timestamp;
        token.safeTransferFrom(msg.sender, address(this), amount);
        emit EscrowFunded(msg.sender, amount, block.timestamp);
    }

    /**
     * @notice Supplier marks goods shipped, initiating the inspection countdown window.
     */
    function confirmShipment() external onlySupplier inState(State.Funded) {
        state = State.Shipped;
        shippedAt = block.timestamp;
        inspectionDeadline = block.timestamp + (inspectionPeriodDays * 1 days);
        emit ShipmentConfirmed(msg.sender, block.timestamp);
        emit InspectionStarted(inspectionDeadline);
    }

    /**
     * @notice Buyer inspects and accepts delivery; triggers release of tokens to supplier.
     */
    function acceptDelivery() external onlyBuyer inState(State.Shipped) nonReentrant {
        state = State.Accepted;
        emit DeliveryAccepted(msg.sender, block.timestamp);
        _release();
    }

    /**
     * @notice Buyer raises a dispute if delivery fails, items damaged, or terms breached.
     */
    function raiseDispute(string calldata reason) external onlyBuyer inState(State.Shipped) {
        state = State.Disputed;
        emit DisputeRaised(msg.sender, reason, block.timestamp);
    }

    /**
     * @notice When the inspection window expires without buyer action, funds enter PendingReview.
     * Prevents automatic release without buyer verification per PRD requirements.
     */
    function triggerPendingReview() external inState(State.Shipped) {
        require(inspectionDeadline > 0 && block.timestamp > inspectionDeadline, "TradeLock: inspection window still active");
        state = State.PendingReview;
        emit MovedToPendingReview(block.timestamp);
    }

    /**
     * @notice Settlement after dispute/review resolution authorizes release of funds.
     */
    function settleDispute() external onlyBuyer nonReentrant {
        require(
            state == State.Disputed || state == State.PendingReview,
            "TradeLock: contract not in disputable or review state"
        );
        state = State.Accepted;
        _release();
    }

    /**
     * @notice Buyer can cancel the escrow before funding occurs.
     */
    function cancel() external onlyBuyer inState(State.AwaitingFunding) {
        state = State.Cancelled;
        emit EscrowCancelled(block.timestamp);
    }

    function _release() private {
        uint256 balance = token.balanceOf(address(this));
        require(balance >= amount, "TradeLock: insufficient balance for release");
        state = State.Released;
        token.safeTransfer(supplier, amount);
        emit FundsReleased(supplier, amount, block.timestamp);
    }

    // View helpers
    function getState() external view returns (State) {
        return state;
    }

    function isInspectionExpired() external view returns (bool) {
        return inspectionDeadline > 0 && block.timestamp > inspectionDeadline;
    }
}

