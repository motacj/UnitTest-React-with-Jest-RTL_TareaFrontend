import { API_BASE_URL } from '../utils/constans';

const RUTA_MATRICULAS = 'api/v3/matriculas';

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

export const getMatriculas = async () => {
    const response = await fetch(`${API_BASE_URL}${RUTA_MATRICULAS}`, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error GET Matriculas: ${response.status}`);
    }

    return response.json();
};

export const deleteMatricula = async (idAlumno, idAsignatura) => {
    const response = await fetch(
        `${API_BASE_URL}${RUTA_MATRICULAS}/${idAsignatura}/${idAlumno}`,
        {
            method: 'DELETE',
            headers: getAuthHeaders()
        }
    );

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error DELETE Matricula: ${response.status}`);
    }

    return true;
};

export const postMatricula = async (matricula) => {
    const response = await fetch(`${API_BASE_URL}${RUTA_MATRICULAS}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(matricula)
    });

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error POST Matricula: ${response.status}`);
    }

    return true;
};

export const putMatricula = async (matricula) => {
    const response = await fetch(`${API_BASE_URL}${RUTA_MATRICULAS}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(matricula)
    });

    if (!response.ok) {
        handleAuthError(response);
        throw new Error(`Error PUT Matricula: ${response.status}`);
    }

    return true;
};