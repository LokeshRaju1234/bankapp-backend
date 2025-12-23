package com.bank.bankapp.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository repo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

      public RefreshTokenService(RefreshTokenRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public void saveRefreshToken(Long userId, String rawToken, long daysValid) {
        String hash = encoder.encode(rawToken);
        Instant expiry = Instant.now().plus(daysValid, ChronoUnit.HOURS);
        // delete existing
        repo.deleteByUserId(userId);
        RefreshToken t = new RefreshToken(userId, hash, expiry);
        repo.save(t);
    }

    @Transactional(readOnly = true)
    public boolean verifyToken(Long userId, String rawToken) {
        Optional<RefreshToken> maybe = repo.findByUserId(userId);
        if (maybe.isEmpty()) return false;
        
        RefreshToken rt = maybe.get();

        if (rt.getExpiry().isBefore(Instant.now())) {
            repo.delete(rt);
            return false;
        }

        return encoder.matches(rawToken, rt.getTokenHash());
    }

    @Transactional
    public void deleteByUserId(Long userId) {
        repo.deleteByUserId(userId);
    }
}
