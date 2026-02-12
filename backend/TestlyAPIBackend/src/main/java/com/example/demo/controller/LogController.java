package com.example.demo.controller;

import com.example.demo.model.entity.UserLog;
import com.example.demo.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/logs")
public class LogController {

    @Autowired
    private LogService logService;

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
