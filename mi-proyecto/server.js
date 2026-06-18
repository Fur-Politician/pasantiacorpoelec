import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import ExcelJS from 'exceljs';
import path from 'path';
import { query } from './bd/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

/**
 * RUTA DE AUTENTICACIÓN
 */
app.post('/api/login', async (req, res) => {
    const { cedula, password } = req.body;
    try {
        // Buscamos solo por cédula
        const rows = await query('SELECT * FROM Trabajador WHERE Cedula = ?', [cedula]);

        if (rows.length > 0) {
            const user = rows[0];
            
            // Comparamos la contraseña enviada con el hash almacenado
            const match = await bcrypt.compare(password, user.Pass);

            if (!match) {
                return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }

            res.json({ 
                success: true, 
                user: { id: user.ID_Trabajador, nombre: user.Nombre_Apellido, rol: user.Nivel, cedula: user.Cedula } 
            });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * RUTAS PARA USUARIOS (Tabla: Trabajador)
 */

// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM Trabajador');
        // Mapeamos los datos para que el frontend (AdminPanel) los entienda
        const mappedData = rows.map(u => ({
            id: u.ID_Trabajador,
            nombre: u.Nombre_Apellido.split(' ')[0] || '',
            apellido: u.Nombre_Apellido.split(' ').slice(1).join(' ') || '',
            cedula: u.Cedula,
            rol: u.Nivel, // Mapeamos Nivel a Rol
            departamento: u.Departamento,
            rol_especifico: u.Cargo
        }));
        res.json({ success: true, data: mappedData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Registrar nuevo usuario
app.post('/api/usuarios', async (req, res) => {
    const { nombre, apellido, cedula, password, rol, departamento, rol_especifico } = req.body;
    const nombreCompleto = `${nombre} ${apellido}`;
    
    try {
        // IMPORTANTE: Cifrar la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO Trabajador (Nombre_Apellido, Cedula, Pass, Nivel, Departamento, Cargo) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const result = await query(sql, [nombreCompleto, cedula, hashedPassword, rol, departamento, rol_especifico]);
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        await query('DELETE FROM Trabajador WHERE ID_Trabajador = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * RUTAS PARA MATERIALES (Tabla: Materiales)
 */

app.get('/api/materiales', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM Materiales ORDER BY Fecha DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/materiales', async (req, res) => {
    const { ID_Trabajador, Lugar, tipo, Act, Ser, Mode, Marca, Obs, Fecha } = req.body;
    try {
        const sql = `INSERT INTO Materiales (ID_Trabajador, Lugar, tipo, Act, Ser, Mode, Marca, Obs, Fecha) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await query(sql, [ID_Trabajador, Lugar, tipo, Act, Ser, Mode, Marca, Obs, Fecha]);
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * RUTA PARA REGISTRAR ASIGNACIÓN DE MATERIALES Y ACTUALIZAR EXCEL
 */
app.post('/api/materiales/asignacion', async (req, res) => {
    // Extraemos los datos del cuerpo de la petición
    const { ID_Trabajador, Lugar, tipo, Act, Ser, Mode, Marca, Obs, Fecha } = req.body;
    
    // Validaciones básicas (pueden expandirse con librerías como express-validator)
    if (!ID_Trabajador || !Lugar || !tipo || !Ser || !Marca || !Fecha) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios para la asignación.' });
    }

    try {
        // 1. Guardar en Base de Datos para auditoría y persistencia
        const sqlInsertDB = `INSERT INTO Materiales (ID_Trabajador, Lugar, tipo, Act, Ser, Mode, Marca, Obs, Fecha) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const dbResult = await query(sqlInsertDB, [ID_Trabajador, Lugar, tipo, Act, Ser, Mode, Marca, Obs, Fecha]);

        // 2. Cargar y actualizar el archivo Excel
        // Usamos path.resolve para asegurar la ruta correcta del archivo Excel
        const excelFilePath = path.resolve(process.cwd(), 'src', 'assets', 'Formato de Asignacion de equipos y materiales.xlsx');
        const workbook = new ExcelJS.Workbook();
        
        // Intentamos leer el archivo existente. Si no existe, creamos uno nuevo.
        try {
            await workbook.xlsx.readFile(excelFilePath);
        } catch (readError) {
            console.warn(`Archivo Excel no encontrado en ${excelFilePath}. Creando uno nuevo.`);
            // Si el archivo no existe, creamos una hoja de trabajo básica
            workbook.addWorksheet('Asignaciones');
        }

        const worksheet = workbook.getWorksheet(1) || workbook.addWorksheet('Asignaciones'); // Aseguramos que haya al menos una hoja

        // Añadimos una nueva fila al final de la hoja.
        // Ajusta los índices de las celdas (ej. A1, B1, etc.) según el diseño de tu formato Excel.
        // Aquí asumimos que los datos se añaden secuencialmente en columnas.
        const newRow = worksheet.addRow([
            Fecha, // Columna A
            Lugar, // Columna B
            tipo,  // Columna C
            Marca, // Columna D
            Mode,  // Columna E
            Ser,   // Columna F
            Act,   // Columna G
            Obs    // Columna H
            // Puedes añadir más columnas si tu Excel las tiene
        ]);

        await workbook.xlsx.writeFile(excelFilePath); // Guardamos los cambios en el archivo Excel

        res.json({ success: true, message: 'Asignación registrada en DB y Excel actualizado', dbId: dbResult.insertId });
    } catch (error) {
        console.error("❌ Error en la asignación de materiales:", error);
        res.status(500).json({ success: false, message: 'Error procesando la asignación de materiales: ' + error.message });
    }
});

// Inicio del servidor
const server = app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Servidor Backend ejecutándose en el puerto ${PORT}`);
    console.log(`📡 API lista para recibir peticiones de React`);
    console.log(`=================================================`);
});

// Manejo de errores global para el servidor (como puerto ocupado)
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`❌ ERROR: El puerto ${PORT} ya está en uso.`);
        console.error(`👉 Solución: Ejecuta 'fuser -k ${PORT}/tcp' y reinicia el servidor.`);
        process.exit(1);
    }
});