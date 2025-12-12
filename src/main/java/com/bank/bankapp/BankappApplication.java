package com.bank.bankapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class BankappApplication extends SpringBootServletInitializer {

    // For WAR deployment on external Tomcat
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BankappApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(BankappApplication.class, args);
    }
}
