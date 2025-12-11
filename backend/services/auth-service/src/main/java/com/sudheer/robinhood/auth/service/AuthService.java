package com.sudheer.robinhood.auth.service;

import com.sudheer.robinhood.auth.dto.AuthResponse;
import com.sudheer.robinhood.auth.dto.LoginRequest;
import com.sudheer.robinhood.auth.dto.RegisterRequest;
import com.sudheer.robinhood.auth.model.User;
import com.sudheer.robinhood.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new RuntimeException("Username already exists");
                }

                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                User user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .passwordHash(passwordEncoder.encode(request.getPassword()))
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .isActive(true)
                                .build();

                User savedUser = userRepository.save(user);
                log.info("User registered: {}", savedUser.getUsername());

                return AuthResponse.builder()
                                .userId(savedUser.getId())
                                .username(savedUser.getUsername())
                                .email(savedUser.getEmail())
                                .firstName(savedUser.getFirstName())
                                .lastName(savedUser.getLastName())
                                .message("Registration successful")
                                .build();
        }

        @Transactional(readOnly = true)
        public AuthResponse login(LoginRequest request) {
                User user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

                if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                        throw new RuntimeException("Invalid username or password");
                }

                if (!user.getIsActive()) {
                        throw new RuntimeException("Account is inactive");
                }

                log.info("User logged in: {}", user.getUsername());

                return AuthResponse.builder()
                                .userId(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .message("Login successful")
                                .build();
        }

        @Transactional(readOnly = true)
        public AuthResponse getUserById(Long userId) {
                User user = userRepository.findById(Objects.requireNonNull(userId))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return AuthResponse.builder()
                                .userId(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .build();
        }
}
