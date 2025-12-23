package com.bank.bankapp;
import com.bank.bankapp.security.SecurityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    public AccountService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
public Account createAccount(Account account) {

    // ❌ Check duplicate account number + IFSC
    boolean exists = accountRepository
            .existsByAccountNoAndIfscCode(
                    account.getAccountNo(),
                    account.getIfscCode()
            );

    if (exists) {
        throw new RuntimeException(
            "Account already exists with this Account Number and IFSC"
        );
    }

    // 🔐 Attach logged-in user
    Long userId = SecurityUtil.getLoggedInUserId();
    account.setUserId(userId);

    return accountRepository.save(account);
}


    @Transactional
    public Account deposit(Long accountId, Double amount, String description) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found: " + accountId));
        double newBalance = (acc.getBalance() == null ? 0.0 : acc.getBalance()) + amount;
        acc.setBalance(newBalance);
        Account saved = accountRepository.save(acc);
        Transaction tx = new Transaction(saved, "DEPOSIT", amount, newBalance, description);
        transactionRepository.save(tx);
        return saved;
    }
    @Transactional
    public Account withdraw(Long accountId, Double amount, String description) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found: " + accountId));
        double current = (acc.getBalance() == null ? 0.0 : acc.getBalance());
        if (current < amount) {
            throw new RuntimeException("Insufficient funds");
        }
        double newBalance = current - amount;
        acc.setBalance(newBalance);
        Account saved = accountRepository.save(acc);
        Transaction tx = new Transaction(saved, "WITHDRAW", amount, newBalance, description);
        transactionRepository.save(tx);
        return saved;
    }
    @Transactional
    public void transfer(Long fromAccountId, Long toAccountId, Double amount, String description) {
        if (fromAccountId.equals(toAccountId)) throw new RuntimeException("Cannot transfer to same account");
        Account from = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new RuntimeException("Source account not found: " + fromAccountId));
        Account to = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new RuntimeException("Destination account not found: " + toAccountId));
        double fromBal = (from.getBalance() == null ? 0.0 : from.getBalance());
        if (fromBal < amount) throw new RuntimeException("Insufficient funds");
        // debit source
        from.setBalance(fromBal - amount);
        accountRepository.save(from);
        Transaction tx1 = new Transaction(from, "TRANSFER_DEBIT", amount, from.getBalance(), description + " -> to:" + toAccountId);
        transactionRepository.save(tx1);
        // credit destination
        double toBal = (to.getBalance() == null ? 0.0 : to.getBalance()) + amount;
        to.setBalance(toBal);
        accountRepository.save(to);
        Transaction tx2 = new Transaction(to, "TRANSFER_CREDIT", amount, to.getBalance(), description + " <- from:" + fromAccountId);
        transactionRepository.save(tx2);
    }
    public List<Transaction> getTransactions(Long accountId) {
        return transactionRepository.findByAccountAccountIdOrderByCreatedAtDesc(accountId);
    }
    public List<Transaction> getTransactionsByType(Long accountId, String type) {
    return transactionRepository.findByAccountAccountIdAndTypeOrderByCreatedAtDesc(accountId, type);
}
public List<Transaction> getTransactionsByDateRange(Long accountId, LocalDateTime start, LocalDateTime end) {
    return transactionRepository.findByAccountAccountIdAndCreatedAtBetweenOrderByCreatedAtDesc(accountId, start, end);
}
  public AccountSummary getAccountSummary(Long accountId) {
        Account acc = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found: " + accountId));
        // counts and sums
        long totalDeposits = transactionRepository.countByAccountAndType(accountId, "DEPOSIT");
        Double sumDeposits = transactionRepository.sumAmountByAccountAndType(accountId, "DEPOSIT");
        long totalWithdrawals = transactionRepository.countByAccountAndType(accountId, "WITHDRAW");
        Double sumWithdrawals = transactionRepository.sumAmountByAccountAndType(accountId, "WITHDRAW");
        // last transaction time
        List<Transaction> latest = transactionRepository.findLatestTransactionForAccount(accountId);
        LocalDateTime lastAt = null;
        if (latest != null && !latest.isEmpty()) {
            lastAt = latest.get(0).getCreatedAt();
        }
        AccountSummary summary = new AccountSummary();
        summary.setAccountId(accountId);
        summary.setBalance(acc.getBalance() == null ? 0.0 : acc.getBalance());
        summary.setTotalDeposits(totalDeposits);
        summary.setSumDeposits(sumDeposits == null ? 0.0 : sumDeposits);
        summary.setTotalWithdrawals(totalWithdrawals);
        summary.setSumWithdrawals(sumWithdrawals == null ? 0.0 : sumWithdrawals);
        summary.setLastTransactionAt(lastAt);
        return summary;
    }

    @Transactional
public void deleteAccount(Long accountId) {

    Long userId = SecurityUtil.getLoggedInUserId();

    Account account = accountRepository
            .findByAccountIdAndUserId(accountId, userId)
            .orElseThrow(() ->
                new RuntimeException(
                    "Account not found or you are not authorized to delete it"
                )
            );

    accountRepository.delete(account);
}

}

