import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Personas from './Personas';
import {
  getPersonas,
  deletePersona,
  postPersona,
  putPersona
} from '../services/apirestPersonas';

jest.mock('../services/apirestPersonas');

describe('Personas component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'fake-token');
  });

  test('carga y muestra la lista de personas', async () => {
    getPersonas.mockResolvedValue([
      { id_persona: 1, nombre: 'Jesús', apellidos: 'Mota', edad: 30 },
      { id_persona: 2, nombre: 'Irene', apellidos: 'Avilés', edad: 28 }
    ]);

    render(<Personas />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();

    expect(await screen.findByText('Jesús')).toBeInTheDocument();
    expect(await screen.findByText('Irene')).toBeInTheDocument();
    expect(screen.getByText(/lista de alumnos/i)).toBeInTheDocument();

    expect(getPersonas).toHaveBeenCalledTimes(1);
  });

  test('muestra error si falla getPersonas', async () => {
    getPersonas.mockRejectedValue(new Error('Fallo al cargar personas'));

    render(<Personas />);

    expect(await screen.findByText(/error: fallo al cargar personas/i)).toBeInTheDocument();
  });

  test('muestra el formulario de insertar al pulsar el botón', async () => {
    getPersonas.mockResolvedValue([]);

    render(<Personas />);

    await screen.findByText(/lista de alumnos/i);

    fireEvent.click(screen.getByRole('button', { name: /insertar nuevo alumno/i }));

    expect(screen.getByPlaceholderText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/apellidos/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/edad/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  test('permite abrir el formulario de edición', async () => {
    getPersonas.mockResolvedValue([
      { id_persona: 1, nombre: 'Jesús', apellidos: 'Mota', edad: 30 }
    ]);

    render(<Personas />);

    await screen.findByText('Jesús');

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    expect(screen.getByDisplayValue('Jesús')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mota')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
  });

  test('borra una persona cuando se confirma', async () => {
    getPersonas.mockResolvedValue([
      { id_persona: 1, nombre: 'Jesús', apellidos: 'Mota', edad: 30 }
    ]);
    deletePersona.mockResolvedValue(true);

    window.confirm = jest.fn(() => true);

    render(<Personas />);

    await screen.findByText('Jesús');

    fireEvent.click(screen.getByRole('button', { name: /borrar/i }));

    await waitFor(() => {
      expect(deletePersona).toHaveBeenCalledWith(1);
    });
  });

  test('inserta una persona nueva', async () => {
    getPersonas.mockResolvedValue([]);
    postPersona.mockResolvedValue(true);

    render(<Personas />);

    await screen.findByText(/lista de alumnos/i);

    fireEvent.click(screen.getByRole('button', { name: /insertar nuevo alumno/i }));

    fireEvent.change(screen.getByPlaceholderText(/nombre/i), {
      target: { name: 'nombre', value: 'Vanessa' }
    });

    fireEvent.change(screen.getByPlaceholderText(/apellidos/i), {
      target: { name: 'apellidos', value: 'López' }
    });

    fireEvent.change(screen.getByPlaceholderText(/edad/i), {
      target: { name: 'edad', value: '25' }
    });

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(postPersona).toHaveBeenCalledWith({
        id_persona: 0,
        nombre: 'Vanessa',
        apellidos: 'López',
        edad: 25
      });
    });
  });

  test('actualiza una persona existente', async () => {
    getPersonas.mockResolvedValue([
      { id_persona: 1, nombre: 'Jesús', apellidos: 'Mota', edad: 30 }
    ]);
    putPersona.mockResolvedValue(true);

    render(<Personas />);

    await screen.findByText('Jesús');

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    fireEvent.change(screen.getByDisplayValue('Jesús'), {
      target: { name: 'nombre', value: 'Jesús Manuel' }
    });

    fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

    await waitFor(() => {
      expect(putPersona).toHaveBeenCalledWith({
        id_persona: 1,
        nombre: 'Jesús Manuel',
        apellidos: 'Mota',
        edad: 30
      });
    });
  });

  test('logout elimina el token y redirige al inicio', async () => {
    getPersonas.mockResolvedValue([]);

    delete window.location;
    window.location = { href: '' };

    render(<Personas />);

    await screen.findByText(/lista de alumnos/i);

    fireEvent.click(screen.getByRole('button', { name: /logearse/i }));

    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.href).toBe('/');
  });

  test('deshabilita el botón de insertar cuando se está editando', async () => {
    getPersonas.mockResolvedValue([
      { id_persona: 1, nombre: 'Jesús', apellidos: 'Mota', edad: 30 }
    ]);

    render(<Personas />);

    await screen.findByText('Jesús');

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    expect(
      screen.getByRole('button', { name: /insertar nuevo alumno/i })
    ).toBeDisabled();
  });

  test('cancela la edición y oculta el formulario de actualizar', async () => {
    getPersonas.mockResolvedValue([
      { id_persona: 1, nombre: 'Jesús', apellidos: 'Mota', edad: 30 }
    ]);

    render(<Personas />);

    await screen.findByText('Jesús');

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /actualizar/i })).not.toBeInTheDocument();
    });
  });
  
  test('shows the table of people with their columns', async () => {
  getPersonas.mockResolvedValue([
    { id_persona: 1, nombre: 'Jesús', apellidos: 'Mota', edad: 30 }
  ]);

  render(<Personas />);

  await screen.findByText('Jesús');

  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /^id$/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /^nombre$/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /^apellidos$/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /^edad$/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /^acciones$/i })).toBeInTheDocument();
});

test('shows empty table when getPersonas returns empty array', async () => {
  getPersonas.mockResolvedValue([]);

  render(<Personas />);

  await screen.findByText(/lista de alumnos/i);

  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.queryByText('Jesús')).not.toBeInTheDocument();
});

test('muestra error 500 si getPersonas rechaza con ese mensaje', async () => {
  getPersonas.mockRejectedValue(new Error('Error GET Personas: 500'));

  render(<Personas />);

  expect(await screen.findByText(/error: error get personas: 500/i)).toBeInTheDocument();
});

test('muestra error si getPersonas rechaza la promesa', async () => {
  getPersonas.mockRejectedValue(new Error('Network Error'));

  render(<Personas />);

  expect(await screen.findByText(/error: network error/i)).toBeInTheDocument();
});

test('muestra alerta si falla la creación de persona', async () => {
  getPersonas.mockResolvedValue([]);
  postPersona.mockRejectedValue(new Error('Error POST Persona: 500'));
  window.alert = jest.fn();

  render(<Personas />);

  await screen.findByText(/lista de alumnos/i);

  fireEvent.click(screen.getByRole('button', { name: /insertar nuevo alumno/i }));

  fireEvent.change(screen.getByPlaceholderText(/nombre/i), {
    target: { name: 'nombre', value: 'Vanessa' }
  });
  fireEvent.change(screen.getByPlaceholderText(/apellidos/i), {
    target: { name: 'apellidos', value: 'López' }
  });
  fireEvent.change(screen.getByPlaceholderText(/edad/i), {
    target: { name: 'edad', value: '25' }
  });

  fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Error POST Persona: 500');
  });
});
});