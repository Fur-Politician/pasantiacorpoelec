import React, { useState, useEffect } from 'react';
import './RetiroMaterialesTable.css';
import RetiroModal from './RetiroModal';

/**
 * Componente RetiroMaterialesTable
 * Muestra el historial de movimientos de inventario con la estética corporativa.
 * Implementa una interfaz limpia basada en el formato de asignación de materiales.
 */
const RetiroMaterialesTable = () => {
    const [retiros, setRetiros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
                // Aquí se realizaría la llamada al endpoint: GET /api/retiros
                // Por ahora simulamos la estructura de la DB (retiros_materiales JOIN materiales JOIN usuarios)
                const mockData = [
                    { id: 1, fecha: '2023-10-25 08:30', usuario: 'Juan Pérez', material: 'Cable Arvidal 2/0', cantidad: 50, unidad: 'Mts', observacion: 'Mantenimiento preventivo Subestación A' },
                    { id: 2, fecha: '2023-10-25 10:15', usuario: 'Maria Sosa', material: 'Transformador 25kVA', cantidad: 1, unidad: 'Und', observacion: 'Emergencia Sector Centro' },
                ];
                setRetiros(mockData);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los retiros:", error);
                setLoading(false);
            }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="loading-state">Cargando registros...</div>;

    return (
        <div className="table-container">
            <div className="table-header-actions">
                <h2 className="table-title">Historial de Retiro de Materiales</h2>
                <button 
                    className="btn-new-withdrawal"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Nuevo Retiro
                </button>
            </div>
            
            <div className="table-responsive">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha y Hora</th>
                            <th>Personal Responsable</th>
                            <th>Descripción del Material</th>
                            <th>Cant.</th>
                            <th>Unidad</th>
                            <th>Observaciones</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {retiros.map((item) => (
                            <tr key={item.id}>
                                <td className="cell-id">#{item.id}</td>
                                <td>{item.fecha}</td>
                                <td className="font-bold">{item.usuario}</td>
                                <td>{item.material}</td>
                                <td className="cell-quantity">{item.cantidad}</td>
                                <td className="cell-unit">{item.unidad}</td>
                                <td className="cell-obs">{item.observacion}</td>
                                <td className="text-center">
                                    {/* Acento azul claro para información detallada */}
                                    <button className="btn-icon btn-info" title="Ver Detalles">
                                        <i className="info-icon">i</i>
                                    </button>
                                    {/* Rojo para acciones críticas/reportes */}
                                    <button className="btn-icon btn-report" title="Descargar PDF">
                                        <i className="pdf-icon">PDF</i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Componente Modal */}
            <RetiroModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default RetiroMaterialesTable;