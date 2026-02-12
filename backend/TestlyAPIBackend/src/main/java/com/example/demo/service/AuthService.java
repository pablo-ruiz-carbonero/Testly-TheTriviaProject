package com.example.demo.service;

import com.example.demo.model.entity.User;
import com.example.demo.repository.mysql.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final LogService logService;

    public AuthService(UserRepository userRepository, LogService logService) {
        this.userRepository = userRepository;
        this.logService = logService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logService.log(username, "LOGIN_FAILED", "Intento fallido de login", "WARNING");
                    return new UsernameNotFoundException("Usuario no encontrado");
                });

        // Login exitoso (Spring Security lo manejará)
        logService.log(username, "LOGIN_SUCCESS", "Login exitoso", "INFO");

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}
