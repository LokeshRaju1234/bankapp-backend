package com.bank.bankapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/accounts")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    // Create new account
    // @PostMapping
    // public Account createAccount(@RequestBody Account account) {
    //     return accountRepository.save(account);
    // }

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
    Account saved = accountRepository.save(account);
    return ResponseEntity.ok(saved);
    }

    // Get all accounts
    @GetMapping
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    // Get account by ID
    @GetMapping("/{id}")
    public Optional<Account> getAccountById(@PathVariable Long id) {
        return accountRepository.findById(id);
    }

    // Update account
//     @PutMapping("/{id}")
//     public Account updateAccount(@PathVariable Long id, @RequestBody Account updatedAccount) {
//     return accountRepository.findById(id).map(account -> {

//         account.setName(updatedAccount.getName());
//         account.setBalance(updatedAccount.getBalance());
//         account.setAccountType(updatedAccount.getAccountType());
//         account.setAccountNo(updatedAccount.getAccountNo());
//         account.setIfscCode(updatedAccount.getIfscCode());
//         // created_date should NOT be changed
//         return accountRepository.save(account);

//     }).orElse(null);
// }

@PutMapping("/{id}")
public ResponseEntity<?> updateAccount(@PathVariable Long id, @RequestBody Account updatedAccount) {

    return accountRepository.findById(id).map(account -> {

        account.setName(updatedAccount.getName());
        account.setBalance(updatedAccount.getBalance());
        account.setAccountType(updatedAccount.getAccountType());
        account.setAccountNo(updatedAccount.getAccountNo());
        account.setIfscCode(updatedAccount.getIfscCode());
        // created_date should NOT be changed

        accountRepository.save(account);
        return ResponseEntity.ok("Account Updated Successfully ✔");

    }).orElseGet(() -> ResponseEntity.status(404).body("❌ Account ID not found"));
}


// PATCH: Update only specific fields
// @PatchMapping("/{id}")
// public Account patchAccount(@PathVariable Long id, @RequestBody Account updatedFields) {
//     return accountRepository.findById(id).map(account -> {

//         if (updatedFields.getName() != null) {
//             account.setName(updatedFields.getName());
//         }
//         if (updatedFields.getAccountNo() != null) {
//             account.setAccountNo(updatedFields.getAccountNo());
//         }
//         if (updatedFields.getBalance() != null) {
//             account.setBalance(updatedFields.getBalance());
//         }
//         if (updatedFields.getAccountType() != null) {
//             account.setAccountType(updatedFields.getAccountType());
//         }
//         if (updatedFields.getIfscCode() != null) {
//             account.setIfscCode(updatedFields.getIfscCode());
//         }

//         // We do NOT allow changing createdDate in PATCH
//         return accountRepository.save(account);

//     }).orElse(null);
// }
@PatchMapping("/{id}")
public ResponseEntity<?> patchAccount(@PathVariable Long id, @RequestBody Account updatedFields) {

    return accountRepository.findById(id).map(account -> {

        if (updatedFields.getName() != null) account.setName(updatedFields.getName());
        if (updatedFields.getAccountNo() != null) account.setAccountNo(updatedFields.getAccountNo());
        if (updatedFields.getBalance() != null) account.setBalance(updatedFields.getBalance());
        if (updatedFields.getAccountType() != null) account.setAccountType(updatedFields.getAccountType());
        if (updatedFields.getIfscCode() != null) account.setIfscCode(updatedFields.getIfscCode());

        accountRepository.save(account);
        return ResponseEntity.ok("Account Updated (PATCH) Successfully ✔");

    }).orElseGet(() -> ResponseEntity.status(404).body("❌ Account ID not found"));
}



   // Delete account
    // @DeleteMapping("/{id}")
    // public void deleteAccount(@PathVariable Long id) {
    //     accountRepository.deleteById(id);
    // }

    @DeleteMapping("/{id}")
public ResponseEntity<String> deleteAccount(@PathVariable Long id) {

    if (!accountRepository.existsById(id)) {
        return ResponseEntity.status(404).body("Account not found");
    }

    accountRepository.deleteById(id);
    return ResponseEntity.ok("Account deleted successfully");
}


    // transaction controller
    // inject service
@Autowired
private AccountService accountService;

// Deposit
@PostMapping("/{id}/deposit")
public Account deposit(@PathVariable Long id, @RequestParam Double amount, @RequestParam(required = false) String description) {
    return accountService.deposit(id, amount, description == null ? "Deposit" : description);
}

// Withdraw
@PostMapping("/{id}/withdraw")
public Account withdraw(@PathVariable Long id, @RequestParam Double amount, @RequestParam(required = false) String description) {
    return accountService.withdraw(id, amount, description == null ? "Withdraw" : description);
}

// Transfer
@PostMapping("/transfer")
public String transfer(@RequestParam Long fromAccountId, @RequestParam Long toAccountId, @RequestParam Double amount, @RequestParam(required=false) String description) {
    accountService.transfer(fromAccountId, toAccountId, amount, description == null ? "Transfer" : description);
    return "Transfer successful";
}

// Get transaction history for account
// 1️⃣ Simple — Get all transactions
// @GetMapping("/{id}/transactions")
// public List<Transaction> getTransactions(@PathVariable Long id) {
//     return accountService.getTransactions(id);
// }

@GetMapping("/{id}/transactions")
public ResponseEntity<?> getTransactions(@PathVariable Long id) {

    if (!accountRepository.existsById(id)) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("❌ Account ID not found: " + id);
    }

    List<Transaction> transactions = accountService.getTransactions(id);
    return ResponseEntity.ok(transactions);
}


// 2️⃣ Filter — type OR date range
@GetMapping("/{id}/transactions/filter")
public ResponseEntity<List<Transaction>> getFilteredTransactions(
        @PathVariable Long id,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String start,
        @RequestParam(required = false) String end
) {
    // filter by type
    if (type != null) {
        return ResponseEntity.ok(accountService.getTransactionsByType(id, type));
    }

    // filter by date range
    if (start != null && end != null) {
        LocalDateTime startDate = LocalDateTime.parse(start);
        LocalDateTime endDate = LocalDateTime.parse(end);
        return ResponseEntity.ok(accountService.getTransactionsByDateRange(id, startDate, endDate));
    }

    // default → all
    return ResponseEntity.ok(accountService.getTransactions(id));
}

// Account summary
@GetMapping("/{id}/summary")
public ResponseEntity<AccountSummary> getAccountSummary(@PathVariable Long id) {
    AccountSummary summary = accountService.getAccountSummary(id);
    return ResponseEntity.ok(summary);
}

}
