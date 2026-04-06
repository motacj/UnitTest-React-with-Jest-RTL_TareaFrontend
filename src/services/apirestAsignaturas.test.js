import {
  getAsignaturas,
  deleteAsignatura,
  postAsignatura,
  putAsignatura
} from './apirestAsignaturas';

describe('apirestAsignaturas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  test('getAsignaturas devuelve la lista de asignaturas', async () => {
    const asignaturasMock = [
      { id_asignatura: 1, nombre: 'Programación' },
      { id_asignatura: 2, nombre: 'Bases de Datos' }
    ];

    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(asignaturasMock)
    });

    const result = await getAsignaturas();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(asignaturasMock);
  });

  test('deleteAsignatura devuelve true cuando elimina correctamente', async () => {
    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValue({
      ok: true
    });

    const result = await deleteAsignatura(1);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  test('postAsignatura devuelve true cuando crea correctamente', async () => {
    localStorage.setItem('token', 'fake-token');

    const asignaturaNueva = { nombre: 'Entornos de Desarrollo' };

    fetch.mockResolvedValue({
      ok: true
    });

    const result = await postAsignatura(asignaturaNueva);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  test('putAsignatura devuelve true cuando actualiza correctamente', async () => {
    localStorage.setItem('token', 'fake-token');

    const asignaturaActualizada = {
      id_asignatura: 1,
      nombre: 'Programación Actualizada'
    };

    fetch.mockResolvedValue({
      ok: true
    });

    const result = await putAsignatura(asignaturaActualizada);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });
});