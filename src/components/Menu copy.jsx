import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/home" style={{ margin: '0 15px', textDecoration: 'none' }}>
        Home
      </Link>

      <Link to="/personas" style={{ margin: '0 15px', textDecoration: 'none' }}>
        Personas
      </Link>

      <Link to="/asignaturas" style={{ margin: '0 15px', textDecoration: 'none' }}>
        Asignaturas
      </Link>

      <Link to="/matriculas" style={{ margin: '0 15px', textDecoration: 'none' }}>
        Matrículas
      </Link>
    </nav>
  );
}

export default Menu;