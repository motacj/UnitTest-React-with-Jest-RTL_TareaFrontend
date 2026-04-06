import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Matriculas from './Matriculas';
import {
  getMatriculas,
  deleteMatricula,
  postMatricula,
  putMatricula
} from '../services/apirestMatriculas';

jest.mock('../services/apirestMatriculas');

describe('Matriculas component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'fake-token');
  });

  test('carga y muestra la lista de matrículas', async () => {
    getMatriculas.mockResolvedValue([
      {
        id: { id_alumno: 1, id_asignatura: 2 },
        nota: 7
      },
      {
        id: { id_alumno: 2, id_asignatura: 1 },
        nota: 9
      }
    ]);

    render(<Matriculas />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(await screen.findByText('7')).toBeInTheDocument();
    expect(await screen.findByText('9')).toBeInTheDocument();
    expect(screen.getByText(/lista de matrículas/i)).toBeInTheDocument();

    expect(getMatriculas).toHaveBeenCalledTimes(1);
  });

  test('muestra error si falla getMatriculas', async () => {
    getMatriculas.mockRejectedValue(new Error('Fallo al cargar matrículas'));

    render(<Matriculas />);

    expect(await screen.findByText(/error: fallo al cargar matrículas/i)).toBeInTheDocument();
  });

  test('muestra el formulario de insertar al pulsar el botón', async () => {
    getMatriculas.mockResolvedValue([]);

    render(<Matriculas />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /insertar nueva matrícula/i }));

    expect(screen.getByPlaceholderText(/id alumno/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/id asignatura/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nota/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  test('borra una matrícula cuando se confirma', async () => {
    getMatriculas.mockResolvedValue([
      {
        id: { id_alumno: 1, id_asignatura: 2 },
        nota: 7
      }
    ]);

    deleteMatricula.mockResolvedValue(true);
    window.confirm = jest.fn(() => true);

    render(<Matriculas />);

    expect(await screen.findByText('7')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /borrar/i }));

    await waitFor(() => {
      expect(deleteMatricula).toHaveBeenCalledWith(1, 2);
    });
  });

  test('inserta una matrícula nueva', async () => {
    getMatriculas.mockResolvedValue([]);
    postMatricula.mockResolvedValue(true);

    render(<Matriculas />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /insertar nueva matrícula/i }));

    fireEvent.change(screen.getByPlaceholderText(/id alumno/i), {
      target: { name: 'id_alumno', value: '1' }
    });

    fireEvent.change(screen.getByPlaceholderText(/id asignatura/i), {
      target: { name: 'id_asignatura', value: '2' }
    });

    fireEvent.change(screen.getByPlaceholderText(/nota/i), {
      target: { name: 'nota', value: '8' }
    });

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => {
      expect(postMatricula).toHaveBeenCalledWith({
        id: {
          id_alumno: 1,
          id_asignatura: 2
        },
        nota: 8
      });
    });
  });

  test('permite abrir el formulario de edición', async () => {
    getMatriculas.mockResolvedValue([
      {
        id: { id_alumno: 1, id_asignatura: 2 },
        nota: 7
      }
    ]);

    render(<Matriculas />);

    expect(await screen.findByText('7')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    expect(screen.getByDisplayValue('7')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
  });

  test('actualiza una matrícula existente', async () => {
    getMatriculas.mockResolvedValue([
      {
        id: { id_alumno: 1, id_asignatura: 2 },
        nota: 7
      }
    ]);

    putMatricula.mockResolvedValue(true);

    render(<Matriculas />);

    expect(await screen.findByText('7')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /editar/i }));

    fireEvent.change(screen.getByDisplayValue('7'), {
      target: { value: '10' }
    });

    fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

    await waitFor(() => {
      expect(putMatricula).toHaveBeenCalledWith({
        id: {
          id_alumno: 1,
          id_asignatura: 2
        },
        nota: 10
      });
    });
  });

  test('logout elimina el token y redirige al inicio', async () => {
    getMatriculas.mockResolvedValue([]);

    delete window.location;
    window.location = { href: '' };

    render(<Matriculas />);

    await screen.findByText(/lista de matrículas/i);

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.href).toBe('/');
  });

  test('converts form fields to numeric values on creation', async () => {
  getMatriculas.mockResolvedValue([]);
  postMatricula.mockResolvedValue(true);

  render(<Matriculas />);

  await waitFor(() => {
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: /insertar nueva matrícula/i }));

  fireEvent.change(screen.getByPlaceholderText(/id alumno/i), {
    target: { name: 'id_alumno', value: '5' }
  });

  fireEvent.change(screen.getByPlaceholderText(/id asignatura/i), {
    target: { name: 'id_asignatura', value: '8' }
  });

  fireEvent.change(screen.getByPlaceholderText(/nota/i), {
    target: { name: 'nota', value: '6.5' }
  });

  fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

  await waitFor(() => {
    expect(postMatricula).toHaveBeenCalledWith({
      id: {
        id_alumno: 5,
        id_asignatura: 8
      },
      nota: 6.5
    });
  });
});

