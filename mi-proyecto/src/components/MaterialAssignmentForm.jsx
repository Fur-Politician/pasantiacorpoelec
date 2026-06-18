import React, { useState } from 'react';

/**
 * Componente de formulario para registrar la asignación/retiro de materiales.
 * Envía los datos al backend para guardar en DB y actualizar el archivo Excel.
 */
const MaterialAssignmentForm = ({ user, onCancel, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        Lugar: '',
        tipo: '',
        Act: '', // Número de Activo
        Ser: '', // Número de Serial
        Mode: '', // Modelo
        Marca: '',
        Obs: '', // Observaciones
        Fecha: new Date().toISOString().split('T')[0] // Fecha actual por defecto
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validaciones básicas en el cliente
        if (!formData.Lugar || !formData.tipo || !formData.Ser || !formData.Marca || !formData.Fecha) {
            setError("Por favor, complete todos los campos obligatorios (Lugar, Tipo, Serial, Marca, Fecha).");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/materiales/asignacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Aseguramos que el ID_Trabajador del usuario logueado se envíe
                body: JSON.stringify({ ...formData, ID_Trabajador: user.id })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('Registro de asignación completado exitosamente y formato Excel actualizado.');
                onSaveSuccess(); // Llama a la función para cerrar el formulario o actualizar la tabla
            } else {
                // Si el backend devuelve un error, lo mostramos
                setError(result.message || 'Error desconocido al registrar la asignación.');
            }
        } catch (err) {
            console.error("Error al enviar formulario de asignación:", err);
            setError('No se pudo conectar con el servidor o hubo un error de red.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="assignment-form-container p-6 bg-white rounded-lg shadow-lg border-t-4 border-red-600">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Asignación de Materiales</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                    <label htmlFor="Fecha" className="block text-sm font-semibold mb-1">Fecha de Asignación <span className="text-red-500">*</span></label>
                    <input type="date" id="Fecha" name="Fecha" className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" value={formData.Fecha} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="Lugar" className="block text-sm font-semibold mb-1">Lugar / Instalación <span className="text-red-500">*</span></label>
                    <input type="text" id="Lugar" name="Lugar" className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="Ej: Subestación Centro" value={formData.Lugar} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="tipo" className="block text-sm font-semibold mb-1">Tipo de Equipo <span className="text-red-500">*</span></label>
                    <select id="tipo" name="tipo" className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" value={formData.tipo} onChange={handleChange} required>
                        <option value="">Seleccione...</option>
                        <option value="Computacion">Equipo de Computación</option>
                        <option value="Herramienta">Herramienta Eléctrica</option>
                        <option value="Vehiculo">Repuesto Vehículo</option>
                        <option value="Material">Material Eléctrico</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="Marca" className="block text-sm font-semibold mb-1">Marca <span className="text-red-500">*</span></label>
                    <input type="text" id="Marca" name="Marca" className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" value={formData.Marca} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="Mode" className="block text-sm font-semibold mb-1">Modelo</label>
                    <input type="text" id="Mode" name="Mode" className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" value={formData.Mode} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="Ser" className="block text-sm font-semibold mb-1">Número de Serial <span className="text-red-500">*</span></label>
                    <input type="text" id="Ser" name="Ser" className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" value={formData.Ser} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="Act" className="block text-sm font-semibold mb-1">Número de Activo</label>
                    <input type="text" id="Act" name="Act" className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" value={formData.Act} onChange={handleChange} />
                </div>
                <div className="form-group md:col-span-2">
                    <label htmlFor="Obs" className="block text-sm font-semibold mb-1">Observaciones / Notas del Retiro</label>
                    <textarea id="Obs" name="Obs" className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 h-24 resize-y" value={formData.Obs} onChange={handleChange}></textarea>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={onCancel} className="px-5 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-semibold transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary bg-red-600 text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Registrando...' : 'Registrar Asignación'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MaterialAssignmentForm;