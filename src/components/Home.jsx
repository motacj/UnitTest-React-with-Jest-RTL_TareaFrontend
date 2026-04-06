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
        <section
            className="min-vh-100 d-flex align-items-center"
            style={{ backgroundColor: "#665e5e" }}>
            <div className="container text-center">

                    <h1 className="mb-3 text-white">Mi Académica</h1>
                    <p className="lead text-white mb-4">
                        Sistema de Gestión de Alumnos y Cursos
                    </p>

                    <div className="d-flex flex-column align-items-center gap-3">

                        <Link
                            to="/personas"
                            className="btn btn-lg w-50"
                            style={{ backgroundColor: "#a09494", color: "white" }}
                        >
                            Listar Alumnos
                        </Link>

                        <Link
                            to="/asignaturas"
                            className="btn btn-lg w-50"
                            style={{ backgroundColor: "#a09494", color: "white" }}
                        >
                            Listar Asignaturas
                        </Link>

                        <Link
                            to="/matriculas"
                            className="btn btn-lg w-50"
                            style={{ backgroundColor: "#a09494", color: "white" }}
                        >
                            Listar Matrículas
                        </Link>

                        <button
                            onClick={logout}
                            className="btn btn-lg w-50"
                            style={{ backgroundColor: "#dc3545", color: "white" }}
                        >
                            Cerrar sesión
                        </button>

                    </div>
                </div>
        </section>
    );
}

export default Home;