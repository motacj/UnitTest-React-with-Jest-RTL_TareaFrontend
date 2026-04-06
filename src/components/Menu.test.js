import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Menu from './Menu';

describe('Menu component', () => {
  test('renderiza la marca y los enlaces del menú', () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: /home con react-bootstrap/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /listar alumnos/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /listar asignaturas/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /listar matriculas/i })
    ).toBeInTheDocument();
  });

  test('el enlace HOME navega a /home', () => {
    render(
      <MemoryRouter initialEntries={['/personas']}>
        <Menu />
        <Routes>
          <Route path="/home" element={<div>Página Home</div>} />
          <Route path="/personas" element={<div>Página Personas</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('link', { name: /home con react-bootstrap/i })
    );

    expect(screen.getByText(/página home/i)).toBeInTheDocument();
  });

  test('el enlace Listar Alumnos navega a /personas', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <Menu />
        <Routes>
          <Route path="/home" element={<div>Página Home</div>} />
          <Route path="/personas" element={<div>Página Personas</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('link', { name: /listar alumnos/i })
    );

    expect(screen.getByText(/página personas/i)).toBeInTheDocument();
  });

  test('el enlace Listar Asignaturas navega a /asignaturas', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <Menu />
        <Routes>
          <Route path="/home" element={<div>Página Home</div>} />
          <Route path="/asignaturas" element={<div>Página Asignaturas</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('link', { name: /listar asignaturas/i })
    );

    expect(screen.getByText(/página asignaturas/i)).toBeInTheDocument();
  });

  test('el enlace Listar Matriculas navega a /matriculas', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <Menu />
        <Routes>
          <Route path="/home" element={<div>Página Home</div>} />
          <Route path="/matriculas" element={<div>Página Matriculas</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole('link', { name: /listar matriculas/i })
    );

    expect(screen.getByText(/página matriculas/i)).toBeInTheDocument();
  });
});