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

    handleDelete(idAlumno, idAsignatura) {
        if (window.confirm("¿Estás seguro de que quieres borrar esta matrícula?")) {
            deleteMatricula(idAlumno, idAsignatura)
                .then(() => this.fetchData())
                .catch(error => alert(`Error al borrar: ${error.message}`));
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

    handleInputChange(event) {
        const { name, value } = event.target;

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

    handleInsert(event) {
        event.preventDefault();

        postMatricula(this.state.newMatricula)
            .then(() => {
                alert("Matrícula insertada correctamente");
                this.handleToggleForm();
                this.fetchData();
            })
            .catch(error => alert(`Error al insertar: ${error.message}`));
    }

    handleStartEdit(matricula) {
        this.setState({
            isEditing: true,
            matriculaToEdit: JSON.parse(JSON.stringify(matricula)),
            showInsertForm: false
        });
    }

    handleEditInputChange(event) {
        const { value } = event.target;

        this.setState(prev => ({
            matriculaToEdit: {
                ...prev.matriculaToEdit,
                nota: parseFloat(value) || 0
            }
        }));
    }

    handleUpdate(event) {
        event.preventDefault();

        putMatricula(this.state.matriculaToEdit)
            .then(() => {
                alert("Matrícula actualizada correctamente");
                this.setState({ isEditing: false, matriculaToEdit: null });
                this.fetchData();
            })
            .catch(error => alert(`Error al actualizar: ${error.message}`));
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

        const deleteButtonStyle = {
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        };

        const editButtonStyle = {
            padding: '5px 10px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '5px'
        };

        if (error) return <div>Error: {error}</div>;
        if (isLoading) return <div>Cargando listado de matrículas...</div>;

        return (
            <div>
                <h2>Lista de Matrículas</h2>

                <button
                    onClick={this.handleToggleForm}
                    style={{
                        padding: '10px',
                        margin: '10px',
                        backgroundColor: showInsertForm ? '#ffc107' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                    disabled={isEditing}
                >
                    {showInsertForm ? 'Cancelar' : 'Insertar Nueva Matrícula'}
                </button>

                {showInsertForm && (
                    <form
                        onSubmit={this.handleInsert}
                        style={{
                            border: '1px solid #ccc',
                            padding: '20px',
                            margin: '20px auto',
                            width: '300px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <h3>Insertar Matrícula</h3>

                        <input
                            name="id_alumno"
                            placeholder="ID Alumno"
                            value={newMatricula.id.id_alumno}
                            onChange={this.handleInputChange}
                            required
                        />

                        <input
                            name="id_asignatura"
                            placeholder="ID Asignatura"
                            value={newMatricula.id.id_asignatura}
                            onChange={this.handleInputChange}
                            required
                        />

                        <input
                            name="nota"
                            type="number"
                            step="0.1"
                            placeholder="Nota"
                            value={newMatricula.nota}
                            onChange={this.handleInputChange}
                            required
                        />

                        <button type="submit">Guardar Matrícula</button>
                    </form>
                )}

                {isEditing && matriculaToEdit && (
                    <form
                        onSubmit={this.handleUpdate}
                        style={{
                            border: '2px solid #ff9800',
                            padding: '20px',
                            margin: '20px auto',
                            width: '300px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <h3>Editando Matrícula</h3>

                        <input
                            type="number"
                            step="0.1"
                            value={matriculaToEdit.nota}
                            onChange={this.handleEditInputChange}
                            required
                        />

                        <button type="submit">Actualizar</button>
                        <button
                            type="button"
                            onClick={() => this.setState({ isEditing: false, matriculaToEdit: null })}
                        >
                            Cancelar
                        </button>
                    </form>
                )}

                <table
                    border="1"
                    style={{
                        width: '80%',
                        borderCollapse: 'collapse',
                        margin: '20px auto'
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
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
                                        onClick={() =>
                                            this.handleDelete(
                                                m.id.id_alumno,
                                                m.id.id_asignatura
                                            )
                                        }
                                        style={deleteButtonStyle}
                                    >
                                        Borrar
                                    </button>

                                    <button
                                        onClick={() => this.handleStartEdit(m)}
                                        style={editButtonStyle}
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Matriculas;