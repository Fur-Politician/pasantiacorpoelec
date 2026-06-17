import React, { useState, useEffect } from 'react';
import './RetiroModal.css';

/**
 * Componente RetiroModal
 * Proporciona una interfaz de formulario para registrar la salida de materiales.
 * Se conecta al endpoint POST /api/materiales/retiro.
 */
const RetiroModal = ({ isOpen, onClose, onSuccess }) => {
    const [materiales, setMateriales] = useState([]);
    const [formData, setFormData] = useState({
        usuario_id: 1, // Simulado: En producción vendría del AuthContext
        material_id: '',
        cantidad: '',
        observacion: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar catálogo de materiales para el selector
    useEffect(() => {
        if (isOpen) {
            const fetchMateriales = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:5000/api/materiales');
                    const data = await response.json();
                    // Simulación de datos si el endpoint está vacío
                    setMateriales(data.success ? data.data : [
                        { id: 1, descripcion: 'Cable Arvidal 2/0', unidad_medida: 'Mts' },
                        { id: 2, descripcion: 'Transformador 25kVA', unidad_medida: 'Und' }
                    ]);
                } catch (error) {
                    console.error("Error cargando materiales:", error);
                }
            };
            fetchMateriales();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/materiales/retiro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                alert('Retiro registrado correctamente');
                onSuccess(); // Recarga la tabla
                onClose();   // Cierra el modal
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert('Error de conexión con el servidor');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Registrar Asignación de Material</h3>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Material / Insumo</label>
                        <select 
                            required 
                            value={formData.material_id}
                            onChange={(e) => setFormData({...formData, material_id: e.target.value})}
                        >
                            <option value="">Seleccione un material...</option>
                            {materiales.map(m => (
                                <option key={m.id} value={m.id}>{m.descripcion} ({m.unidad_medida})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Cantidad a Retirar</label>
                        <input 
                            type="number" 
                            required 
                            min="1"
                            value={formData.cantidad}
                            onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label>Observaciones / Destino</label>
                        <textarea 
                            rows="3"
                            value={formData.observacion}
                            onChange={(e) => setFormData({...formData, observacion: e.target.value})}
                            placeholder="Ej: Mantenimiento preventivo S/E..."
                        ></textarea>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-save" disabled={isSubmitting}>
                            {isSubmitting ? 'Procesando...' : 'Confirmar Retiro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RetiroModal;