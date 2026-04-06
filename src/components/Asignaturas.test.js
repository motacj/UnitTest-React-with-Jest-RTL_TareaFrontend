import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Asignaturas from './Asignaturas';
import {
  getAsignaturas,
  deleteAsignatura,
  postAsignatura,
  putAsignatura
} from '../services/apirestAsignaturas';

jest.mock('../services/apirestAsignaturas');

describe('Asignaturas component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'fake-token');
  });

  test('carga y muestra la lista de asignaturas', async () => {
    getAsignaturas.mockResolvedValue([
      {
        id_asignatura: 1,
        id_profesor: 10,
        nombre_asignatura: 'Programación',
        horario: 'Mañana'
      },
      {
        id_asignatura: 2,
        id_profesor: 11,
        nombre_asignatura: 'Bases de Datos',
        horario: 'Tarde'
      }
    ]);

    render(<Asignaturas />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();

    expect(await screen.findByText('Programación')).toBeInTheDocument();
    expect(await screen.findByText('Bases de Datos')).toBeInTheDocument();
    expect(screen.getByText(/lista de asignaturas/i)).toBeInTheDocument();

    expect(getAsignaturas).toHaveBeenCalledTimes(1);
  });

  test('muestra error si falla getAsignaturas', async () => {
    getAsignaturas.mockRejectedValue(new Error('Fallo al cargar asignaturas'));

    render(<Asignaturas />);

    expect(await screen.findByText(/error: fallo al cargar asignaturas/i)).toBeInTheDocument();
  });

  test('muestra el formulario de insertar al pulsar el botón', async () => {
    getAsignaturas.mockResolvedValue([]);

    render(<Asignaturas />);

    await screen.findByText(/lista de asignaturas/i);

    fireEvent.click(screen.getByRole('button', { name: /insertar nueva asignatura/i }));

    expect(screen.getByPlaceholderText(/id profesor/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^nombre$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/horario/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  test('permite abrir el formulario de edición', async () => {
    getAsignaturas.mockResolvedValue([
      {
        id_asignatura: 1,
        id_profesor: 10,
        nombre_asignatura: 'Programación',
        horario: 'Mañana'
      }
    ]);

    render(<Asignaturas />);

    await screen.findByText('Programación');

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Programación')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
  });

  test('borra una asignatura cuando se confirma', async () => {
    getAsignaturas.mockResolvedValue([
      {
        id_asignatura: 1,
        id_profesor: 10,
        nombre_asignatura: 'Programación',
        horario: 'Mañana'
      }
    ]);
    deleteAsignatura.mockResolvedValue(true);

    window.confirm = jest.fn(() => true);

    render(<Asignaturas />);

    await screen.findByText('Programación');

    fireEvent.click(screen.getByRole('button', { name: /borrar/i }));

    await waitFor(() => {
      expect(deleteAsignatura).toHaveBeenCalledWith(1);
    });
  });

  test('inserta una asignatura nueva', async () => {
    getAsignaturas.mockResolvedValue([]);
    postAsignatura.mockResolvedValue(true);

    render(<Asignaturas />);

    await screen.findByText(/lista de asignaturas/i);

    fireEvent.click(screen.getByRole('button', { name: /insertar nueva asignatura/i }));

    fireEvent.change(screen.getByPlaceholderText(/id profesor/i), {
      target: { name: 'id_profesor', value: '12' }
    });

    fireEvent.change(screen.getByPlaceholderText(/^nombre$/i), {
      target: { name: 'nombre_asignatura', value: 'Entornos de Desarrollo' }
    });

    fireEvent.change(screen.getByPlaceholderText(/horario/i), {
      target: { name: 'horario', value: 'Mañana' }
    });

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(postAsignatura).toHaveBeenCalledWith({
        id_asignatura: 0,
        id_profesor: 12,
        nombre_asignatura: 'Entornos de Desarrollo',
        horario: 'Mañana'
      });
    });
  });

  test('actualiza una asignatura existente', async () => {
    getAsignaturas.mockResolvedValue([
      {
        id_asignatura: 1,
        id_profesor: 10,
        nombre_asignatura: 'Programación',
        horario: 'Mañana'
      }
    ]);
    putAsignatura.mockResolvedValue(true);

    render(<Asignaturas />);

    await screen.findByText('Programación');

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    fireEvent.change(screen.getByDisplayValue('Programación'), {
      target: { name: 'nombre_asignatura', value: 'Programación Avanzada' }
    });

    fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

    await waitFor(() => {
      expect(putAsignatura).toHaveBeenCalledWith({
        id_asignatura: 1,
        id_profesor: 10,
        nombre_asignatura: 'Programación Avanzada',
        horario: 'Mañana'
      });
    });
  });

  test('logout elimina el token y redirige al inicio', async () => {
    getAsignaturas.mockResolvedValue([]);

    delete window.location;
    window.location = { href: '' };

    render(<Asignaturas />);

    await screen.findByText(/lista de asignaturas/i);

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.href).toBe('/');
  });

  test('deshabilita el botón de insertar cuando se está editando', async () => {
    getAsignaturas.mockResolvedValue([
      {
        id_asignatura: 1,
        id_profesor: 10,
        nombre_asignatura: 'Programación',
        horario: 'Mañana'
      }
    ]);

    render(<Asignaturas />);

    await screen.findByText('Programación');

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    expect(
      screen.getByRole('button', { name: /insertar nueva asignatura/i })
    ).toBeDisabled();
  });

  test('cancela la edición y oculta el formulario de actualizar', async () => {
    getAsignaturas.mockResolvedValue([
      {
        id_asignatura: 1,
        id_profesor: 10,
        nombre_asignatura: 'Programación',
        horario: 'Mañana'
      }
    ]);

    render(<Asignaturas />);

    await screen.findByText('Programación');

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /actualizar/i })).not.toBeInTheDocument();
    });
  });

  test('refresh data after deleting a subject', async () => {
  getAsignaturas
    .mockResolvedValueOnce([
      {
        id_asignatura: 1,
        id_profesor: 10,
        nombre_asignatura: 'Programación',
        horario: 'Mañana'
      }
    ])
    .mockResolvedValueOnce([]);

  deleteAsignatura.mockResolvedValue(true);
  window.confirm = jest.fn(() => true);

  render(<Asignaturas />);

  await screen.findByText('Programación');

  fireEvent.click(screen.getByRole('button', { name: /borrar/i }));

  await waitFor(() => {
    expect(deleteAsignatura).toHaveBeenCalledWith(1);
  });

  await waitFor(() => {
    expect(getAsignaturas).toHaveBeenCalledTimes(2);
  });
});

