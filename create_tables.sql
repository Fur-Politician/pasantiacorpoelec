-- /mi-proyecto/bd/scripts/create_tables.sql
-- Script de creación de base de datos basado en guia.png
CREATE DATABASE IF NOT EXISTS corpoelec_gestion_db;
USE corpoelec_gestion_db;

-- 1. Tabla Principal: Trabajador
CREATE TABLE IF NOT EXISTS Trabajador (
    ID_Trabajador INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Apellido VARCHAR(255) NOT NULL,
    Cedula VARCHAR(20) NOT NULL UNIQUE,
    Cargo VARCHAR(100),
    Departamento VARCHAR(100),
    Pass VARCHAR(255) NOT NULL,
    Nivel VARCHAR(50),
    Num_Tlf VARCHAR(20)
);

-- 2. Tabla: Especificaciones (Referenciada por Materiales)
CREATE TABLE IF NOT EXISTS Especificaciones (
    ID_Especificaciones INT AUTO_INCREMENT PRIMARY KEY,
    Procesador VARCHAR(100),
    Velocidad VARCHAR(50),
    Memoria_Ram VARCHAR(50),
    Discoduro VARCHAR(50),
    S_O VARCHAR(50),
    Nombre_Eq VARCHAR(100)
);

-- 3. Tabla: Motivo (Referenciada por Permiso)
CREATE TABLE IF NOT EXISTS Motivo (
    ID_Motivo INT AUTO_INCREMENT PRIMARY KEY,
    Matrimonio_Fed TINYINT(1) DEFAULT 0,
    Matrimonio_ExFed TINYINT(1) DEFAULT 0,
    Rend_Dec TINYINT(1) DEFAULT 0,
    Act_Dep TINYINT(1) DEFAULT 0,
    Det_P TINYINT(1) DEFAULT 0,
    Serv_Mil TINYINT(1) DEFAULT 0,
    Fall_Fed TINYINT(1) DEFAULT 0,
    Fall_ExFed TINYINT(1) DEFAULT 0,
    Nac TINYINT(1) DEFAULT 0,
    Enf TINYINT(1) DEFAULT 0,
    Ren_Ced TINYINT(1) DEFAULT 0,
    Cert_Sal TINYINT(1) DEFAULT 0,
    Libr_Mil TINYINT(1) DEFAULT 0,
    Lic_Cond TINYINT(1) DEFAULT 0,
    Cert_Med TINYINT(1) DEFAULT 0,
    Insc TINYINT(1) DEFAULT 0,
    Det_A TINYINT(1) DEFAULT 0,
    Desc_Mat TINYINT(1) DEFAULT 0,
    Cons_Med TINYINT(1) DEFAULT 0,
    Otr VARCHAR(255),
    Mens INT,
    Sem INT,
    Ejec INT
);

-- 4. Tabla: Tipo_Permiso (Referenciada por Permiso)
CREATE TABLE IF NOT EXISTS Tipo_Permiso (
    ID_Tipo INT AUTO_INCREMENT PRIMARY KEY,
    Jor_Esp_Rem TINYINT(1) DEFAULT 0,
    Jor_Par_Rem TINYINT(1) DEFAULT 0,
    Jor_Par_Injus TINYINT(1) DEFAULT 0,
    Aus_Injus TINYINT(1) DEFAULT 0,
    Rem_CL50 TINYINT(1) DEFAULT 0,
    Aus_No_Rem TINYINT(1) DEFAULT 0,
    No_Rem_CL52 TINYINT(1) DEFAULT 0,
    obser TEXT
);

-- 5. Tabla: Asistencia
CREATE TABLE IF NOT EXISTS Asistencia (
    ID_Asistencia INT AUTO_INCREMENT PRIMARY KEY,
    ID_Trabajador INT,
    Hora_Arr TIME,
    Hora_Ext TIME,
    Dia DATE,
    FOREIGN KEY (ID_Trabajador) REFERENCES Trabajador(ID_Trabajador) ON DELETE CASCADE
);

-- 6. Tabla: Materiales
CREATE TABLE IF NOT EXISTS Materiales (
    ID_Materiales INT AUTO_INCREMENT PRIMARY KEY,
    ID_Trabajador INT,
    Lugar VARCHAR(255),
    tipo VARCHAR(100),
    Act VARCHAR(100),
    Ser VARCHAR(100),
    Mode VARCHAR(100),
    Marca VARCHAR(100),
    Obs TEXT,
    Proc_Act VARCHAR(100),
    Fecha DATE,
    ID_Especificaciones INT,
    FOREIGN KEY (ID_Trabajador) REFERENCES Trabajador(ID_Trabajador),
    FOREIGN KEY (ID_Especificaciones) REFERENCES Especificaciones(ID_Especificaciones)
);

-- 7. Tabla: Permiso
CREATE TABLE IF NOT EXISTS Permiso (
    ID_Permiso INT AUTO_INCREMENT PRIMARY KEY,
    ID_Trabajador INT,
    Cargo_ext VARCHAR(100),
    Lugar VARCHAR(255),
    Fecha DATE,
    Duracion_Fr TIME,
    Duracion_To TIME,
    Tipo VARCHAR(100),
    Observ TEXT,
    ID_Motivo INT,
    ID_Tipo INT,
    FOREIGN KEY (ID_Trabajador) REFERENCES Trabajador(ID_Trabajador),
    FOREIGN KEY (ID_Motivo) REFERENCES Motivo(ID_Motivo),
    FOREIGN KEY (ID_Tipo) REFERENCES Tipo_Permiso(ID_Tipo)
);

-- 8. Tabla: Logs
CREATE TABLE IF NOT EXISTS Logs (
    ID_Logs INT AUTO_INCREMENT PRIMARY KEY,
    ID_Trabajador INT,
    Fecha DATE,
    Hora TIME,
    Tarea TEXT,
    FOREIGN KEY (ID_Trabajador) REFERENCES Trabajador(ID_Trabajador)
);