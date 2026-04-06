/// <reference types="cypress" />

describe('Matriculas', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8080/api/v3/matriculas', {
      statusCode: 200,
      body: [
        {
          id: {
            id_alumno: 1,
            id_asignatura: 101
          },
          nota: 7.5
        },
        {
          id: {
            id_alumno: 2,
            id_asignatura: 102
          },
          nota: 8.3
        }
      ]
    }).as('getMatriculas');

    cy.visit('http://localhost:3000', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'token-falso');
      }
    });

    cy.visit('http://localhost:3000/matriculas');
    cy.wait('@getMatriculas');
  });

  it('abre la ruta /matriculas', () => {
    cy.url().should('include', '/matriculas');
  });

  it('muestra el título de la página', () => {
    cy.contains('Lista de Matrículas').should('exist');
  });

  it('muestra la tabla de matrículas', () => {
    cy.get('table').should('exist');
    cy.contains('th', 'ID Alumno').should('exist');
    cy.contains('th', 'ID Asignatura').should('exist');
    cy.contains('th', 'Nota').should('exist');
    cy.contains('th', 'Acciones').should('exist');
  });

  it('muestra datos cargados en la tabla', () => {
    cy.contains('td', '1').should('exist');
    cy.contains('td', '101').should('exist');
    cy.contains('td', '7.5').should('exist');
    cy.contains('td', '2').should('exist');
    cy.contains('td', '102').should('exist');
    cy.contains('td', '8.3').should('exist');
  });

  it('muestra el botón de insertar nueva matrícula', () => {
    cy.contains('button', 'Insertar Nueva Matrícula').should('exist');
  });

  it('abre el formulario de inserción al pulsar el botón', () => {
    cy.contains('button', 'Insertar Nueva Matrícula').click();
    cy.get('input[name="id_alumno"]').should('exist');
    cy.get('input[name="id_asignatura"]').should('exist');
    cy.get('input[name="nota"]').should('exist');
    cy.contains('button', 'Guardar').should('exist');
  });

  it('permite escribir en el formulario de inserción', () => {
    cy.contains('button', 'Insertar Nueva Matrícula').click();
    cy.get('input[name="id_alumno"]').clear().type('3');
    cy.get('input[name="id_asignatura"]').clear().type('103');
    cy.get('input[name="nota"]').clear().type('9.5');
    cy.get('input[name="id_alumno"]').invoke('val').should('match', /3/);
    cy.get('input[name="id_asignatura"]').invoke('val').should('match', /103/);
    cy.get('input[name="nota"]').invoke('val').should('match', /9\.5|95|9/);
  });

  it('permite cancelar el formulario de inserción', () => {
    cy.contains('button', 'Insertar Nueva Matrícula').click();
    cy.contains('button', 'Cancelar').click();
    cy.get('input[name="id_alumno"]').should('not.exist');
  });

  it('muestra botones de acción en la tabla', () => {
    cy.contains('button', 'Borrar').should('exist');
    cy.contains('button', 'Editar').should('exist');
  });

  it('abre el formulario de edición al pulsar editar', () => {
    cy.contains('button', 'Editar').first().click();
    cy.contains('button', 'Actualizar').should('exist');
    cy.contains('button', 'Cancelar').should('exist');
    cy.get('input[type="number"]').should('exist');
  });

  it('carga la nota en el formulario de edición', () => {
    cy.contains('button', 'Editar').first().click();
    cy.get('input[type="number"]').should('have.value', '7.5');
  });

  it('permite modificar la nota en el formulario de edición', () => {
    cy.contains('button', 'Editar').first().click();
    cy.get('input[type="number"]').clear().type('9.2');
    cy.get('input[type="number"]').invoke('val').should('match', /9\.2|92|9/);
  });

  it('permite cancelar la edición', () => {
    cy.contains('button', 'Editar').first().click();
    cy.contains('button', 'Cancelar').click();
    cy.contains('button', 'Actualizar').should('not.exist');
  });

  it('pide confirmación al borrar una matrícula', () => {
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(false).as('confirmarBorrado');
    });
    cy.contains('button', 'Borrar').first().click();
    cy.get('@confirmarBorrado').should('have.been.called');
  });

  it('vuelve al login al pulsar logout', () => {
    cy.contains('button', 'Logout')
      .should('be.visible')
      .click({ force: true });
    cy.url().should('include', '/');
  });
});