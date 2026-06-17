import db from './config/db.js';

/**
 * Controlador para la gestión de Asistencia (Entrada/Salida).
 */
const asistenciaController = {
    /**
     * Registra un evento de asistencia capturando coordenadas GPS.
     * Utiliza transacciones para asegurar que el registro y el log se guarden correctamente.
     */
    registrarAsistencia: async (req, res) => {
        const { usuario_id, tipo, latitud, longitud } = req.body;

        // Validación básica de negocio
        if (!['entrada', 'salida'].includes(tipo)) {
            return res.status(400).json({ success: false, message: 'Tipo de asistencia inválido.' });
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Insertar el registro de asistencia
            const [result] = await connection.execute(
                'INSERT INTO asistencias (usuario_id, tipo, latitud, longitud) VALUES (?, ?, ?, ?)',
                [usuario_id, tipo, latitud, longitud]
            );

            // 2. Registro mandatorio en el log de auditoría
            const logDetalles = {
                tipo,
                coords: { lat: latitud, lng: longitud },
                timestamp: new Date().toISOString(),
                registro_id: result.insertId
            };

            await connection.execute(
                'INSERT INTO logs_sistema (usuario_id, accion, tabla_afectada, detalles) VALUES (?, ?, ?, ?)',
                [usuario_id, `REGISTRO_ASISTENCIA_${tipo.toUpperCase()}`, 'asistencias', JSON.stringify(logDetalles)]
            );

            await connection.commit();

            return res.status(201).json({
                success: true,
                message: `Registro de ${tipo} realizado con éxito.`
            });

        } catch (error) {
            await connection.rollback();
            console.error('Error en asistenciaController:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno al procesar el registro de asistencia.'
            });
        } finally {
            connection.release();
        }
    }
};

export default asistenciaController;