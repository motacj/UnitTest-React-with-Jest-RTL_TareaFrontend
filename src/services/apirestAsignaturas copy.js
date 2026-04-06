// Importamos la URL base definida en utils/constans
import { API_BASE_URL } from '../utils/constans';

// ============================
// RUTAS
// ============================
const RUTA_ASIGNATURAS = 'api/v2/asignaturas';

// ============================
//   FUNCIÓN CENTRAL JWT
// ============================
const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt");

    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
};

// ============================
// GET ASIGNATURAS
// ============================
export const getAsignaturas = async () => {
    const url = `${API_BASE_URL}${RUTA_ASIGNATURAS}`;
    console.log(`[API Service] GET → ${url}`);

    const response = await fetch(url, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error(`Error GET Asignaturas: ${response.status}`);
    }

    return response.json();
};

// ============================
// DELETE ASIGNATURA
// ============================
export const deleteAsignatura = async (id) => {
    const url = `${API_BASE_URL}${RUTA_ASIGNATURAS}/${id}`;
    console.log(`[API Service] DELETE → ${url}`);

    const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error(`Error DELETE Asignatura: ${response.status}`);
    }

    return true;
};

// ============================
// POST ASIGNATURA
// ============================
export const postAsignatura = async (asignatura) => {
    const url = `${API_BASE_URL}${RUTA_ASIGNATURAS}`;
    console.log(`[API Service] POST → ${url}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(asignatura)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error POST Asignatura: ${response.status} - ${errorText}`);
    }

    return true;
};

// ============================
// PUT ASIGNATURA
// ============================
export const putAsignatura = async (asignatura) => {
    const url = `${API_BASE_URL}${RUTA_ASIGNATURAS}/${asignatura.id_asignatura}`;
    console.log(`[API Service] PUT → ${url}`);

    const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(asignatura)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error PUT Asignatura: ${response.status} - ${errorText}`);
    }

    return true;
};





