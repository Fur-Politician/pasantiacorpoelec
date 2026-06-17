import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './api.js';

// Carga de variables de entorno (DB_HOST, DB_USER, DB_PASS, etc.)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * 1. CORS - DEBE SER EL PRIMER MIDDLEWARE
 * Configuramos para aceptar peticiones de Vite (5173) explícitamente.
 */
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
}));

/** 
 * MIDDLEWARE DE LOGGING Y AUDITORÍA DE PETICIONES
 * Registra cada hit a la API antes de ser procesado por las rutas.
 */
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        // Formato de log técnico para depuración y seguridad
        console.log(`[AUDIT] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | IP: ${req.ip} | ${duration}ms`);
    });
    next();
});

/**
 * CONFIGURACIÓN DE PARSEO
 * Aumentamos la seguridad limitando el tamaño del JSON entrante (prevención DoS).
 */
app.use(express.json({ limit: '50kb' })); 
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

/**
 * Ruta de Salud (Health Check)
 * Úsala para verificar en el navegador: http://127.0.0.1:5000/ping
 */
app.get('/ping', (req, res) => res.send('pong'));

/**
 * Definición de Prefijo para API
 */
app.use('/api', apiRoutes);

/**
 * Manejador de errores global
 * Captura cualquier excepción no manejada en los controladores
 */
app.use((err, req, res, next) => {
    console.error('[Server Error]:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Ocurrió un error interno en el servidor de Corpoelec.'
    });
});

// Forzamos a que escuche en 0.0.0.0 o 127.0.0.1 para evitar problemas de resolución DNS en Firefox
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de Gestión Corpoelec corriendo en http://127.0.0.1:${PORT}`);
});