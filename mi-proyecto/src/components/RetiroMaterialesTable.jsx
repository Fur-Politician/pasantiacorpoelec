import React, { useState, useEffect } from 'react';

/** 
 * Componente para la gestión y visualización de retiros de materiales.
 * Conectará con la tabla 'Materiales' de la base de datos.
 */
const RetiroMaterialesTable = () => {
    const [materiales, setMateriales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Efecto para cargar los datos desde el backend (una vez que el servidor esté activo)
    useEffect(() => {
        const fetchMateriales = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://127.0.0.1:5000/api/materiales');
                if (!response.ok) throw new Error("Error en la petición");
                const result = await response.json();
                if (result.success) {
                    setMateriales(result.data);
                } else {
                    throw new Error(result.message);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener materiales:", err);
                setError("No se pudo cargar la información de los materiales.");
                setLoading(false);
            }
        };

        fetchMateriales();
    }, []);

    if (loading) return <div className="p-4">Cargando registros de inventario...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="inventory-container p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-100 border-b-2 border-red-600">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lugar</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Activo</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Serial</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Modelo</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Marca</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {materiales.map((item) => (
                            <tr key={item.ID_Materiales} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-600">{item.ID_Materiales}</td>
                                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.Lugar}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{item.tipo}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{item.Act}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{item.Ser}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{item.Mode}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{item.Marca}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{item.Fecha}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RetiroMaterialesTable;