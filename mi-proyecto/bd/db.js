import mysql from 'mysql2/promise';
import { dbConfig } from './config.js';

/**
 * Crea un pool de conexiones a la base de datos MySQL.
 */
const pool = mysql.createPool(dbConfig);

/**
 * Función para ejecutar consultas SQL de forma asíncrona.
 * @param {string} sql - Consulta SQL.
 * @param {Array} params - Parámetros de la consulta.
 */
export async function query(sql, params) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error("Error en la base de datos:", error.message);
        throw new Error("Error en la base de datos: " + error.message);
    }
}