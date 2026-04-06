import { getPersonas, deletePersona, postPersona, putPersona } from './apirestPersonas';

describe('apirestPersonas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  test('getPersonas devuelve la lista de personas', async () => {
    const personasMock = [
      { id_persona: 1, nombre: 'Jesús' },
      { id_persona: 2, nombre: 'Irene' }
    ];

    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(personasMock)
    });

    const result = await getPersonas();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v1/personas'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        })
      })
    );
    expect(result).toEqual(personasMock);
  });

  test('deletePersona devuelve true cuando elimina correctamente', async () => {
    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValue({
      ok: true
    });

    const result = await deletePersona(1);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v1/personas/1'),
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

  test('postPersona devuelve true cuando crea correctamente', async () => {
    localStorage.setItem('token', 'fake-token');

    const personaNueva = {
      nombre: 'Vanessa',
      apellidos: 'Prueba'
    };

    fetch.mockResolvedValue({
      ok: true
    });

    const result = await postPersona(personaNueva);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v1/personas'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        }),
        body: JSON.stringify(personaNueva)
      })
    );
    expect(result).toBe(true);
  });

  test('putPersona devuelve true cuando actualiza correctamente', async () => {
    localStorage.setItem('token', 'fake-token');

    const personaActualizada = {
      id_persona: 1,
      nombre: 'Jesús',
      apellidos: 'Actualizado'
    };

    fetch.mockResolvedValue({
      ok: true
    });

    const result = await putPersona(personaActualizada);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api/v1/personas/1'),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        }),
        body: JSON.stringify(personaActualizada)
      })
    );
    expect(result).toBe(true);
  });

  test('getPersonas lanza error y elimina el token cuando la respuesta es 403', async () => {
    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValue({
      ok: false,
      status: 403
    });

    await expect(getPersonas()).rejects.toThrow('Error GET Personas: 403');
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('deletePersona lanza error y elimina el token cuando la respuesta es 401', async () => {
    localStorage.setItem('token', 'fake-token');

    fetch.mockResolvedValue({
      ok: false,
      status: 401
    });

    await expect(deletePersona(1)).rejects.toThrow('Error DELETE Persona: 401');
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('postPersona lanza error cuando la respuesta no es correcta', async () => {
    localStorage.setItem('token', 'fake-token');

    const personaNueva = {
      nombre: 'Vanessa',
      apellidos: 'Prueba'
    };

    fetch.mockResolvedValue({
      ok: false,
      status: 500
    });

    await expect(postPersona(personaNueva)).rejects.toThrow('Error POST Persona: 500');
  });

  test('putPersona lanza error cuando la respuesta no es correcta', async () => {
    localStorage.setItem('token', 'fake-token');

    const personaActualizada = {
      id_persona: 1,
      nombre: 'Jesús',
      apellidos: 'Actualizado'
    };

    fetch.mockResolvedValue({
      ok: false,
      status: 500
    });

    await expect(putPersona(personaActualizada)).rejects.toThrow('Error PUT Persona: 500');
  });
});