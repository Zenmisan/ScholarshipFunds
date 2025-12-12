export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace after deployment

export const CONTRACT_ABI = [
  "function addStudent(string name, address studentAddress, uint256 amount) external",
  "function bulkAddStudents(string[] names, address[] studentAddresses, uint256[] amounts) external",
  "function updateStudentAmount(address studentAddress, uint256 newAmount) external",
  "function removeStudent(address studentAddress) external",
  "function depositFunds() external payable",
  "function withdrawFunds() external",
  "function claimScholarship() external",
  "function pause() external",
  "function unpause() external",
  "function paused() view returns (bool)",
  "function getStudent(address studentAddress) external view returns (tuple(string name, address walletAddress, uint256 amount, bool hasClaimed, bool isRegistered))",
  "function getAllStudents() external view returns (tuple(string name, address walletAddress, uint256 amount, bool hasClaimed, bool isRegistered)[])",
  "function getContractBalance() external view returns (uint256)",
  "function owner() view returns (address)",
  "event StudentAdded(address indexed studentAddress, string name, uint256 amount)",
  "event StudentRemoved(address indexed studentAddress)",
  "event ScholarshipClaimed(address indexed studentAddress, uint256 amount)",
  "event FundDeposited(address indexed depositor, uint256 amount)",
  "event WithdrawalMade(address indexed owner, uint256 amount)",
  "event AmountUpdated(address indexed studentAddress, uint256 newAmount)"
];