package com.bank.bankapp;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountAccountIdOrderByCreatedAtDesc(Long accountId);
     List<Transaction> findByAccountAccountIdAndTypeOrderByCreatedAtDesc(Long accountId, String type);

    // Filter by date range
    List<Transaction> findByAccountAccountIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long accountId,
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.account.accountId = :accountId AND t.type = :type")
    long countByAccountAndType(@Param("accountId") Long accountId, @Param("type") String type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.account.accountId = :accountId AND t.type = :type")
    Double sumAmountByAccountAndType(@Param("accountId") Long accountId, @Param("type") String type);

    @Query("SELECT t FROM Transaction t WHERE t.account.accountId = :accountId ORDER BY t.createdAt DESC")
    List<Transaction> findLatestTransactionForAccount(@Param("accountId") Long accountId);
}
