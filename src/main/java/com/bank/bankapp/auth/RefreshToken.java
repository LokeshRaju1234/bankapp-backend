package com.bank.bankapp.auth;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false, length = 512)
    private String tokenHash;

    private Instant expiry;

    public RefreshToken() {}

    public RefreshToken(Long userId, String tokenHash, Instant expiry) {
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.expiry = expiry;
    }

    // getters and setters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getTokenHash() { return tokenHash; }
    public Instant getExpiry() { return expiry; }
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setTokenHash(String tokenHash) { this.tokenHash = tokenHash; }
    public void setExpiry(Instant expiry) { this.expiry = expiry; }
}
