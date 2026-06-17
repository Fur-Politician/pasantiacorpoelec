import express from 'express';
import materialController from '../../materialController.js';
import asistenciaController from './asistenciaController.js';

const router = express.Router();

/**
 * Rutas de Gestión de Materiales
 */

// Registrar un nuevo retiro (descuenta stock y genera log)
router.post('/materiales/retiro', materialController.registrarRetiro);

// Obtener catálogo de materiales (para llenar selectores en el frontend)
router.get('/materiales', materialController.obtenerMateriales);

/** Rutas de Asistencia */
router.post('/asistencia/registrar', asistenciaController.registrarAsistencia);

export default router;