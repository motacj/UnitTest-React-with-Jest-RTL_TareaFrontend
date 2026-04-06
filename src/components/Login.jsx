import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error("Credenciales incorrectas");
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);

            navigate("/home");

        } catch (error) {
            console.error("Error login:", error);
            alert("Usuario o contraseña incorrectos");
        }
    };

    return (
        <section className="h-100 gradient-form" style={{ backgroundColor: "#665e5e" }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10" style={{ backgroundColor: "#665e5e" }}>
                        <div className="card rounded-3 text-black" style={{ backgroundColor: "#665e5e" }}>
                            <div className="row g-0" style={{ backgroundColor: "#a17979" }}>

                                {/* COLUMNA LOGIN */}
                                <div className="col-lg-6" style={{ backgroundColor: "#665e5e" }}>
                                    <div className="card-body p-md-5 mx-md-4" style={{ backgroundColor: "#665e5e" }}>

                                        <div className="text-center">
                                            <img
                                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                                                style={{ width: "185px" }}
                                                alt="logo"
                                            />
                                            <h4 className="mt-1 mb-5 pb-1">Inicio de la Sesión</h4>
                                        </div>

                                        <form onSubmit={handleLogin}>
                                            <p>Por favor introduce tu Usuario y Constraseña</p>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="text"
                                                    id="form2Example11"
                                                    className="form-control"
                                                    placeholder="Usuario"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required
                                                />
                                                <label className="form-label" htmlFor="form2Example11">
                                                    Usuario
                                                </label>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="form2Example22"
                                                    className="form-control"
                                                    placeholder="Contraseña"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <label className="form-label" htmlFor="form2Example22">
                                                    Contraseña
                                                </label>
                                            </div>

                                            <div className="text-center pt-1 mb-5 pb-1">
                                                <button
                                                    className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                                                    type="submit"
                                                    style={{ backgroundColor: "#a09494" }}
                                                >
                                                    Login
                                                </button>
                                            </div>

                                        </form>
                                    </div>
                                </div>

                                {/* COLUMNA TEXTO DERECHO */}
                                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                        <h4 className="mb-4">We are more than just a company</h4>
                                        <p className="small mb-0">
                                            He modificado la página de login adaptando el HTML tradicional a la sintaxis correcta de React y utilizando Bootstrap para mejorar el diseño y la estructura.
                                            He sustituido atributos como <strong>class</strong> por <strong>className</strong>,
                                            <strong> for</strong> por <strong>htmlFor</strong> y he transformado los estilos en línea
                                            al formato de objeto que exige React.
                                        </p>
                                        <p>Por ejemplo, antes tenía:</p>
                                        <p>style="background-color: #eee;"</p>
                                        <p>y lo he cambiado por:</p>
                                        <p>style={"{{ backgroundColor: \"#eee\" }}"}</p>
                                        <p>
                                            De esta forma, la página ahora cumple la sintaxis JSX correcta y aprovecha el sistema de grid
                                            y los componentes de Bootstrap para lograr un diseño responsive y profesional.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;