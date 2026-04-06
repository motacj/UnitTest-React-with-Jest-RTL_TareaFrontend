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
        
        this.handleDelete = this.handleDelete.bind(this);
        this.handleToggleForm = this.handleToggleForm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInsert = this.handleInsert.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.handleStartEdit = this.handleStartEdit.bind(this);
        this.handleEditInputChange = this.handleEditInputChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    fetchData() {
        this.setState({ isLoading: true, error: null });
        getAsignaturas()
            .then(data => this.setState({ asignaturas: data, isLoading: false }))
            .catch(error => this.setState({ error: error.message, isLoading: false }));
    }

    componentDidMount() {
        this.fetchData();
    }

    handleDelete(id) {
        if (window.confirm(`¿Estás seguro de que quieres borrar la asignatura con ID ${id}?`)) {
            deleteAsignatura(id)
                .then(() => {
                    this.fetchData();
                })
                .catch(error => {
                    alert(`Fallo al borrar la asignatura: ${error.message}`);
                });
        }
    }

    handleToggleForm() {
        this.setState(prevState => ({
            showInsertForm: !prevState.showInsertForm,
            newAsignatura: { 
                id_asignatura: 0,
                id_profesor: 0,
                nombre_asignatura: '',
                horario: ''
            }
        }));
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        this.setState(prevState => ({
            newAsignatura: {
                ...prevState.newAsignatura,
                [name]: name.includes("id") ? (parseInt(value) || 0) : value
            }
        }));
    }

    handleInsert(event) {
        event.preventDefault();
        
        const { id_profesor, nombre_asignatura, horario } = this.state.newAsignatura;
        if (!id_profesor || !nombre_asignatura || !horario) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        postAsignatura(this.state.newAsignatura)
            .then(() => {
                alert('Asignatura insertada con éxito!');
                this.handleToggleForm();
                this.fetchData();
            })
            .catch(error => {
                alert(`Error al insertar: ${error.message}`);
            });
    }

    handleStartEdit(asignatura) {
        this.setState({
            isEditing: true,
            asignaturaToEdit: { ...asignatura },
            showInsertForm: false
        });
    }

    handleEditInputChange(event) {
        const { name, value } = event.target;
        this.setState(prevState => ({
            asignaturaToEdit: {
                ...prevState.asignaturaToEdit,
                [name]: name.includes("id") ? (parseInt(value) || 0) : value
            }
        }));
    }

    handleUpdate(event) {
        event.preventDefault();
        
        const { id_profesor, nombre_asignatura, horario } = this.state.asignaturaToEdit;
        if (!id_profesor || !nombre_asignatura || !horario) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        putAsignatura(this.state.asignaturaToEdit)
            .then(() => {
                alert(`Asignatura actualizada con éxito!`);
                this.setState({ isEditing: false, asignaturaToEdit: null });
                this.fetchData();
            })
            .catch(error => {
                alert(`Error al actualizar: ${error.message}`);
            });
    }

    render() {
        const { asignaturas, isLoading, error, showInsertForm, newAsignatura, isEditing, asignaturaToEdit } = this.state;
        
        if (error) {
             return <div>Error al cargar los datos: {error}</div>;
        }

        if (isLoading) {
             return <div>Cargando listado de asignaturas...</div>;
        }

        return (
            <div> 
                <h2>Lista de Asignaturas</h2>
                
                <button 
                    onClick={this.handleToggleForm}
                    style={{ padding: '10px', margin: '10px', backgroundColor: showInsertForm ? '#ffc107' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    disabled={isEditing}
                >
                    {showInsertForm ? 'Cancelar' : 'Insertar Nueva Asignatura'}
                </button>

                {showInsertForm && (
                   <form onSubmit={this.handleInsert} style={{ border: '1px solid #ccc', padding: '20px', margin: '20px auto', width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <h3>Insertar Asignatura</h3>
                        
                         <input type="number" name="id_profesor" placeholder="ID Profesor" value={newAsignatura.id_profesor} onChange={this.handleInputChange} required style={{ margin: '5px 0', padding: '8px', width: '100%' }} />
                         <input type="text" name="nombre_asignatura" placeholder="Nombre Asignatura" value={newAsignatura.nombre_asignatura} onChange={this.handleInputChange} required style={{ margin: '5px 0', padding: '8px', width: '100%' }} />
                         <input type="text" name="horario" placeholder="Horario" value={newAsignatura.horario} onChange={this.handleInputChange} required style={{ margin: '5px 0', padding: '8px', width: '100%' }} />
                        
                         <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
                             Guardar Asignatura
                         </button>
                    </form>
                )}

                {isEditing && asignaturaToEdit && (
                    <form onSubmit={this.handleUpdate} style={{ border: '2px solid #ff9800', padding: '20px', margin: '20px auto', width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3>Editando ID: {asignaturaToEdit.id_asignatura}</h3>
                        
                        <input type="number" name="id_profesor" value={asignaturaToEdit.id_profesor} onChange={this.handleEditInputChange} required style={{ margin: '5px 0', padding: '8px', width: '100%' }} />
                        <input type="text" name="nombre_asignatura" value={asignaturaToEdit.nombre_asignatura} onChange={this.handleEditInputChange} required style={{ margin: '5px 0', padding: '8px', width: '100%' }} />
                        <input type="text" name="horario" value={asignaturaToEdit.horario} onChange={this.handleEditInputChange} required style={{ margin: '5px 0', padding: '8px', width: '100%' }} />
                        
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
                            Actualizar Asignatura
                        </button>
                        <button type="button" onClick={() => this.setState({ isEditing: false, asignaturaToEdit: null })} style={{ padding: '10px', backgroundColor: '#ccc', marginTop: '5px' }}>
                            Cancelar Edición
                        </button>
                    </form>
                )}
                
                {asignaturas.length === 0 ? (
                    <p>No se encontraron asignaturas en la base de datos.</p>
                ) : (
                    <table border="1" style={{ width: '80%', borderCollapse: 'collapse', margin: '20px auto' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
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
                                            onClick={() => this.handleDelete(asignatura.id_asignatura)}
                                            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
                                        >
                                            Borrar
                                        </button>
                                        
                                        <button 
                                            onClick={() => this.handleStartEdit(asignatura)}
                                            style={{ padding: '5px 10px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', marginLeft: '5px' }}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default Asignaturas;