test('refresca datos después de insertar una asignatura', async () => {
  getAsignaturas
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([
      {
        id_asignatura: 1,
        id_profesor: 12,
        nombre_asignatura: 'Entornos de Desarrollo',
        horario: 'Mañana'
      }
    ]);

  postAsignatura.mockResolvedValue(true);

  render(<Asignaturas />);

  await screen.findByText(/lista de asignaturas/i);

  fireEvent.click(screen.getByRole('button', { name: /insertar nueva asignatura/i }));

  fireEvent.change(screen.getByPlaceholderText(/id profesor/i), {
    target: { name: 'id_profesor', value: '12' }
  });

  fireEvent.change(screen.getByPlaceholderText(/^nombre$/i), {
    target: { name: 'nombre_asignatura', value: 'Entornos de Desarrollo' }
  });

  fireEvent.change(screen.getByPlaceholderText(/horario/i), {
    target: { name: 'horario', value: 'Mañana' }
  });

  fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

  await waitFor(() => {
    expect(postAsignatura).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(getAsignaturas).toHaveBeenCalledTimes(2);
  });
});

test('refresca datos después de actualizar una asignatura', async () => {
  getAsignaturas
    .mockResolvedValueOnce([
      {
        id_asignatura: 1,
        id_profesor: 10,
        nombre_asignatura: 'Programación',
        horario: 'Mañana'
      }
    ])
    .mockResolvedValueOnce([
      {
        id_asignatura: 1,
        id_profesor: 10,
        nombre_asignatura: 'Programación Avanzada',
        horario: 'Mañana'
      }
    ]);

  putAsignatura.mockResolvedValue(true);

  render(<Asignaturas />);

  await screen.findByText('Programación');

  fireEvent.click(screen.getByRole('button', { name: /editar/i }));

  fireEvent.change(screen.getByDisplayValue('Programación'), {
    target: { name: 'nombre_asignatura', value: 'Programación Avanzada' }
  });

  fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

  await waitFor(() => {
    expect(putAsignatura).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(getAsignaturas).toHaveBeenCalledTimes(2);
  });
});
test('shows empty table when getAsignatures returns empty array', async () => {
  getAsignaturas.mockResolvedValue([]);

  render(<Asignaturas />);

  await screen.findByText(/lista de asignaturas/i);

  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.queryByText('Programación')).not.toBeInTheDocument();
});

test('muestra error 500 si getAsignaturas rechaza con ese mensaje', async () => {
  getAsignaturas.mockRejectedValue(new Error('Error GET Asignaturas: 500'));

  render(<Asignaturas />);

  expect(await screen.findByText(/error: error get asignaturas: 500/i)).toBeInTheDocument();
});

test('muestra error si getAsignaturas rechaza la promesa', async () => {
  getAsignaturas.mockRejectedValue(new Error('Network Error'));

  render(<Asignaturas />);

  expect(await screen.findByText(/error: network error/i)).toBeInTheDocument();
});

test('muestra alerta si falla la creación de asignatura', async () => {
  getAsignaturas.mockResolvedValue([]);
  postAsignatura.mockRejectedValue(new Error('Error POST Asignatura: 500'));
  window.alert = jest.fn();

  render(<Asignaturas />);

  await screen.findByText(/lista de asignaturas/i);

  fireEvent.click(screen.getByRole('button', { name: /insertar nueva asignatura/i }));

  fireEvent.change(screen.getByPlaceholderText(/id profesor/i), {
    target: { name: 'id_profesor', value: '12' }
  });
  fireEvent.change(screen.getByPlaceholderText(/^nombre$/i), {
    target: { name: 'nombre_asignatura', value: 'Entornos de Desarrollo' }
  });
  fireEvent.change(screen.getByPlaceholderText(/horario/i), {
    target: { name: 'horario', value: 'Mañana' }
  });

  fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Error POST Asignatura: 500');
  });
});
});