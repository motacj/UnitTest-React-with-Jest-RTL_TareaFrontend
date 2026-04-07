import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Personas from './components/Personas.jsx';
import Asignaturas from './components/Asignaturas.jsx';
import Matriculas from './components/Matriculas.jsx';
import Login from './components/Login.jsx';
import Menu from './components/Menu.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN (SIN MENÚ) */}
        <Route path="/" element={<Login />} />
        {/* ZONA INTERNA (CON MENÚ) */}
        <Route path="/home" element={
          <>
            <Menu />
            <Home />
          </>
        }
        />
        <Route
          path="/personas" element={
            <>
              <Menu />
              <Personas />
            </>
          }
        />
        <Route path="/asignaturas" element={
          <>
            <Menu />
            <Asignaturas />
          </>
        }
        />
        <Route path="/matriculas" element={
          <>
            <Menu />
            <Matriculas />
          </>
        }
        />
      </Routes>
    </Router>
  );
}
export default App;
