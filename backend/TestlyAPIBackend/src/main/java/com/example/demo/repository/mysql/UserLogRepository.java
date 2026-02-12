package com.example.demo.repository.mysql;

import com.example.demo.model.entity.UserLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para la entidad UserLog. Maneja las operaciones de base de datos
 * para los logs del sistema.
 */
@Repository
public interface UserLogRepository extends JpaRepository<UserLog, Long> {
    List<UserLog> findAllByOrderByTimestampDesc();
}