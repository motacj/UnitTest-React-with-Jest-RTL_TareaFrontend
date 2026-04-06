import { API_BASE_URL } from '../utils/constans';

const RUTA_ASIGNATURAS = 'api/v2/asignaturas';

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

export const getAsignaturas = async () => {
    const response = await fetch(`${API_BASE_URL}${RUTA_ASIGNATURAS}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error GET Asignaturas: ${response.status}`);
    }

    return response.json();
};

export const deleteAsignatura = async (id) => {
    const response = await fetch(`${API_BASE_URL}${RUTA_ASIGNATURAS}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error DELETE Asignatura: ${response.status}`);
    }

    return true;
};

export const postAsignatura = async (asignatura) => {
    const response = await fetch(`${API_BASE_URL}${RUTA_ASIGNATURAS}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(asignatura)
    });

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error POST Asignatura: ${response.status}`);
    }

    return true;
};

export const putAsignatura = async (asignatura) => {

    const response = await fetch(
        `${API_BASE_URL}${RUTA_ASIGNATURAS}`,   
        {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(asignatura)
        }
    );

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error PUT Asignatura: ${response.status}`);
    }

    return true;
};