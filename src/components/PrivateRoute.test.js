import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

describe('PrivateRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('redirige a la página pública si no hay jwt', () => {
    render(
      <MemoryRouter initialEntries={['/privada']}>
        <Routes>
          <Route path="/" element={<div>Página login</div>} />
          <Route
            path="/privada"
            element={
              <PrivateRoute>
                <div>Zona privada</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/página login/i)).toBeInTheDocument();
    expect(screen.queryByText(/zona privada/i)).not.toBeInTheDocument();
  });

  test('permite acceder a la zona privada si hay jwt', () => {
    localStorage.setItem('jwt', 'fake-jwt');

    render(
      <MemoryRouter initialEntries={['/privada']}>
        <Routes>
          <Route path="/" element={<div>Página login</div>} />
          <Route
            path="/privada"
            element={
              <PrivateRoute>
                <div>Zona privada</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/zona privada/i)).toBeInTheDocument();
    expect(screen.queryByText(/página login/i)).not.toBeInTheDocument();
  });
});