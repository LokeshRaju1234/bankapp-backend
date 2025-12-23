package com.bank.bankapp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    // JpaRepository provides CRUD methods automatically
    
    
    // 🔍 Check if account already exists with same account number + IFSC
    boolean existsByAccountNoAndIfscCode(String accountNo, String ifscCode);

    // 🔐 Used to allow delete ONLY if account belongs to logged-in user
    Optional<Account> findByAccountIdAndUserId(Long accountId, Long userId);
}
