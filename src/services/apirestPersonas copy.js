// Importamos la URL base definida en utils/constans
import { API_BASE_URL } from '../utils/constans';

// ============================
// RUTAS
// ============================
const RUTA_PERSONAS = 'api/v1/personas';

// ============================
//   FUNCIÓN CENTRAL JWT
// ============================
const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // asegúrate que sea "token"

    console.log("TOKEN ENVIADO:", token);

    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
};

// ============================
// GET PERSONAS
// ============================
export const getPersonas = async () => {
    const url = `${API_BASE_URL}${RUTA_PERSONAS}`;
    console.log(`[API Service] GET → ${url}`);

    const response = await fetch(url, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error(`Error GET Personas: ${response.status}`);
    }

    return response.json();
};

// ============================
// DELETE PERSONA
// ============================
export const deletePersona = async (id) => {
    const url = `${API_BASE_URL}${RUTA_PERSONAS}/${id}`;
    console.log(`[API Service] DELETE → ${url}`);

    const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error(`Error DELETE Persona: ${response.status}`);
    }

    return true;
};

// ============================
// POST PERSONA
// ============================
export const postPersona = async (persona) => {
    const url = `${API_BASE_URL}${RUTA_PERSONAS}`;
    console.log(`[API Service] POST → ${url}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(persona)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error POST Persona: ${response.status} - ${errorText}`);
    }

    return true;
};

// ============================
// PUT PERSONA
// ============================
export const putPersona = async (persona) => {
    const url = `${API_BASE_URL}${RUTA_PERSONAS}/${persona.id_persona}`;
    console.log(`[API Service] PUT → ${url}`);

    const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(persona)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error PUT Persona: ${response.status} - ${errorText}`);
    }

    return true;
};




