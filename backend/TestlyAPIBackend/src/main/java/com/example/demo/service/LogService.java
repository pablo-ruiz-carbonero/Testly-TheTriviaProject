package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.UserLog;
import com.example.demo.repository.mysql.UserLogRepository;

import java.util.List;

@Service
public class LogService {

    @Autowired
    private UserLogRepository logRepository;

    // Guardar log
    public void log(String username, String action, String details, String level) {
        UserLog log = new UserLog();
        log.setUsername(username);
        log.setAction(action);
        log.setDetails(details);
        log.setLevel(level);
        logRepository.save(log);
    }

    // Obtener todos los logs
    public List<UserLog> getAllLogs() {
        return logRepository.findAllByOrderByTimestampDesc();
    }
}
