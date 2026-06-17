import db from './config/db.js';

/**
 * Controlador para la Gestión Administrativa de Usuarios.
 */
const usuarioController = {
    /**
     * Obtiene la lista de todos los usuarios (exceptuando passwords).
     */
    obtenerUsuarios: async (req, res) => {
        try {
            const [rows] = await db.execute('SELECT id, cedula, nombre, apellido, rol, departamento, subdepartamento, rol_especifico FROM usuarios');
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ success: false, message: 'Error al consultar la base de datos.' });
        }
    },

    /**
     * Registra un nuevo usuario y guarda el log de la acción.
     */
    registrarUsuario: async (req, res) => {
        const { admin_id, cedula, nombre, apellido, rol, departamento, subdepartamento, rol_especifico, password } = req.body;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insertar usuario
            const [result] = await connection.execute(
                'INSERT INTO usuarios (cedula, nombre, apellido, rol, departamento, subdepartamento, rol_especifico, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [cedula, nombre, apellido, rol, departamento, subdepartamento, rol_especifico, password]
            );

            // 2. Registrar en log de auditoría
            // Importante: admin_id debe ser un ID válido existente en la tabla usuarios
            const detalles = { 
                nuevo_usuario: `${nombre} ${apellido}`, 
                cedula, 
                rol 
            };
            
            await connection.execute(
                'INSERT INTO logs_sistema (usuario_id, accion, tabla_afectada, detalles) VALUES (?, ?, ?, ?)',
                [admin_id, 'REGISTRO_USUARIO', 'usuarios', JSON.stringify(detalles)]
            );

            await connection.commit();
            res.status(201).json({ success: true, message: 'Usuario registrado exitosamente.' });
        } catch (error) {
            await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: 'La cédula ya está registrada.' });
            }
            res.status(500).json({ success: false, message: 'Error interno al registrar usuario.' });
        } finally {
            connection.release();
        }
    },

    /**
     * Elimina un usuario y guarda el log.
     */
    eliminarUsuario: async (req, res) => {
        const { id } = req.params;
        const { admin_id } = req.query; // ID del administrador que realiza la acción

        if (parseInt(id) === parseInt(admin_id)) {
            return res.status(400).json({ success: false, message: 'No puedes eliminar tu propia cuenta.' });
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Obtener datos antes de borrar para el log
            const [user] = await connection.execute('SELECT cedula, nombre FROM usuarios WHERE id = ?', [id]);
            
            if (user.length === 0) {
                throw new Error('Usuario no encontrado.');
            }

            // Borrar usuario
            await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);

            // Registrar log
            const detalles = { id, cedula: user[0].cedula, nombre: user[0].nombre };
            await connection.execute(
                'INSERT INTO logs_sistema (usuario_id, accion, tabla_afectada, detalles) VALUES (?, ?, ?, ?)',
                [admin_id, 'ELIMINAR_USUARIO', 'usuarios', JSON.stringify(detalles)]
            );

            await connection.commit();
            res.json({ success: true, message: 'Usuario eliminado.' });
        } catch (error) {
            await connection.rollback();
            res.status(500).json({ success: false, message: error.message || 'Error al eliminar usuario.' });
        } finally {
            connection.release();
        }
    }
};

export default usuarioController;