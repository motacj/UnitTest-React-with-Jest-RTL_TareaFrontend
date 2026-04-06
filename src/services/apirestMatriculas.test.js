import {
  getMatriculas,
  deleteMatricula,
  postMatricula,
  putMatricula
} from './apirestMatriculas';

describe('apirestMatriculas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  test('getMatriculas devuelve la lista de matrículas', async () => {
    const matriculasMock = [
      { id_alumno: 1, id_asignatura: 2 },
      { id_alumno: 2, id_asignatura: 1 }
    ];

    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(matriculasMock)
    });

    const result = await getMatriculas();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v3/matriculas'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        })
      })
    );
    expect(result).toEqual(matriculasMock);
  });

  test('deleteMatricula devuelve true cuando elimina correctamente', async () => {
    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValue({
      ok: true
    });

    const result = await deleteMatricula(1, 2);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v3/matriculas/2/1'),
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        })
      })
    );
    expect(result).toBe(true);
  });

  test('postMatricula devuelve true cuando crea correctamente', async () => {
    localStorage.setItem('token', 'fake-token');

    const matriculaNueva = {
      id_alumno: 1,
      id_asignatura: 2
    };

    fetch.mockResolvedValue({
      ok: true
    });

    const result = await postMatricula(matriculaNueva);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v3/matriculas'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        }),
        body: JSON.stringify(matriculaNueva)
      })
    );
    expect(result).toBe(true);
  });

  test('putMatricula devuelve true cuando actualiza correctamente', async () => {
    localStorage.setItem('token', 'fake-token');

    const matriculaActualizada = {
      id_alumno: 2,
      id_asignatura: 3
    };

    fetch.mockResolvedValue({
      ok: true
    });

    const result = await putMatricula(matriculaActualizada);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v3/matriculas'),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        }),
        body: JSON.stringify(matriculaActualizada)
      })
    );
    expect(result).toBe(true);
  });

  test('getMatriculas lanza error y elimina el token cuando la respuesta es 403', async () => {
    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValue({
      ok: false,
      status: 403
    });

    await expect(getMatriculas()).rejects.toThrow('Error GET Matriculas: 403');
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('deleteMatricula lanza error y elimina el token cuando la respuesta es 401', async () => {
    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValue({
      ok: false,
      status: 401
    });

    await expect(deleteMatricula(1, 2)).rejects.toThrow('Error DELETE Matricula: 401');
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('postMatricula lanza error cuando la respuesta no es correcta', async () => {
    localStorage.setItem('token', 'fake-token');

    const matriculaNueva = {
      id_alumno: 1,
      id_asignatura: 2
    };

    fetch.mockResolvedValue({
      ok: false,
      status: 500
    });

    await expect(postMatricula(matriculaNueva)).rejects.toThrow('Error POST Matricula: 500');
  });

  test('putMatricula lanza error cuando la respuesta no es correcta', async () => {
    localStorage.setItem('token', 'fake-token');

    const matriculaActualizada = {
      id_alumno: 2,
      id_asignatura: 3
    };

    fetch.mockResolvedValue({
      ok: false,
      status: 500
    });

    await expect(putMatricula(matriculaActualizada)).rejects.toThrow('Error PUT Matricula: 500');
  });
});