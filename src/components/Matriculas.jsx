import React from 'react';
import {
    getMatriculas,
    deleteMatricula,
    postMatricula,
    putMatricula
} from '../services/apirestMatriculas.js';

class Matriculas extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            matriculas: [],
            isLoading: true,
            error: null,
            showInsertForm: false,
            isEditing: false,
            matriculaToEdit: null,
            newMatricula: {
                id: {
                    id_alumno: 0,
                    id_asignatura: 0
                },
                nota: 0
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

        getMatriculas()
            .then(data => this.setState({ matriculas: data, isLoading: false }))
            .catch(error => this.setState({ error: error.message, isLoading: false }));
    }

    handleLogout() {
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    handleDelete(idAlumno, idAsignatura) {
        if (window.confirm("¿Borrar matrícula?")) {
            deleteMatricula(idAlumno, idAsignatura)
                .then(() => this.fetchData())
                .catch(error => alert(error.message));
        }
    }

    handleToggleForm() {
        this.setState(prev => ({
            showInsertForm: !prev.showInsertForm,
            newMatricula: {
                id: { id_alumno: 0, id_asignatura: 0 },
                nota: 0
            }
        }));
    }

    handleInputChange(e) {
        const { name, value } = e.target;

        if (name === "id_alumno" || name === "id_asignatura") {
            this.setState(prev => ({
                newMatricula: {
                    ...prev.newMatricula,
                    id: {
                        ...prev.newMatricula.id,
                        [name]: parseInt(value) || 0
                    }
                }
            }));
        } else {
            this.setState(prev => ({
                newMatricula: {
                    ...prev.newMatricula,
                    nota: parseFloat(value) || 0
                }
            }));
        }
    }

    handleInsert(e) {
        e.preventDefault();

        postMatricula(this.state.newMatricula)
            .then(() => {
                this.handleToggleForm();
                this.fetchData();
            })
            .catch(error => alert(error.message));
    }

    handleStartEdit(matricula) {
        this.setState({
            isEditing: true,
            matriculaToEdit: JSON.parse(JSON.stringify(matricula)),
            showInsertForm: false
        });
    }

    handleEditInputChange(e) {
        const { value } = e.target;

        this.setState(prev => ({
            matriculaToEdit: {
                ...prev.matriculaToEdit,
                nota: parseFloat(value) || 0
            }
        }));
    }

    handleUpdate(e) {
        e.preventDefault();

        putMatricula(this.state.matriculaToEdit)
            .then(() => {
                this.setState({ isEditing: false, matriculaToEdit: null });
                this.fetchData();
            })
            .catch(error => alert(error.message));
    }

    render() {

        const {
            matriculas,
            isLoading,
            error,
            showInsertForm,
            newMatricula,
            isEditing,
            matriculaToEdit
        } = this.state;

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

                            <h2 className="text-center text-white mb-4">Lista de Matrículas</h2>

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
                                    {showInsertForm ? "Cancelar" : "Insertar Nueva Matrícula"}
                                </button>
                            </div>

                            {showInsertForm && (
                                <form onSubmit={this.handleInsert} className="mb-4 text-center">

                                    <input
                                        name="id_alumno"
                                        placeholder="ID Alumno"
                                        className="form-control mb-2"
                                        value={newMatricula.id.id_alumno}
                                        onChange={this.handleInputChange}
                                    />

                                    <input
                                        name="id_asignatura"
                                        placeholder="ID Asignatura"
                                        className="form-control mb-2"
                                        value={newMatricula.id.id_asignatura}
                                        onChange={this.handleInputChange}
                                    />

                                    <input
                                        name="nota"
                                        type="number"
                                        step="0.1"
                                        placeholder="Nota"
                                        className="form-control mb-2"
                                        value={newMatricula.nota}
                                        onChange={this.handleInputChange}
                                    />

                                    <button className="btn btn-primary" style={{ backgroundColor: "#a09494" }}>
                                        Guardar
                                    </button>
                                </form>
                            )}

                            {isEditing && matriculaToEdit && (
                                <form onSubmit={this.handleUpdate} className="mb-4 text-center">

                                    <input
                                        type="number"
                                        step="0.1"
                                        className="form-control mb-2"
                                        value={matriculaToEdit.nota}
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

                            <div className="table-responsive">
                                <table className="table table-dark table-striped text-center">
                                    <thead>
                                        <tr>
                                            <th>ID Alumno</th>
                                            <th>ID Asignatura</th>
                                            <th>Nota</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {matriculas.map(m => (
                                            <tr key={`${m.id.id_alumno}-${m.id.id_asignatura}`}>
                                                <td>{m.id.id_alumno}</td>
                                                <td>{m.id.id_asignatura}</td>
                                                <td>{m.nota}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-sm me-2"
                                                        onClick={() => this.handleDelete(m.id.id_alumno, m.id.id_asignatura)}
                                                    >
                                                        Borrar
                                                    </button>

                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => this.handleStartEdit(m)}
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

export default Matriculas;