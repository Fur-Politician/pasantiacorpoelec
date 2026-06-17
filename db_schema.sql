CREATE DATABASE IF NOT EXISTS corpoelec_gestion_db;
USE corpoelec_gestion_db;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(50),
    rol ENUM('admin', 'operador', 'visor') DEFAULT 'operador',
    password VARCHAR(255) NOT NULL
);

-- Tabla de Logs (Auditoría)
CREATE TABLE logs_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    accion VARCHAR(255), -- Ej: "Retiro de Material", "Registro de Asistencia"
    tabla_afectada VARCHAR(50),
    detalles TEXT, -- JSON con los cambios realizados
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de Materiales
CREATE TABLE materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_sap VARCHAR(50) UNIQUE,
    descripcion VARCHAR(255),
    stock_actual INT DEFAULT 0,
    unidad_medida VARCHAR(20)
);

-- Registro de Retiros (Inspirado en el formato de asignación)
CREATE TABLE retiros_materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    material_id INT,
    cantidad INT,
    observacion TEXT,
    fecha_retiro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (material_id) REFERENCES materiales(id)
);

-- Tabla de Asistencias para registro de entrada y salida con geolocalización
CREATE TABLE asistencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('entrada', 'salida') NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Usuario Administrador Temporal
INSERT INTO usuarios (cedula, nombre, cargo, rol, password) 
VALUES ('31325616', 'Admin Sistema', 'Administrador IT', 'admin', '123');