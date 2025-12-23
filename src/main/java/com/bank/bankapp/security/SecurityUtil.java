package com.bank.bankapp.security;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    public static Long getLoggedInUserId() {

        Object principal =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        if (principal instanceof Long) {
            return (Long) principal;
        }

        throw new RuntimeException("User not authenticated");
    }
}
