package com.example.demo.controller;

import com.example.demo.model.entity.User;
import com.example.demo.repository.mysql.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        if(userRepository.findByUsername(body.get("username")).isPresent()) {
            return ResponseEntity.status(409).body("El usuario ya existe");
        }
        User u = new User();
        u.setUsername(body.get("username"));
        u.setPassword(passwordEncoder.encode(body.get("password")));
        u.setRole("USER");
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        
        // Buscamos al usuario para obtener su rol de la base de datos
        User user = userRepository.findByUsername(principal.getName()).get();
        
        return ResponseEntity.ok(Map.of(
            "username", user.getUsername(),
            "role", user.getRole(), // <--- IMPORTANTE: Enviamos el rol (ej: "ADMIN")
            "authenticated", true
        ));
    }
    
}