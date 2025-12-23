package com.bank.bankapp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "account",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"account_no", "ifsc_code"})
    }
)
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "account_no", nullable = false)
    private String accountNo;

    @Column(nullable = false)
    private String name;

    @Column(name = "account_type")
    private String accountType;

    @Column(nullable = false)
    private Double balance;

    @Column(name = "ifsc_code", nullable = false)
    private String ifscCode;

    // 🔐 OWNER OF THIS ACCOUNT (VERY IMPORTANT)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "created_date")
    private LocalDateTime createdDate = LocalDateTime.now();

    public Account() {}

    public Long getAccountId() {
        return accountId;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
