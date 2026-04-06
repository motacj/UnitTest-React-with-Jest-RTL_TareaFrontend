import { API_BASE_URL } from '../utils/constans';

const RUTA_PERSONAS = 'api/v1/personas';

const getToken = () => {
    return localStorage.getItem("token");
};

const getAuthHeaders = () => {
    const token = getToken();

    if (!token) {
        window.location.href = "/";
        return {};
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleAuthError = (response) => {
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/";
    }
};

export const getPersonas = async () => {
    const response = await fetch(`${API_BASE_URL}${RUTA_PERSONAS}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error GET Personas: ${response.status}`);
    }

    return response.json();
};

export const deletePersona = async (id) => {
    const response = await fetch(`${API_BASE_URL}${RUTA_PERSONAS}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error DELETE Persona: ${response.status}`);
    }

    return true;
};

export const postPersona = async (persona) => {
    const response = await fetch(`${API_BASE_URL}${RUTA_PERSONAS}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(persona)
    });

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error POST Persona: ${response.status}`);
    }

    return true;
};

export const putPersona = async (persona) => {
    const response = await fetch(`${API_BASE_URL}${RUTA_PERSONAS}/${persona.id_persona}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(persona)
    });

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error PUT Persona: ${response.status}`);
    }

    return true;
};