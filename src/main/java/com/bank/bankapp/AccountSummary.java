package com.bank.bankapp;

import java.time.LocalDateTime;

public class AccountSummary {
    private Long accountId;
    private Double balance;

    private long totalDeposits;
    private Double sumDeposits;

    private long totalWithdrawals;
    private Double sumWithdrawals;

    private LocalDateTime lastTransactionAt;

    public AccountSummary() {}

    // All-args constructor (optional)
    public AccountSummary(Long accountId, Double balance, long totalDeposits, Double sumDeposits,
                          long totalWithdrawals, Double sumWithdrawals, LocalDateTime lastTransactionAt) {
        this.accountId = accountId;
        this.balance = balance;
        this.totalDeposits = totalDeposits;
        this.sumDeposits = sumDeposits;
        this.totalWithdrawals = totalWithdrawals;
        this.sumWithdrawals = sumWithdrawals;
        this.lastTransactionAt = lastTransactionAt;
    }

    // getters + setters
    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
    public long getTotalDeposits() { return totalDeposits; }
    public void setTotalDeposits(long totalDeposits) { this.totalDeposits = totalDeposits; }
    public Double getSumDeposits() { return sumDeposits; }
    public void setSumDeposits(Double sumDeposits) { this.sumDeposits = sumDeposits; }
    public long getTotalWithdrawals() { return totalWithdrawals; }
    public void setTotalWithdrawals(long totalWithdrawals) { this.totalWithdrawals = totalWithdrawals; }
    public Double getSumWithdrawals() { return sumWithdrawals; }
    public void setSumWithdrawals(Double sumWithdrawals) { this.sumWithdrawals = sumWithdrawals; }
    public LocalDateTime getLastTransactionAt() { return lastTransactionAt; }
    public void setLastTransactionAt(LocalDateTime lastTransactionAt) { this.lastTransactionAt = lastTransactionAt; }
}
