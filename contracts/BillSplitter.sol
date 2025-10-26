// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BillSplitter {
    struct Bill {
        address creator;
        string description;
        uint256 totalAmount;
        uint256 amountPerPerson;
        address[] participants;
        mapping(address => bool) hasPaid;
        uint256 totalPaid;
        uint256 createdAt;
        bool isActive;
    }
    
    mapping(uint256 => Bill) public bills;
    uint256 public billCounter;
    
    event BillCreated(
        uint256 indexed billId,
        address indexed creator,
        string description,
        uint256 totalAmount,
        uint256 participantCount
    );
    
    event PaymentMade(
        uint256 indexed billId,
        address indexed payer,
        uint256 amount
    );
    
    event BillCompleted(uint256 indexed billId);
    
    event FundsWithdrawn(
        uint256 indexed billId,
        address indexed creator,
        uint256 amount
    );
    
    /**
     * @notice Create a new bill split
     * @param _description Description of the bill
     * @param _participants Array of participant addresses
     */
    function createBill(
        string memory _description,
        address[] memory _participants
    ) external payable returns (uint256) {
        require(_participants.length > 0, "Need at least one participant");
        require(bytes(_description).length > 0, "Description required");
        
        uint256 billId = billCounter++;
        Bill storage newBill = bills[billId];
        
        newBill.creator = msg.sender;
        newBill.description = _description;
        newBill.totalAmount = msg.value;
        newBill.amountPerPerson = msg.value / _participants.length;
        newBill.participants = _participants;
        newBill.createdAt = block.timestamp;
        newBill.isActive = true;
        
        emit BillCreated(
            billId,
            msg.sender,
            _description,
            msg.value,
            _participants.length
        );
        
        return billId;
    }
    
    /**
     * @notice Pay your share of a bill
     * @param _billId The ID of the bill to pay
     */
    function payShare(uint256 _billId) external payable {
        Bill storage bill = bills[_billId];
        
        require(bill.isActive, "Bill not active");
        require(!bill.hasPaid[msg.sender], "Already paid");
        require(isParticipant(_billId, msg.sender), "Not a participant");
        require(msg.value >= bill.amountPerPerson, "Insufficient payment");
        
        bill.hasPaid[msg.sender] = true;
        bill.totalPaid += msg.value;
        
        emit PaymentMade(_billId, msg.sender, msg.value);
        
        // Check if all participants have paid
        if (allPaid(_billId)) {
            bill.isActive = false;
            emit BillCompleted(_billId);
        }
        
        // Refund excess payment
        if (msg.value > bill.amountPerPerson) {
            uint256 refund = msg.value - bill.amountPerPerson;
            payable(msg.sender).transfer(refund);
        }
    }
    
    /**
     * @notice Creator withdraws collected funds
     * @param _billId The ID of the bill
     */
    function withdrawFunds(uint256 _billId) external {
        Bill storage bill = bills[_billId];
        
        require(msg.sender == bill.creator, "Only creator can withdraw");
        require(bill.totalPaid > 0, "No funds to withdraw");
        
        uint256 amount = bill.totalPaid;
        bill.totalPaid = 0;
        
        payable(bill.creator).transfer(amount);
        
        emit FundsWithdrawn(_billId, bill.creator, amount);
    }
    
    /**
     * @notice Check if address is a participant
     */
    function isParticipant(uint256 _billId, address _user) public view returns (bool) {
        Bill storage bill = bills[_billId];
        for (uint256 i = 0; i < bill.participants.length; i++) {
            if (bill.participants[i] == _user) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @notice Check if all participants have paid
     */
    function allPaid(uint256 _billId) public view returns (bool) {
        Bill storage bill = bills[_billId];
        for (uint256 i = 0; i < bill.participants.length; i++) {
            if (!bill.hasPaid[bill.participants[i]]) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * @notice Check if a user has paid their share
     */
    function hasPaid(uint256 _billId, address _user) external view returns (bool) {
        return bills[_billId].hasPaid[_user];
    }
    
    /**
     * @notice Get bill details
     */
    function getBill(uint256 _billId) external view returns (
        address creator,
        string memory description,
        uint256 totalAmount,
        uint256 amountPerPerson,
        address[] memory participants,
        uint256 totalPaid,
        bool isActive
    ) {
        Bill storage bill = bills[_billId];
        return (
            bill.creator,
            bill.description,
            bill.totalAmount,
            bill.amountPerPerson,
            bill.participants,
            bill.totalPaid,
            bill.isActive
        );
    }
    
    /**
     * @notice Get all participants for a bill
     */
    function getParticipants(uint256 _billId) external view returns (address[] memory) {
        return bills[_billId].participants;
    }
}
