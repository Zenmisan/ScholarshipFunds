// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ScholarshipFund is Ownable, ReentrancyGuard, Pausable {
    
    struct Student {
        string name;
        address walletAddress;
        uint256 amount;
        bool hasClaimed;
        bool isRegistered;
    }

    // Mappings
    mapping(address => Student) public students;
    address[] public studentList;

    // Events
    event StudentAdded(address indexed studentAddress, string name, uint256 amount);
    event StudentRemoved(address indexed studentAddress);
    event ScholarshipClaimed(address indexed studentAddress, uint256 amount);
    event FundDeposited(address indexed depositor, uint256 amount);
    event WithdrawalMade(address indexed owner, uint256 amount);
    event AmountUpdated(address indexed studentAddress, uint256 newAmount);

    constructor() Ownable(msg.sender) {}

    // --- Admin Functions ---

    /**
     * @dev Add a new student to the scholarship fund.
     */
    function addStudent(string memory _name, address _studentAddress, uint256 _amount) public onlyOwner {
        require(_studentAddress != address(0), "Invalid address");
        require(!students[_studentAddress].isRegistered, "Student already registered");
        require(_amount > 0, "Amount must be greater than 0");

        students[_studentAddress] = Student({
            name: _name,
            walletAddress: _studentAddress,
            amount: _amount,
            hasClaimed: false,
            isRegistered: true
        });

        studentList.push(_studentAddress);
        emit StudentAdded(_studentAddress, _name, _amount);
    }

    /**
     * @dev Bulk add multiple students to save gas/time.
     */
    function bulkAddStudents(string[] memory _names, address[] memory _studentAddresses, uint256[] memory _amounts) external onlyOwner {
        require(_names.length == _studentAddresses.length && _names.length == _amounts.length, "Array lengths mismatch");
        
        for (uint256 i = 0; i < _studentAddresses.length; i++) {
            addStudent(_names[i], _studentAddresses[i], _amounts[i]);
        }
    }

    /**
     * @dev Update the allocated amount for a student.
     */
    function updateStudentAmount(address _studentAddress, uint256 _newAmount) external onlyOwner {
        require(students[_studentAddress].isRegistered, "Student not registered");
        require(!students[_studentAddress].hasClaimed, "Student already claimed");
        require(_newAmount > 0, "Amount must be greater than 0");

        students[_studentAddress].amount = _newAmount;
        emit AmountUpdated(_studentAddress, _newAmount);
    }

    /**
     * @dev Remove a student from the list.
     */
    function removeStudent(address _studentAddress) external onlyOwner {
        require(students[_studentAddress].isRegistered, "Student not registered");
        require(!students[_studentAddress].hasClaimed, "Student already claimed");

        // Remove from mapping
        delete students[_studentAddress];

        // Remove from array (swap and pop)
        for (uint256 i = 0; i < studentList.length; i++) {
            if (studentList[i] == _studentAddress) {
                studentList[i] = studentList[studentList.length - 1];
                studentList.pop();
                break;
            }
        }

        emit StudentRemoved(_studentAddress);
    }

    /**
     * @dev Deposit funds into the contract.
     */
    function depositFunds() external payable onlyOwner {
        require(msg.value > 0, "Deposit must be greater than 0");
        emit FundDeposited(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw remaining funds from the contract.
     */
    function withdrawFunds() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");

        emit WithdrawalMade(owner(), balance);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // --- Student Functions ---

    /**
     * @dev Claim the allocated scholarship.
     */
    function claimScholarship() external nonReentrant whenNotPaused {
        Student storage student = students[msg.sender];

        require(student.isRegistered, "Not registered for scholarship");
        require(!student.hasClaimed, "Scholarship already claimed");
        require(address(this).balance >= student.amount, "Insufficient contract funds");

        student.hasClaimed = true;

        (bool success, ) = payable(msg.sender).call{value: student.amount}("");
        require(success, "Transfer failed");

        emit ScholarshipClaimed(msg.sender, student.amount);
    }

    // --- View Functions ---

    function getStudent(address _studentAddress) external view returns (Student memory) {
        return students[_studentAddress];
    }

    function getAllStudents() external view returns (Student[] memory) {
        Student[] memory allStudents = new Student[](studentList.length);
        for (uint256 i = 0; i < studentList.length; i++) {
            allStudents[i] = students[studentList[i]];
        }
        return allStudents;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Fallback to accept funds
    receive() external payable {
        emit FundDeposited(msg.sender, msg.value);
    }
}
