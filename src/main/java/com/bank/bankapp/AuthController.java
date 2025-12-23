package com.bank.bankapp;

import com.bank.bankapp.auth.RefreshTokenService;
import com.bank.bankapp.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(
    origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    },
    allowCredentials = "true"
)
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepo.findByUsername(user.getUsername()) != null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return ResponseEntity.ok("Registered Successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        System.out.println("LOGIN CONTROLLER HIT");
        String username = creds.get("username");
        String password = creds.get("password");

        User db = userRepo.findByUsername(username);
        if (db == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        if (!passwordEncoder.matches(password, db.getPassword()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", "USER");
        claims.put("userId", db.getId());

        String access = jwtUtil.generateAccessToken(username,claims);
        String refresh = jwtUtil.generateRefreshToken(username);

        // store hashed refresh token and expiry
        refreshService.saveRefreshToken(db.getId(), refresh, 2); // 7 days

        // set HttpOnly Secure cookie (SameSite=Strict)
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refresh)
                .httpOnly(true)
                .secure(false) // set to true in production with HTTPS
                .path("/")
                .maxAge(2 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("accessToken", access));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || !jwtUtil.validateToken(refreshToken))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");

        String username = jwtUtil.getUsernameFromToken(refreshToken);
        User db = userRepo.findByUsername(username);
        if (db == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");

        // verify stored hashed token
        boolean ok = refreshService.verifyToken(db.getId(), refreshToken);
        if (!ok) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token invalid");

        // generate new tokens (rotate)
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", "USER");
        claims.put("userId", db.getId());

        String newAccess = jwtUtil.generateAccessToken(username, claims);
        String newRefresh = jwtUtil.generateRefreshToken(username);

        refreshService.saveRefreshToken(db.getId(), newRefresh, 2);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefresh)
                .httpOnly(true)
                .secure(false) // true in production
                .path("/")
                .maxAge(2 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("accessToken", newAccess));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        User db = userRepo.findByUsername(username);
        if (db != null) refreshService.deleteByUserId(db.getId());

        // clear cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out");
    }
}
