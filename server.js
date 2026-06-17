import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

// Carga de variables de entorno (DB_HOST, DB_USER, DB_PASS, etc.)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middlewares Globales
 */
app.use(cors()); // Habilita Cross-Origin Resource Sharing
app.use(express.json()); // Permite recibir JSON en el body de las peticiones

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

app.listen(PORT, () => {
    console.log(`Servidor de Gestión Corpoelec corriendo en el puerto ${PORT}`);
});