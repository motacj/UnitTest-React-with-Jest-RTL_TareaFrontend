import React from 'react';
import {
    getAsignaturas,
    deleteAsignatura,
    postAsignatura,
    putAsignatura
} from '../services/apirestAsignaturas.js';

class Asignaturas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            asignaturas: [],
            isLoading: true,
            error: null,
            showInsertForm: false,
            isEditing: false,
            asignaturaToEdit: null,
            newAsignatura: {
                id_asignatura: 0,
                id_profesor: 0,
                nombre_asignatura: '',
                horario: ''
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

        getAsignaturas()
            .then(data => this.setState({ asignaturas: data, isLoading: false }))
            .catch(error => this.setState({ error: error.message, isLoading: false }));
    }

    handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    handleDelete(id) {
        if (window.confirm(`¿Borrar asignatura ID ${id}?`)) {
            deleteAsignatura(id)
                .then(() => this.fetchData())
                .catch(error => alert(error.message));
        }
    }

    handleToggleForm() {
        this.setState(prev => ({
            showInsertForm: !prev.showInsertForm,
            newAsignatura: {
                id_asignatura: 0,
                id_profesor: 0,
                nombre_asignatura: '',
                horario: ''
            }
        }));
    }

    handleInputChange(e) {
        const { name, value } = e.target;

        this.setState(prev => ({
            newAsignatura: {
                ...prev.newAsignatura,
                [name]: name.includes("id") ? (parseInt(value) || 0) : value
            }
        }));
    }

    handleInsert(e) {
        e.preventDefault();

        postAsignatura(this.state.newAsignatura)
            .then(() => {
                this.handleToggleForm();
                this.fetchData();
            })
            .catch(error => alert(error.message));
    }

    handleStartEdit(asignatura) {
        this.setState({
            isEditing: true,
            asignaturaToEdit: { ...asignatura },
            showInsertForm: false
        });
    }

    handleEditInputChange(e) {
        const { name, value } = e.target;

        this.setState(prev => ({
            asignaturaToEdit: {
                ...prev.asignaturaToEdit,
                [name]: name.includes("id") ? (parseInt(value) || 0) : value
            }
        }));
    }

    handleUpdate(e) {
        e.preventDefault();

        putAsignatura(this.state.asignaturaToEdit)
            .then(() => {
                this.setState({ isEditing: false, asignaturaToEdit: null });
                this.fetchData();
            })
            .catch(error => alert(error.message));
    }

    render() {

        const { asignaturas, isLoading, error, showInsertForm, newAsignatura, isEditing, asignaturaToEdit } = this.state;

        if (isLoading) return <div style={{ color: "white" }}>Cargando...</div>;
        if (error) return <div style={{ color: "white" }}>Error: {error}</div>;

        return (
            <section style={{ backgroundColor: "#665e5e", minHeight: "100vh" }}>
                <div className="container py-5">

                    <div className="card rounded-3 text-black" style={{ backgroundColor: "#a17979" }}>
                        <div className="card-body">

                            <div className="text-end mb-3">
                                <button className="btn btn-danger" onClick={this.handleLogout}>
                                    Logout
                                </button>
                            </div>

                            <h2 className="text-center text-white mb-4">Lista de Asignaturas</h2>

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
                                    {showInsertForm ? "Cancelar" : "Insertar Nueva Asignatura"}
                                </button>
                            </div>

                            {showInsertForm && (
                                <form onSubmit={this.handleInsert} className="mb-4 text-center">

                                    <input
                                        type="number"
                                        name="id_profesor"
                                        placeholder="ID Profesor"
                                        className="form-control mb-2"
                                        value={newAsignatura.id_profesor}
                                        onChange={this.handleInputChange}
                                    />

                                    <input
                                        name="nombre_asignatura"
                                        placeholder="Nombre"
                                        className="form-control mb-2"
                                        value={newAsignatura.nombre_asignatura}
                                        onChange={this.handleInputChange}
                                    />

                                    <input
                                        name="horario"
                                        placeholder="Horario"
                                        className="form-control mb-2"
                                        value={newAsignatura.horario}
                                        onChange={this.handleInputChange}
                                    />

                                    <button className="btn btn-primary" style={{ backgroundColor: "#a09494" }}>
                                        Guardar
                                    </button>
                                </form>
                            )}

                            {isEditing && asignaturaToEdit && (
                                <form onSubmit={this.handleUpdate} className="mb-4 text-center">

                                    <input
                                        type="number"
                                        name="id_profesor"
                                        className="form-control mb-2"
                                        value={asignaturaToEdit.id_profesor}
                                        onChange={this.handleEditInputChange}
                                    />

                                    <input
                                        name="nombre_asignatura"
                                        className="form-control mb-2"
                                        value={asignaturaToEdit.nombre_asignatura}
                                        onChange={this.handleEditInputChange}
                                    />

                                    <select
                                        name="horario"
                                        className="form-control mb-2"
                                        value={newAsignatura.horario}
                                        onChange={this.handleInputChange}
                                        required
                                    >
                                        <option value="">Seleccionar horario</option>
                                        <option value="Mañana">Mañana</option>
                                        <option value="Tarde">Tarde</option>
                                    </select>

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

                            <div className="table-responsive">
                                <table className="table table-dark table-striped text-center">
                                    <thead>
                                        <tr>
                                            <th>ID Profesor</th>
                                            <th>ID Asignatura</th>
                                            <th>Nombre</th>
                                            <th>Horario</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asignaturas.map(asignatura => (
                                            <tr key={asignatura.id_asignatura}>
                                                <td>{asignatura.id_profesor}</td>
                                                <td>{asignatura.id_asignatura}</td>
                                                <td>{asignatura.nombre_asignatura}</td>
                                                <td>{asignatura.horario}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-sm me-2"
                                                        onClick={() => this.handleDelete(asignatura.id_asignatura)}
                                                    >
                                                        Borrar
                                                    </button>

                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => this.handleStartEdit(asignatura)}
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

export default Asignaturas;