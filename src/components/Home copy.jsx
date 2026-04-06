import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("jwt");
        navigate("/");
    };

    const buttonStyle = {
        padding: '10px 20px',
        margin: '10px 0',
        width: '200px',
        textDecoration: 'none',
        textAlign: 'center',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '5px',
        display: 'block'
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>

            <h1>Mi Académica</h1>
            <p>Sistema de Gestión de Alumnos y Cursos</p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
                
                <Link to="/personas" style={buttonStyle}>
                    Gestionar Personas
                </Link>
                
                <Link to="/asignaturas" style={buttonStyle}>
                    Listar Asignaturas
                </Link>
                
                <Link to="/matriculas" style={buttonStyle}>
                    Ver Matrículas
                </Link>

                <button 
                    onClick={logout}
                    style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}

export default Home;