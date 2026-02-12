package com.example.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.UserDTO;
import com.example.demo.model.entity.User;
import com.example.demo.model.entity.UserLog;
import com.example.demo.service.LogService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private LogService logService;

    // ==================== GET ALL ====================
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> dtos = userService.findAll().stream()
                .map(u -> new UserDTO(
                        u.getId(),
                        u.getUsername(),
                        u.getRole(),
                        u.getCreatedAt(),
                        u.getLastLogin()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // ==================== GET ONE ====================
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(u -> new UserDTO(
                        u.getId(),
                        u.getUsername(),
                        u.getRole(),
                        u.getCreatedAt(),
                        u.getLastLogin()
                ))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==================== CREATE ====================
    @PostMapping("/users")
    public ResponseEntity<UserDTO> createUser(@RequestBody User user) {
        // Nota: si quieres, aquí puedes hashear la contraseña antes de guardar
        User created = userService.createUser(user);
        UserDTO dto = new UserDTO(
                created.getId(),
                created.getUsername(),
                created.getRole(),
                created.getCreatedAt(),
                created.getLastLogin()
        );
        return ResponseEntity.ok(dto);
    }

    // ==================== UPDATE ====================
    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            User updated = userService.updateUser(id, updatedUser);
            UserDTO dto = new UserDTO(
                    updated.getId(),
                    updated.getUsername(),
                    updated.getRole(),
                    updated.getCreatedAt(),
                    updated.getLastLogin()
            );
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== DELETE ====================
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
    
    // ===== Crear un log =====
    @PostMapping("/add")
    public String addLog(@RequestParam String username,
                         @RequestParam String action,
                         @RequestParam(required = false) String details) {
        logService.log(username, action, details != null ? details : "", details);
        return "Log registrado correctamente";
    }

    // ===== Listar todos los logs =====
    @GetMapping("/all")
    public List<UserLog> getAllLogs() {
        return logService.getAllLogs();
    }
    
}
