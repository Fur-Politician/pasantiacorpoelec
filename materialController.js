import db from './config/db.js';

/**
 * Controlador para la gestión de materiales y retiros.
 */
const materialController = {
    /**
     * Registra un retiro de material y actualiza el stock.
     * Utiliza una transacción para asegurar la integridad de la DB.
     */
    registrarRetiro: async (req, res) => {
        const { usuario_id, material_id, cantidad, observacion } = req.body;
        
        // Obtener conexión para la transacción
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            // 1. Verificar existencia y stock suficiente
            // Se utiliza FOR UPDATE para bloquear la fila y evitar condiciones de carrera (race conditions)
            const [materialRows] = await connection.execute(
                'SELECT stock_actual, descripcion FROM materiales WHERE id = ? FOR UPDATE',
                [material_id]
            );

            if (materialRows.length === 0) {
                throw new Error('El material solicitado no existe.');
            }

            const material = materialRows[0];
            if (material.stock_actual < cantidad) {
                throw new Error(`Stock insuficiente para ${material.descripcion}. Disponible: ${material.stock_actual}`);
            }

            // 2. Insertar el registro de retiro
            const [retiroResult] = await connection.execute(
                'INSERT INTO retiros_materiales (usuario_id, material_id, cantidad, observacion) VALUES (?, ?, ?, ?)',
                [usuario_id, material_id, cantidad, observacion]
            );

            // 3. Descontar el stock de la tabla de materiales
            await connection.execute(
                'UPDATE materiales SET stock_actual = stock_actual - ? WHERE id = ?',
                [cantidad, material_id]
            );

            // 4. Registrar la acción en el log de auditoría
            // Guardamos el estado anterior y el nuevo para trazabilidad completa
            const logDetalles = {
                material: material.descripcion,
                cantidad_retirada: cantidad,
                stock_anterior: material.stock_actual,
                stock_nuevo: material.stock_actual - cantidad,
                retiro_id: retiroResult.insertId
            };

            await connection.execute(
                'INSERT INTO logs_sistema (usuario_id, accion, tabla_afectada, detalles) VALUES (?, ?, ?, ?)',
                [usuario_id, 'RETIRO_MATERIAL', 'retiros_materiales', JSON.stringify(logDetalles)]
            );

            // Confirmar todos los cambios
            await connection.commit();

            return res.status(201).json({
                success: true,
                message: 'Retiro registrado exitosamente y stock actualizado.',
                data: { retiroId: retiroResult.insertId }
            });

        } catch (error) {
            // Si algo falla, revertimos cualquier cambio hecho durante la transacción
            await connection.rollback();
            
            console.error('Error en registrarRetiro:', error.message);
            
            return res.status(400).json({
                success: false,
                message: error.message || 'Error interno al procesar el retiro.'
            });
        } finally {
            // Liberar la conexión al pool
            connection.release();
        }
    },

    /**
     * Obtiene el listado de materiales disponibles
     */
    obtenerMateriales: async (req, res) => {
        // Lógica para listar materiales...
    }
};

export default materialController;