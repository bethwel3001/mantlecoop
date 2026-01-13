// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol"

/**
 * @title SocialLending
 * @notice Social-collateralized lending using member shares
 */
contract SocialLending is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant SECRETARY_ROLE = keccak256("SECRETARY_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    
    MantleCoopVault public vault;
    IERC20 public loanAsset;
    
    uint256 public maxLTV; // Maximum loan-to-value ratio (80% = 8000)
    uint256 public baseInterestRate; // Base Annual interest in basis points
    uint256 public latePenaltyRate; // Additional penalty for late payment (basis points per day)
    uint256 public nextLoanId;

    // Credit scoring
    mapping(address => CreditScore) public creditScores;

    struct CreditScore {
        uint256 totalBorrowed;
        uint256 totalRepaid;
        uint256 loansCompleted;
        uint256 loansDefaulted;
        uint256 averageRepaymentTime, // in seconds
    }
    
    struct Loan {
        uint256 id;
        address borrower;
        uint256 principalAmount;
        uint256 collateralShares;
        uint256 interestRate; // Annual rate in basis points
        uint256 startTime;
        uint256 dueDate;
        uint256 repaidAmount;
        uint256 gracePeriodEnd; // Grace period after due date
        LoanStatus status;
        string purpose; // Loan purpose for transparency
    }
    
    enum LoanStatus {
         Pending,  // Awaiting secretary approval
         Approved, // Approved, funds disbursed
          Active,  // Being repaid
          Repaid, // Fully  repaid
          Late,   // Past due date but in grace period
          Defaulted  // Past grace period
          }
    
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans;

    uint256 public totalLoansIssued;
    uint256 public totalInterestEarned;
    uint256 public totalDefaults;
    
    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 duration,
        string purpose
    );
    event LoanApproved(uint256 indexed loanId, uint256 timestamp);
    event LoanRejected(uint256 indexed loadId, string reason);
    event LoanRepayment(
        uint256 indexed loanId,
        uint256 amount,
        uint256 interestPaid,
        uint256 remaining
    );

    event LoanFullyRepaid(uint256 indexed loanId, uint256 totalPaid);
    event LoanDefaulted(uint256 indexed loanId, uint256 collateralLiquidated);
    event LoanMarkedLate(uint256 indexed loanId);
    event IntrestRateAdjusted(address indexed borrower, uint256 newRate);
    
    constructor(
        address _vault,
        address _loanAsset,
        uint256 _maxLTV,
        uint256 _baseInterestRate,
        uint256 _latePenaltyRate
    ) {
        require(_maxLTV <= 9000, "LTV too high"); // Max 90%
        require(_baseInterestRate <= 3000, "Interest too high"); // Max 30%

        vault = MantleCoopVault(_vault);
        loanAsset = IERC20(_loanAsset);
        maxLTV = _maxLTV;
        baseInterestRate = _baseInterestRate;
        latePenaltyRate = _latePenaltyRate;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SECRETARY_ROLE, msg.sender);
        _grantRole(SECRETARY_ROLE, msg.sender);
    }
    
    /**
     * @notice Request a loan using vault shares as collateral
     */
    function requestLoan(
        uint256 amount, 
        uint256 durationDays
        string calldata purpose
    ) 
        external 
        nonReentrant 
        whenNotPaused 
        returns (uint256) 
    {
        require(amount > 0, "Invalid amount");
        require(durationDays >= 7 && durationDays <= 365, "Invalid duration");
        require(bytes(purpose).length > 0, "Purpose required")

        // Check member status
        require(vault.members(msg.sender).isActive, "Not a member");
        
        // Calculate required collateral
        uint256 memberValue = vault.getMemberValue(msg.sender);
        uint256 requiredCollateral = (amount * 10000) / maxLTV;
        
        require(memberValue >= requiredCollateral, "Insufficient collateral");
        
        // Lock shares (transfer to this contract)
        uint256 sharesToLock = vault.convertToShares(requiredCollateral);
        require(
            vault.transferFrom(msg.sender, address(this), sharesToLock),
            "Share transfer failed"
        );
        
        // Create loan
        uint256 loanId = nextLoanId++;
        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            amount: amount,
            collateralShares: sharesToLock,
            interestRate: baseInterestRate,
            startTime: block.timestamp,
            dueDate: block.timestamp + (durationDays * 1 days),
            repaidAmount: 0,
            status: LoanStatus.Pending
        });
        
        borrowerLoans[msg.sender].push(loanId);
        
        emit LoanRequested(loanId, msg.sender, amount);
        return loanId;
    }
    
    /**
     * @notice Approve and disburse loan
     */
    function approveLoan(uint256 loanId) 
        external 
        onlyRole(SECRETARY_ROLE) 
        nonReentrant 
    {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Pending, "Invalid status");
        
        loan.status = LoanStatus.Active;
        
        // Disburse loan
        require(
            loanAsset.transfer(loan.borrower, loan.amount),
            "Loan transfer failed"
        );
        
        emit LoanApproved(loanId, block.timestamp);
    }
    
    /**
     * @notice Repay loan
     */
    function repayLoan(uint256 loanId, uint256 amount) 
        external 
        nonReentrant 
    {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(msg.sender == loan.borrower, "Not borrower");
        
        uint256 totalDue = calculateTotalDue(loanId);
        uint256 paymentAmount = amount > totalDue ? totalDue : amount;
        
        // Transfer repayment
        require(
            loanAsset.transferFrom(msg.sender, address(vault), paymentAmount),
            "Repayment failed"
        );
        
        loan.repaidAmount += paymentAmount;
        
        // Check if fully repaid
        if (loan.repaidAmount >= totalDue) {
            loan.status = LoanStatus.Repaid;
            
            // Return collateral
            require(
                vault.transfer(loan.borrower, loan.collateralShares),
                "Collateral return failed"
            );
        }
        
        emit LoanRepaid(loanId, paymentAmount);
    }
    
    /**
     * @notice Calculate total amount due including interest
     */
    function calculateTotalDue(uint256 loanId) public view returns (uint256) {
        Loan storage loan = loans[loanId];
        
        uint256 timeElapsed = block.timestamp - loan.startTime;
        uint256 interest = (loan.amount * baseInterestRate * timeElapsed) / 
                          (10000 * 365 days);
        
        return loan.amount + interest;
    }
    
    /**
     * @notice Mark loan as defaulted if overdue
     */
    function markDefault(uint256 loanId) 
        external 
        onlyRole(SECRETARY_ROLE) 
    {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "Not active");
        require(block.timestamp > loan.dueDate, "Not overdue");
        
        loan.status = LoanStatus.Defaulted;
        
        // Liquidate collateral to vault reserve
        uint256 collateralValue = vault.convertToAssets(loan.collateralShares);
        vault.transfer(address(vault), loan.collateralShares);
        
        emit LoanDefaulted(loanId);
    }
    
    /**
     * @notice Get borrower's active loans
     */
    function getBorrowerLoans(address borrower) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return borrowerLoans[borrower];
    }
}
