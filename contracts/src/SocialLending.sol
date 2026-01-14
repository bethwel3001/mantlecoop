// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./Interfaces.sol";

/**
 * @title SocialLending
 * @notice Social-collateralized lending using member shares with real interest calculations
 */
contract SocialLending is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant SECRETARY_ROLE = keccak256("SECRETARY_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    
    IMantleCoopVault public vault;
    IERC20 public loanAsset;
    
    // Lending parameters
    uint256 public maxLTV; // Maximum loan-to-value ratio (8000 = 80%)
    uint256 public baseInterestRate; // Base annual interest in basis points
    uint256 public latePenaltyRate; // Additional penalty for late payment (basis points per day)
    uint256 public nextLoanId;
    
    // Credit scoring
    mapping(address => CreditScore) public creditScores;
    
    struct CreditScore {
        uint256 totalBorrowed;
        uint256 totalRepaid;
        uint256 loansCompleted;
        uint256 loansDefaulted;
        uint256 averageRepaymentTime; // in seconds
    }
    
    struct Loan {
        uint256 id;
        address borrower;
        uint256 principal;
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
        Pending,      // Awaiting secretary approval
        Approved,     // Approved, funds disbursed
        Active,       // Being repaid
        Repaid,       // Fully repaid
        Late,         // Past due date but in grace period
        Defaulted     // Past grace period
    }
    
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans;
    
    uint256 public totalLoansIssued;
    uint256 public totalInterestEarned;
    uint256 public totalDefaults;
    
    // Events
    event LoanRequested(
        uint256 indexed loanId, 
        address indexed borrower, 
        uint256 amount,
        uint256 duration,
        string purpose
    );
    event LoanApproved(uint256 indexed loanId, uint256 timestamp);
    event LoanRejected(uint256 indexed loanId, string reason);
    event LoanRepayment(
        uint256 indexed loanId, 
        uint256 amount, 
        uint256 interestPaid,
        uint256 remaining
    );
    event LoanFullyRepaid(uint256 indexed loanId, uint256 totalPaid);
    event LoanDefaulted(uint256 indexed loanId, uint256 collateralLiquidated);
    event LoanMarkedLate(uint256 indexed loanId);
    event InterestRateAdjusted(address indexed borrower, uint256 newRate);
    
    constructor(
        address _vault,
        address _loanAsset,
        uint256 _maxLTV,
        uint256 _baseInterestRate,
        uint256 _latePenaltyRate
    ) {
        require(_maxLTV <= 9000, "LTV too high"); // Max 90%
        require(_baseInterestRate <= 3000, "Interest too high"); // Max 30%
        
        vault = IMantleCoopVault(_vault);
        loanAsset = IERC20(_loanAsset);
        maxLTV = _maxLTV;
        baseInterestRate = _baseInterestRate;
        latePenaltyRate = _latePenaltyRate;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SECRETARY_ROLE, msg.sender);
        _grantRole(TREASURER_ROLE, msg.sender);
    }
    
    /**
     * @notice Request a loan using vault shares as collateral
     */
    function requestLoan(
        uint256 amount, 
        uint256 durationDays,
        string calldata purpose
    ) 
        external 
        nonReentrant 
        whenNotPaused 
        returns (uint256) 
    {
        require(amount > 0, "Invalid amount");
        require(durationDays >= 7 && durationDays <= 365, "Invalid duration");
        require(bytes(purpose).length > 0, "Purpose required");
        
        // Check member status
        (,,,, bool isActive,) = vault.members(msg.sender);
        require(isActive, "Not a member");
        
        // Calculate required collateral
        uint256 memberValue = vault.getMemberValue(msg.sender);
        uint256 requiredCollateralValue = (amount * 10000) / maxLTV;
        
        require(memberValue >= requiredCollateralValue, "Insufficient collateral");
        
        // Calculate interest rate based on credit history
        uint256 interestRate = _calculateInterestRate(msg.sender);
        
        // Lock shares as collateral
        uint256 sharesToLock = vault.convertToShares(requiredCollateralValue);
        require(
            vault.transferFrom(msg.sender, address(this), sharesToLock),
            "Share transfer failed"
        );
        
        // Create loan
        uint256 loanId = nextLoanId++;
        uint256 gracePeriod = durationDays > 30 ? 7 days : 3 days;
        
        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            principal: amount,
            collateralShares: sharesToLock,
            interestRate: interestRate,
            startTime: block.timestamp,
            dueDate: block.timestamp + (durationDays * 1 days),
            repaidAmount: 0,
            gracePeriodEnd: block.timestamp + (durationDays * 1 days) + gracePeriod,
            status: LoanStatus.Pending,
            purpose: purpose
        });
        
        borrowerLoans[msg.sender].push(loanId);
        
        emit LoanRequested(loanId, msg.sender, amount, durationDays, purpose);
        return loanId;
    }
    
    /**
     * @notice Calculate personalized interest rate based on credit history
     */
    function _calculateInterestRate(address borrower) 
        internal 
        view 
        returns (uint256) 
    {
        CreditScore memory score = creditScores[borrower];
        
        // Start with base rate
        uint256 rate = baseInterestRate;
        
        // Good history: reduce rate (max 30% reduction)
        if (score.loansCompleted > 0 && score.loansDefaulted == 0) {
            uint256 reduction = (score.loansCompleted * 50); // 0.5% per completed loan
            if (reduction > 300) reduction = 300; // Cap at 3%
            rate = rate > reduction ? rate - reduction : rate / 2;
        }
        
        // Bad history: increase rate
        if (score.loansDefaulted > 0) {
            uint256 increase = score.loansDefaulted * 200; // 2% per default
            rate += increase;
        }
        
        // Cap maximum rate
        if (rate > 3000) rate = 3000; // Max 30% APY
        
        return rate;
    }
    
    /**
     * @notice Approve and disburse loan (Secretary function)
     */
    function approveLoan(uint256 loanId) 
        external 
        onlyRole(SECRETARY_ROLE) 
        nonReentrant 
    {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Pending, "Invalid status");
        
        // Check vault has sufficient liquidity
        uint256 availableLiquidity = loanAsset.balanceOf(address(vault));
        require(availableLiquidity >= loan.principal, "Insufficient liquidity");
        
        loan.status = LoanStatus.Active;
        totalLoansIssued++;
        
        // Transfer loan from vault to borrower
        require(
            loanAsset.transferFrom(address(vault), loan.borrower, loan.principal),
            "Transfer failed"
        );
        
        emit LoanApproved(loanId, block.timestamp);
    }
    
    /**
     * @notice Reject loan application
     */
    function rejectLoan(uint256 loanId, string calldata reason) 
        external 
        onlyRole(SECRETARY_ROLE) 
    {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Pending, "Invalid status");
        
        loan.status = LoanStatus.Defaulted; // Reusing enum for rejected
        
        // Return collateral
        require(
            vault.transfer(loan.borrower, loan.collateralShares),
            "Collateral return failed"
        );
        
        emit LoanRejected(loanId, reason);
    }
    
    /**
     * @notice Make a loan repayment
     */
    function repayLoan(uint256 loanId, uint256 amount) 
        external 
        nonReentrant 
    {
        Loan storage loan = loans[loanId];
        require(
            loan.status == LoanStatus.Active || loan.status == LoanStatus.Late, 
            "Loan not active"
        );
        require(msg.sender == loan.borrower, "Not borrower");
        require(amount > 0, "Zero amount");
        
        uint256 totalDue = calculateTotalDue(loanId);
        uint256 paymentAmount = amount > totalDue ? totalDue : amount;
        
        // Calculate interest portion vs principal
        uint256 interestDue = totalDue - loan.principal;
        uint256 interestPaid = 0;
        
        if (loan.repaidAmount < interestDue) {
            interestPaid = paymentAmount > interestDue - loan.repaidAmount ? 
                          interestDue - loan.repaidAmount : paymentAmount;
        }
        
        // Transfer repayment to vault
        require(
            loanAsset.transferFrom(msg.sender, address(vault), paymentAmount),
            "Repayment transfer failed"
        );
        
        loan.repaidAmount += paymentAmount;
        totalInterestEarned += interestPaid;
        
        uint256 remaining = totalDue - loan.repaidAmount;
        
        emit LoanRepayment(loanId, paymentAmount, interestPaid, remaining);
        
        // Check if fully repaid
        if (loan.repaidAmount >= totalDue) {
            loan.status = LoanStatus.Repaid;
            
            // Update credit score
            _updateCreditScore(loan.borrower, loan, true);
            
            // Return collateral
            require(
                vault.transfer(loan.borrower, loan.collateralShares),
                "Collateral return failed"
            );
            
            emit LoanFullyRepaid(loanId, loan.repaidAmount);
        }
    }
    
    /**
     * @notice Calculate total amount due including interest and penalties
     */
    function calculateTotalDue(uint256 loanId) public view returns (uint256) {
        Loan storage loan = loans[loanId];
        
        uint256 timeElapsed = block.timestamp > loan.dueDate ? 
                             loan.dueDate - loan.startTime : 
                             block.timestamp - loan.startTime;
        
        // Base interest (simple interest for clarity)
        uint256 baseInterest = (loan.principal * loan.interestRate * timeElapsed) / 
                               (10000 * 365 days);
        
        uint256 totalDue = loan.principal + baseInterest;
        
        // Add late penalty if past due date
        if (block.timestamp > loan.dueDate) {
            uint256 daysLate = (block.timestamp - loan.dueDate) / 1 days;
            uint256 latePenalty = (loan.principal * latePenaltyRate * daysLate) / 10000;
            totalDue += latePenalty;
        }
        
        // Subtract what's already been repaid
        return totalDue > loan.repaidAmount ? totalDue - loan.repaidAmount : 0;
    }
    
    /**
     * @notice Mark loan as late (automated or manual trigger)
     */
    function markLoanLate(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "Not active");
        require(block.timestamp > loan.dueDate, "Not overdue");
        require(block.timestamp <= loan.gracePeriodEnd, "Past grace period");
        
        loan.status = LoanStatus.Late;
        emit LoanMarkedLate(loanId);
    }
    
    /**
     * @notice Mark loan as defaulted and liquidate collateral
     */
    function markDefault(uint256 loanId) 
        external 
        onlyRole(SECRETARY_ROLE) 
    {
        Loan storage loan = loans[loanId];
        require(
            loan.status == LoanStatus.Active || loan.status == LoanStatus.Late, 
            "Invalid status"
        );
        require(block.timestamp > loan.gracePeriodEnd, "In grace period");
        
        loan.status = LoanStatus.Defaulted;
        totalDefaults++;
        
        // Update credit score
        _updateCreditScore(loan.borrower, loan, false);
        
        // Liquidate collateral - shares remain locked in this contract
        uint256 collateralValue = vault.convertToAssets(loan.collateralShares);
        
        emit LoanDefaulted(loanId, collateralValue);
    }
    
    /**
     * @notice Update borrower's credit score
     */
    function _updateCreditScore(
        address borrower, 
        Loan storage loan, 
        bool successful
    ) internal {
        CreditScore storage score = creditScores[borrower];
        
        score.totalBorrowed += loan.principal;
        
        if (successful) {
            score.totalRepaid += loan.repaidAmount;
            score.loansCompleted++;
            
            // Update average repayment time
            uint256 repaymentTime = block.timestamp - loan.startTime;
            score.averageRepaymentTime = 
                (score.averageRepaymentTime * (score.loansCompleted - 1) + repaymentTime) / 
                score.loansCompleted;
        } else {
            score.loansDefaulted++;
        }
    }
    
    /**
     * @notice Get borrower's credit score details
     */
    function getBorrowerCreditScore(address borrower) 
        external 
        view 
        returns (
            uint256 totalBorrowed,
            uint256 totalRepaid,
            uint256 loansCompleted,
            uint256 loansDefaulted,
            uint256 suggestedRate
        ) 
    {
        CreditScore memory score = creditScores[borrower];
        return (
            score.totalBorrowed,
            score.totalRepaid,
            score.loansCompleted,
            score.loansDefaulted,
            _calculateInterestRate(borrower)
        );
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
    
    /**
     * @notice Get loan details
     */
    function getLoanDetails(uint256 loanId) 
        external 
        view 
        returns (
            address borrower,
            uint256 principal,
            uint256 interestRate,
            uint256 totalDue,
            uint256 repaidAmount,
            uint256 dueDate,
            LoanStatus status,
            string memory purpose
        )
    {
        Loan storage loan = loans[loanId];
        return (
            loan.borrower,
            loan.principal,
            loan.interestRate,
            calculateTotalDue(loanId),
            loan.repaidAmount,
            loan.dueDate,
            loan.status,
            loan.purpose
        );
    }
    
    /**
     * @notice Get lending statistics
     */
    function getLendingStats() 
        external 
        view 
        returns (
            uint256 totalIssued,
            uint256 totalInterest,
            uint256 totalDefaultRate,
            uint256 activeLoans
        )
    {
        uint256 active = 0;
        for (uint256 i = 0; i < nextLoanId; i++) {
            if (loans[i].status == LoanStatus.Active || loans[i].status == LoanStatus.Late) {
                active++;
            }
        }
        
        uint256 defaultRate = totalLoansIssued > 0 ? 
                             (totalDefaults * 10000) / totalLoansIssued : 0;
        
        return (
            totalLoansIssued,
            totalInterestEarned,
            defaultRate,
            active
        );
    }
    
    /**
     * @notice Update lending parameters
     */
    function updateLendingParameters(
        uint256 newMaxLTV,
        uint256 newBaseRate,
        uint256 newLatePenalty
    ) external onlyRole(TREASURER_ROLE) {
        require(newMaxLTV <= 9000, "LTV too high");
        require(newBaseRate <= 3000, "Rate too high");
        
        maxLTV = newMaxLTV;
        baseInterestRate = newBaseRate;
        latePenaltyRate = newLatePenalty;
    }
    
    /**
     * @notice Emergency pause
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
