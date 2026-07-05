package com.campushire.pict.config;

import com.campushire.pict.user.Role;
import com.campushire.pict.user.User;
import com.campushire.pict.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed default TPO user if no user exists in the system
        if (userRepository.count() == 0) {
            User defaultTpo = User.builder()
                    .email("tpo@campushire.com")
                    .password(passwordEncoder.encode("tpopassword"))
                    .role(Role.ROLE_TPO)
                    .isActive(true)
                    .firstLogin(false) // Ready to use immediately
                    .build();
            userRepository.save(defaultTpo);
            System.out.println("=================================================");
            System.out.println("SUCCESSFULLY SEEDED DEFAULT TPO ACCOUNT");
            System.out.println("Email: tpo@campushire.com");
            System.out.println("Password: tpopassword");
            System.out.println("=================================================");
        }
    }
}
