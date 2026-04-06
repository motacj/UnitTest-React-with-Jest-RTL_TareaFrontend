import React from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/home");
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-4">Iniciar Sesión</h3>

                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input type="text" className="form-control" placeholder="Introduce tu usuario" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" placeholder="Introduce tu contraseña" />
                </div>

                <button className="btn btn-primary w-100" onClick={handleLogin}>
                    Entrar
                </button>
            </div>
        </div>
    );
};

export default Login;
