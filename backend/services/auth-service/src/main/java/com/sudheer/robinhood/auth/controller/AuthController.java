package com.sudheer.robinhood.auth.controller;

import com.sudheer.robinhood.auth.dto.AuthResponse;
import com.sudheer.robinhood.auth.dto.LoginRequest;
import com.sudheer.robinhood.auth.dto.RegisterRequest;
import com.sudheer.robinhood.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<AuthResponse> getUser(@PathVariable Long userId) {
        AuthResponse response = authService.getUserById(userId);
        return ResponseEntity.ok(response);
    }
}
