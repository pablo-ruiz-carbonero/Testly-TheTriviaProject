-- IMPORTANTE: Usa el mismo nombre que en el docker-compose
USE testly_users;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para las puntuaciones
CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    date_taken TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Estructura (asegúrate de que coincida con tu entidad User.java)
-- Si tu entidad tiene id, username, password, role
INSERT INTO users (username, password, role) VALUES 
-- Contraseña: 'admin123'
('admin', '$2a$10$GRLdNijSQMUvl/au9P8LCOlpYNf19K9dfyGMr19.3.MAbifS7D5Kn', 'ADMIN'),
-- Contraseña: 'pablo123'
('pablo', '$2a$10$vXf9vN5YvG8S8.u3B.5rIu9uG5uV5uG5uV5uG5uV5uG5uV5uG5uV.', 'USER');
