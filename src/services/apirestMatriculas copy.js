// Importamos la URL base definida en utils/constans
import { API_BASE_URL } from '../utils/constans';

// ============================
// RUTAS
// ============================
const RUTA_MATRICULAS = 'api/v3/matriculas';

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
// GET MATRICULAS
// ============================
export const getMatriculas = async () => {
    const url = `${API_BASE_URL}${RUTA_MATRICULAS}`;
    console.log(`[API Service] GET → ${url}`);

    const response = await fetch(url, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error(`Error GET Matriculas: ${response.status}`);
    }

    return response.json();
};

// ============================
// DELETE MATRICULA
// ============================
export const deleteMatricula = async (idAlumno, idAsignatura) => {
    const response = await fetch(
        `${API_BASE_URL}api/v3/matriculas/${idAsignatura}/${idAlumno}`,
        {
            method: 'DELETE',
            headers: getAuthHeaders()
        }
    );

    if (!response.ok) {
        throw new Error("Error DELETE Matricula: " + response.status);
    }

    return true;
};

// ============================
// POST MATRICULA
// ============================
export const postMatricula = async (matricula) => {
    const url = `${API_BASE_URL}${RUTA_MATRICULAS}`;
    console.log(`[API Service] POST → ${url}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(matricula)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error POST Matricula: ${response.status} - ${errorText}`);
    }

    return true;
};

// ============================
// PUT MATRICULA
// ============================
export const putMatricula = async (matricula) => {

    const url = `${API_BASE_URL}${RUTA_MATRICULAS}`;
    console.log(`[API Service] PUT → ${url}`);

    const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(matricula)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error PUT Matricula: ${response.status} - ${errorText}`);
    }

    return true;
};




