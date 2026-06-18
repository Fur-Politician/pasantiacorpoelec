import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { dbConfig } from './bd/config.js';

/**
 * Script de inicialización de la Base de Datos.
 * Este script crea la base de datos y todas las tablas necesarias.
 */
async function initializeDatabase() {
    // Extraemos la configuración para conectar inicialmente sin base de datos seleccionada
    const { database, ...connectionConfig } = dbConfig;
    let connection;

    try {
        console.log('--- Iniciando configuración de Base de Datos ---');
        
        // 1. Conexión inicial al servidor MySQL
        connection = await mysql.createConnection(connectionConfig);
        console.log('✅ Conexión al servidor establecida.');

        // 2. Crear base de datos si no existe
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
        console.log(`✅ Base de datos "${database}" verificada/creada.`);

        // 3. Seleccionar la base de datos
        await connection.query(`USE ${database}`);

        // 4. Leer el archivo SQL (usamos la ruta absoluta proporcionada)
        const sqlPath = path.resolve(process.cwd(), 'bd', 'scripts', 'create_tables.sql'); // Ruta corregida
        const sqlSchema = await fs.readFile(sqlPath, 'utf8');

        // 5. Ejecutar los comandos SQL (divididos por punto y coma)
        // Nota: Esto es una simplificación, para archivos muy grandes se recomienda usar un stream.
        const commands = sqlSchema.split(';').filter(cmd => cmd.trim().length > 0);
        
        for (const command of commands) {
            await connection.query(command);
        }
        
        console.log('✅ Estructura de tablas creada exitosamente.');
        console.log('--- Configuración finalizada con éxito ---');

    } catch (error) {
        console.error('❌ Error crítico durante la inicialización:', error.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

initializeDatabase();