test('muestra alerta si falla la creación de matrícula', async () => {
  getMatriculas.mockResolvedValue([]);
  postMatricula.mockRejectedValue(new Error('Error al crear matrícula'));
  window.alert = jest.fn();

  render(<Matriculas />);

  await waitFor(() => {
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: /insertar nueva matrícula/i }));

  fireEvent.change(screen.getByPlaceholderText(/id alumno/i), {
    target: { name: 'id_alumno', value: '1' }
  });

  fireEvent.change(screen.getByPlaceholderText(/id asignatura/i), {
    target: { name: 'id_asignatura', value: '2' }
  });

  fireEvent.change(screen.getByPlaceholderText(/nota/i), {
    target: { name: 'nota', value: '8' }
  });

  fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Error al crear matrícula');
  });
});

test('muestra alerta si falla la actualización de matrícula', async () => {
  getMatriculas.mockResolvedValue([
    {
      id: { id_alumno: 1, id_asignatura: 2 },
      nota: 7
    }
  ]);

  putMatricula.mockRejectedValue(new Error('Error al actualizar matrícula'));
  window.alert = jest.fn();

  render(<Matriculas />);

  expect(await screen.findByText('7')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /editar/i }));

  fireEvent.change(screen.getByDisplayValue('7'), {
    target: { value: '9' }
  });

  fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Error al actualizar matrícula');
  });
});

test('shows empty table when getMatriculas returns empty array', async () => {
  getMatriculas.mockResolvedValue([]);

  render(<Matriculas />);

  await screen.findByText(/lista de matrículas/i);

  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.queryByText('7')).not.toBeInTheDocument();
});

test('muestra error 500 si getMatriculas rechaza con ese mensaje', async () => {
  getMatriculas.mockRejectedValue(new Error('Error GET Matriculas: 500'));

  render(<Matriculas />);

  expect(await screen.findByText(/error: error get matriculas: 500/i)).toBeInTheDocument();
});

test('muestra error si getMatriculas rechaza la promesa', async () => {
  getMatriculas.mockRejectedValue(new Error('Network Error'));

  render(<Matriculas />);

  expect(await screen.findByText(/error: network error/i)).toBeInTheDocument();
});

test('muestra alerta si falla el borrado de matrícula', async () => {
  getMatriculas.mockResolvedValue([
    {
      id: { id_alumno: 1, id_asignatura: 2 },
      nota: 7
    }
  ]);
  deleteMatricula.mockRejectedValue(new Error('Error DELETE Matricula: 500'));
  window.confirm = jest.fn(() => true);
  window.alert = jest.fn();

  render(<Matriculas />);

  expect(await screen.findByText('7')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /borrar/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Error DELETE Matricula: 500');
  });
});
});