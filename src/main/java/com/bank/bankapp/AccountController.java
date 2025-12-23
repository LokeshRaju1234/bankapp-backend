package com.bank.bankapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountRepository accountRepository;

    /* ---------------- CREATE ACCOUNT ---------------- */
    @PostMapping
    public Account createAccount(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    /* ---------------- GET ACCOUNTS ---------------- */
    @GetMapping
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Account> getAccountById(@PathVariable Long id) {
        return accountRepository.findById(id);
    }

    /* ---------------- UPDATE ACCOUNT ---------------- */
    @PutMapping("/{id}")
    public Account updateAccount(
            @PathVariable Long id,
            @RequestBody Account updatedAccount) {

        return accountRepository.findById(id).map(account -> {

            account.setName(updatedAccount.getName());
            account.setBalance(updatedAccount.getBalance());
            account.setAccountType(updatedAccount.getAccountType());
            account.setAccountNo(updatedAccount.getAccountNo());
            account.setIfscCode(updatedAccount.getIfscCode());

            return accountRepository.save(account);

        }).orElseThrow(() ->
            new RuntimeException("Account not found")
        );
    }

    /* ---------------- PATCH ACCOUNT ---------------- */
    @PatchMapping("/{id}")
    public Account patchAccount(
            @PathVariable Long id,
            @RequestBody Account updatedFields) {

        return accountRepository.findById(id).map(account -> {

            if (updatedFields.getName() != null) {
                account.setName(updatedFields.getName());
            }
            if (updatedFields.getAccountNo() != null) {
                account.setAccountNo(updatedFields.getAccountNo());
            }
            if (updatedFields.getBalance() != null) {
                account.setBalance(updatedFields.getBalance());
            }
            if (updatedFields.getAccountType() != null) {
                account.setAccountType(updatedFields.getAccountType());
            }
            if (updatedFields.getIfscCode() != null) {
                account.setIfscCode(updatedFields.getIfscCode());
            }

            return accountRepository.save(account);

        }).orElseThrow(() ->
            new RuntimeException("Account not found")
        );
    }

    /* ---------------- DELETE ACCOUNT (SECURE) ---------------- */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok("Account deleted successfully");
    }

    /* ---------------- TRANSACTIONS ---------------- */
    @PostMapping("/{id}/deposit")
    public Account deposit(
            @PathVariable Long id,
            @RequestParam Double amount,
            @RequestParam(required = false) String description) {

        return accountService.deposit(
                id,
                amount,
                description == null ? "Deposit" : description
        );
    }

    @PostMapping("/{id}/withdraw")
    public Account withdraw(
            @PathVariable Long id,
            @RequestParam Double amount,
            @RequestParam(required = false) String description) {

        return accountService.withdraw(
                id,
                amount,
                description == null ? "Withdraw" : description
        );
    }

    @PostMapping("/transfer")
    public String transfer(
            @RequestParam Long fromAccountId,
            @RequestParam Long toAccountId,
            @RequestParam Double amount,
            @RequestParam(required = false) String description) {

        accountService.transfer(
                fromAccountId,
                toAccountId,
                amount,
                description == null ? "Transfer" : description
        );
        return "Transfer successful";
    }

    /* ---------------- TRANSACTION HISTORY ---------------- */
    @GetMapping("/{id}/transactions")
    public List<Transaction> getTransactions(@PathVariable Long id) {
        return accountService.getTransactions(id);
    }

    @GetMapping("/{id}/transactions/filter")
    public ResponseEntity<List<Transaction>> getFilteredTransactions(
            @PathVariable Long id,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {

        if (type != null) {
            return ResponseEntity.ok(
                accountService.getTransactionsByType(id, type)
            );
        }

        if (start != null && end != null) {
            LocalDateTime startDate = LocalDateTime.parse(start);
            LocalDateTime endDate = LocalDateTime.parse(end);
            return ResponseEntity.ok(
                accountService.getTransactionsByDateRange(
                    id, startDate, endDate
                )
            );
        }

        return ResponseEntity.ok(accountService.getTransactions(id));
    }

    /* ---------------- ACCOUNT SUMMARY ---------------- */
    @GetMapping("/{id}/summary")
    public ResponseEntity<AccountSummary> getAccountSummary(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            accountService.getAccountSummary(id)
        );
    }
}
