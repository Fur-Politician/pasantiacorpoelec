/**
 * Configuración de la base de datos MySQL.
 */
export const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'pasantes',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'corpoelec_gestion_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};