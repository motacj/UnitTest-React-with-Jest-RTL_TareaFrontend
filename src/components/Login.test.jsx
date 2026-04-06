import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Login component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    window.alert = jest.fn();
    localStorage.clear();
  });

  test('renderiza el formulario de login', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  test('permite escribir usuario y contraseña', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const inputUsuario = screen.getByLabelText(/usuario/i);
    const inputContrasena = screen.getByLabelText(/contraseña/i);

    userEvent.type(inputUsuario, 'jesus');
    userEvent.type(inputContrasena, '123456');

    expect(inputUsuario).toHaveValue('jesus');
    expect(inputContrasena).toHaveValue('123456');
  });

  test('el campo contraseña es password y el botón es submit', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const inputContrasena = screen.getByLabelText(/contraseña/i);
    const botonLogin = screen.getByRole('button', { name: /login/i });

    expect(inputContrasena).toHaveAttribute('type', 'password');
    expect(botonLogin).toHaveAttribute('type', 'submit');
  });

  test('muestra el título de inicio de sesión', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText(/inicio de la sesión/i)).toBeInTheDocument();
  });

  test('muestra los placeholders de usuario y contraseña', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });

  test('llama al login al enviar y guarda el token', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ token: 'fake-jwt' })
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const inputUsuario = screen.getByLabelText(/usuario/i);
    const inputContrasena = screen.getByLabelText(/contraseña/i);
    const botonLogin = screen.getByRole('button', { name: /login/i });

    userEvent.type(inputUsuario, 'jesus');
    userEvent.type(inputContrasena, '123456');
    fireEvent.click(botonLogin);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: 'jesus',
            password: '123456'
          })
        }
      );
    });

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-jwt');
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  test('muestra alerta si el login falla', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const inputUsuario = screen.getByLabelText(/usuario/i);
    const inputContrasena = screen.getByLabelText(/contraseña/i);
    const botonLogin = screen.getByRole('button', { name: /login/i });

    userEvent.type(inputUsuario, 'jesus');
    userEvent.type(inputContrasena, 'malpassword');
    fireEvent.click(botonLogin);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Usuario o contraseña incorrectos');
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('show alert if login returns error 500', async () => {
  fetch.mockResolvedValue({
    ok: false,
    status: 500
  });

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  userEvent.type(screen.getByLabelText(/usuario/i), 'jesus');
  userEvent.type(screen.getByLabelText(/contraseña/i), '123456');
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Usuario o contraseña incorrectos');
  });

  expect(localStorage.getItem('token')).toBeNull();
});

test('muestra alerta si fetch rechaza la promesa', async () => {
  fetch.mockRejectedValue(new Error('Network Error'));

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  userEvent.type(screen.getByLabelText(/usuario/i), 'jesus');
  userEvent.type(screen.getByLabelText(/contraseña/i), '123456');
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Usuario o contraseña incorrectos');
  });

  expect(localStorage.getItem('token')).toBeNull();
});
});