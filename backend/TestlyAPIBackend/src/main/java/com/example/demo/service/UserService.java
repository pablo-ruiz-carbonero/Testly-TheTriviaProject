package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.User;
import com.example.demo.repository.mysql.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LogService logService;

    // ==================== GET ====================
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    // ==================== CREATE ====================
    public User createUser(User user) {
        User savedUser = userRepository.save(user);
        logService.log(savedUser.getUsername(), "CREAR_USUARIO", "Usuario creado", "INFO");
        return savedUser;
    }

    // ==================== UPDATE ====================
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setRole(updatedUser.getRole());
            User saved = userRepository.save(user);
            logService.log(saved.getUsername(), "ACTUALIZAR_USUARIO", "Usuario actualizado", "INFO");
            return saved;
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // ==================== DELETE ====================
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        userRepository.deleteById(id);
        logService.log(user.getUsername(), "ELIMINAR_USUARIO", "Usuario eliminado", "INFO");
    }

    // ==================== LOGIN ====================
    public User login(String username, String password) {
        User user = findByUsername(username);
        if (user != null && checkPassword(password, user.getPassword())) {
            logService.log(username, "LOGIN", "Inicio de sesión exitoso", "INFO");
            return user;
        } else {
            logService.log(username, "LOGIN_FAILED", "Intento fallido de inicio de sesión", "WARNING");
            throw new RuntimeException("Credenciales inválidas");
        }
    }

    // ==================== CAMBIO DE ROL ====================
    public void changeRole(Long userId, String newRole) {
        User user = findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        String oldRole = user.getRole();
        user.setRole(newRole);
        userRepository.save(user);
        logService.log(user.getUsername(), "CAMBIO_ROL", "De " + oldRole + " a " + newRole, "INFO");
    }

    // ==================== AUXILIARES ====================
    // Aquí puedes reemplazar por tu hashing real (BCrypt, Argon2, etc.)
    private boolean checkPassword(String rawPassword, String hashedPassword) {
        return rawPassword.equals(hashedPassword); // temporal, cambiar en producción
    }
}
