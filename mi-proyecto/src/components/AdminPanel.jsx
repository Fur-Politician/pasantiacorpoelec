import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

/**
 * Listas configurables para la estructura organizacional
 */
const DEPARTAMENTOS = ["Distribución", "Transmisión", "Comercialización", "Tecnología", "Recursos Humanos"];
const SUBDEPARTAMENTOS = {
    "Distribución": ["Mantenimiento", "Operaciones", "Proyectos"],
    "Transmisión": ["Subestaciones", "Líneas de Alta Tensión"],
    "Comercialización": ["Atención al Cliente", "Lectura y Facturación"],
    "Tecnología": ["Soporte Técnico", "Desarrollo de Sistemas", "Redes"],
    "Recursos Humanos": ["Nómina", "Bienestar Social"]
};
const ROLES_DEPARTAMENTO = [
    "Jefe de Unidad",
    "Analista Senior",
    "Técnico de Campo",
    "Liniero",
    "Operador de Consola"
];

/**
 * AdminPanel - Gestión de Usuarios
 * Permite registrar nuevas cuentas y eliminar existentes.
 */
const AdminPanel = ({ currentAdmin }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        cedula: '', 
        nombre: '', 
        apellido: '', 
        rol: 'trabajador',
        departamento: '',
        subdepartamento: '',
        rol_especifico: '',
        password: ''
    });

    const fetchUsuarios = async () => {
        try {
            const res = await fetch('http://127.0.0.1:5000/api/usuarios');
            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
            const data = await res.json();
            if (data.success) setUsuarios(data.data);
        } catch (error) {
            console.error("Fallo crítico en fetchUsuarios:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsuarios(); }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://127.0.0.1:5000/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, admin_id: currentAdmin.id })
            });
            const data = await res.json();
            if (data.success) {
                alert("Usuario registrado exitosamente");
                setFormData({ 
                    cedula: '', 
                    nombre: '', 
                    apellido: '', 
                    rol: 'trabajador', 
                    departamento: '', 
                    subdepartamento: '', 
                    rol_especifico: '', 
                    password: '' 
                });
                fetchUsuarios();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Error en el registro");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("¿Está seguro de eliminar esta cuenta? Esta acción no se puede deshacer.")) return;
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/usuarios/${userId}?admin_id=${currentAdmin.id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                fetchUsuarios();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Error al eliminar usuario");
        }
    };

    return (
        <div className="admin-panel animate-fade-in">
            <div className="admin-grid">
                {/* Formulario de Registro */}
                <div className="admin-card">
                    <h3>Registrar Nuevo Usuario</h3>
                    <form onSubmit={handleRegister} className="admin-form">
                        <input type="text" placeholder="Cédula" value={formData.cedula} required onChange={e => setFormData({...formData, cedula: e.target.value})} />
                        <input type="text" placeholder="Nombre Completo" value={formData.nombre} required onChange={e => setFormData({...formData, nombre: e.target.value})} />
                        <input type="text" placeholder="Apellido" value={formData.apellido} required onChange={e => setFormData({...formData, apellido: e.target.value})} />
                        
                        <label>Rol de Sistema</label>
                        <select value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})}>
                            <option value="trabajador">Trabajador</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="Admin">Admin</option>
                        </select>

                        <label>Departamento</label>
                        <select required value={formData.departamento} onChange={e => setFormData({...formData, departamento: e.target.value, subdepartamento: ''})}>
                            <option value="">Seleccione Departamento...</option>
                            {DEPARTAMENTOS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                        </select>

                        <label>Sub-Departamento</label>
                        <select required value={formData.subdepartamento} onChange={e => setFormData({...formData, subdepartamento: e.target.value})} disabled={!formData.departamento}>
                            <option value="">Seleccione Sub-Departamento...</option>
                            {formData.departamento && SUBDEPARTAMENTOS[formData.departamento]?.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>

                        <label>Rol en Departamento</label>
                        <select required value={formData.rol_especifico} onChange={e => setFormData({...formData, rol_especifico: e.target.value})}>
                            <option value="">Seleccione Rol Específico...</option>
                            {ROLES_DEPARTAMENTO.map(rol => <option key={rol} value={rol}>{rol}</option>)}
                        </select>

                        <input type="password" placeholder="Contraseña Temporal" value={formData.password} required onChange={e => setFormData({...formData, password: e.target.value})} />
                        <button type="submit" className="btn-save">Registrar Cuenta</button>
                    </form>
                </div>

                {/* Lista de Usuarios */}
                <div className="admin-card">
                    <h3>Cuentas del Sistema</h3>
                    {loading ? <p>Cargando usuarios...</p> : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Personal</th>
                                    <th>Rol</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <strong>{u.nombre} {u.apellido}</strong><br/>
                                            <small className="text-muted">{u.cedula} | {u.departamento} ({u.rol_especifico})</small>
                                        </td>
                                        <td><span className={`badge ${u.rol}`}>{u.rol}</span></td>
                                        <td>
                                            <button 
                                                className="btn-delete" 
                                                onClick={() => handleDelete(u.id)}
                                                disabled={u.cedula === currentAdmin.cedula}
                                                title={u.cedula === currentAdmin.cedula ? "No puedes eliminarte a ti mismo" : "Eliminar usuario"}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;