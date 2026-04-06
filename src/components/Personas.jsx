import React from 'react';
import { getPersonas, deletePersona, postPersona, putPersona } from '../services/apirestPersonas.js';

class Personas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            personas: [],
            isLoading: true,
            error: null,
            showInsertForm: false,
            isEditing: false,
            personaToEdit: null,
            newPersona: {
                id_persona: 0,
                nombre: '',
                apellidos: '',
                edad: 0,
            }
        };

        this.fetchData = this.fetchData.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleToggleForm = this.handleToggleForm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInsert = this.handleInsert.bind(this);
        this.handleStartEdit = this.handleStartEdit.bind(this);
        this.handleEditInputChange = this.handleEditInputChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        this.setState({ isLoading: true, error: null });

        getPersonas()
            .then(data => this.setState({ personas: data, isLoading: false }))
            .catch(error => this.setState({ error: error.message, isLoading: false }));
    }

    handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    handleDelete(id) {
        if (window.confirm(`¿Borrar persona ID ${id}?`)) {
            deletePersona(id)
                .then(() => this.fetchData())
                .catch(error => alert(error.message));
        }
    }

    handleToggleForm() {
        this.setState(prev => ({
            showInsertForm: !prev.showInsertForm,
            newPersona: { id_persona: 0, nombre: '', apellidos: '', edad: 0 }
        }));
    }

    handleInputChange(e) {
        const { name, value } = e.target;

        this.setState(prev => ({
            newPersona: {
                ...prev.newPersona,
                [name]: name === 'edad' ? (parseInt(value) || 0) : value
            }
        }));
    }

    handleInsert(e) {
        e.preventDefault();

        postPersona(this.state.newPersona)
            .then(() => {
                this.handleToggleForm();
                this.fetchData();
            })
            .catch(error => alert(error.message));
    }

    handleStartEdit(persona) {
        this.setState({
            isEditing: true,
            personaToEdit: { ...persona },
            showInsertForm: false
        });
    }

    handleEditInputChange(e) {
        const { name, value } = e.target;

        this.setState(prev => ({
            personaToEdit: {
                ...prev.personaToEdit,
                [name]: name === 'edad' ? (parseInt(value) || 0) : value
            }
        }));
    }

    handleUpdate(e) {
        e.preventDefault();

        putPersona(this.state.personaToEdit)
            .then(() => {
                this.setState({ isEditing: false, personaToEdit: null });
                this.fetchData();
            })
            .catch(error => alert(error.message));
    }

    render() {

        const { personas, isLoading, error, showInsertForm, newPersona, isEditing, personaToEdit } = this.state;

        if (isLoading) {
            return <div style={{ color: "white" }}>Cargando...</div>;
        }

        if (error) {
            return <div style={{ color: "white" }}>Error: {error}</div>;
        }

        return (
            <section style={{ backgroundColor: "#665e5e", minHeight: "100vh" }}>
                <div className="container py-5">

                    <div className="card rounded-3 text-black" style={{ backgroundColor: "#a17979" }}>
                        <div className="card-body">

                            {/* Logout */}
                            <div className="text-end mb-3">
                                <button
                                    className="btn btn-danger"
                                    onClick={this.handleLogout}
                                >
                                    Logearse
                                </button>
                            </div>

                            <h2 className="text-center text-white mb-4">Lista de Alumnos</h2>

                            <div className="text-center mb-3">
                                <button
                                    className="btn"
                                    style={{
                                        backgroundColor: showInsertForm ? "#ffc107" : "#28a745",
                                        color: "white"
                                    }}
                                    onClick={this.handleToggleForm}
                                    disabled={isEditing}
                                >
                                    {showInsertForm ? "Cancelar" : "Insertar Nuevo Alumno"}
                                </button>
                            </div>

                            {/* FORM INSERT */}
                            {showInsertForm && (
                                <form onSubmit={this.handleInsert} className="mb-4 text-center">

                                    <input
                                        name="nombre"
                                        placeholder="Nombre"
                                        className="form-control mb-2"
                                        value={newPersona.nombre}
                                        onChange={this.handleInputChange}
                                    />

                                    <input
                                        name="apellidos"
                                        placeholder="Apellidos"
                                        className="form-control mb-2"
                                        value={newPersona.apellidos}
                                        onChange={this.handleInputChange}
                                    />

                                    <input
                                        type="number"
                                        name="edad"
                                        placeholder="Edad"
                                        className="form-control mb-2"
                                        value={newPersona.edad === 0 ? "" : newPersona.edad}
                                        onChange={this.handleInputChange}
                                    />

                                    <button className="btn btn-primary" style={{ backgroundColor: "#a09494" }}>
                                        Guardar
                                    </button>

                                </form>
                            )}

                            {/* FORM EDIT */}
                            {isEditing && personaToEdit && (
                                <form onSubmit={this.handleUpdate} className="mb-4 text-center">

                                    <input
                                        name="nombre"
                                        className="form-control mb-2"
                                        value={personaToEdit.nombre}
                                        onChange={this.handleEditInputChange}
                                    />

                                    <input
                                        name="apellidos"
                                        className="form-control mb-2"
                                        value={personaToEdit.apellidos}
                                        onChange={this.handleEditInputChange}
                                    />

                                    <input
                                        type="number"
                                        name="edad"
                                        className="form-control mb-2"
                                        value={personaToEdit.edad}
                                        onChange={this.handleEditInputChange}
                                    />

                                    <button className="btn btn-warning me-2">
                                        Actualizar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => this.setState({ isEditing: false })}
                                    >
                                        Cancelar
                                    </button>

                                </form>
                            )}

                            {/* TABLA */}
                            <div className="table-responsive">
                                <table className="table table-dark table-striped text-center">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Apellidos</th>
                                            <th>Edad</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {personas.map(persona => (
                                            <tr key={persona.id_persona}>
                                                <td>{persona.id_persona}</td>
                                                <td>{persona.nombre}</td>
                                                <td>{persona.apellidos}</td>
                                                <td>{persona.edad}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-sm me-2"
                                                        onClick={() => this.handleDelete(persona.id_persona)}
                                                    >
                                                        Borrar
                                                    </button>

                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => this.handleStartEdit(persona)}
                                                    >
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>

                </div>
            </section>
        );
    }
}

export default Personas;