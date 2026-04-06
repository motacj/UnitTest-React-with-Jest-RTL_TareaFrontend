/// <reference types="cypress" />

describe('Personas', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8080/api/v1/personas', {
      statusCode: 200,
      body: [
        {
          id_persona: 1,
          nombre: 'Juan',
          apellidos: 'Pérez',
          edad: 25,
        },
        {
          id_persona: 2,
          nombre: 'Ana',
          apellidos: 'García',
          edad: 30,
        },
      ],
    }).as('getPersonas');

    cy.visit('http://localhost:3000/personas', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'token-falso');
      },
    });

    cy.wait('@getPersonas');
  });

  it('abre la ruta /personas', () => {
    cy.url().should('include', '/personas');
  });

  it('muestra el título de la página', () => {
    cy.contains('Lista de Alumnos').should('exist');
  });

  it('muestra la tabla de personas', () => {
    cy.get('table').should('exist');
    cy.contains('th', 'ID').should('exist');
    cy.contains('th', 'Nombre').should('exist');
    cy.contains('th', 'Apellidos').should('exist');
    cy.contains('th', 'Edad').should('exist');
    cy.contains('th', 'Acciones').should('exist');
  });

  it('muestra datos cargados en la tabla', () => {
    cy.contains('td', 'Juan').should('exist');
    cy.contains('td', 'Pérez').should('exist');
    cy.contains('td', '25').should('exist');
  });

  it('muestra el botón de insertar nuevo alumno', () => {
    cy.contains('button', 'Insertar Nuevo Alumno').should('exist');
  });

  it('abre el formulario de inserción al pulsar el botón', () => {
    cy.contains('button', 'Insertar Nuevo Alumno').click();

    cy.get('input[name="nombre"]').should('exist');
    cy.get('input[name="apellidos"]').should('exist');
    cy.get('input[name="edad"]').should('exist');
    cy.contains('button', 'Guardar').should('exist');
  });

  it('permite escribir en el formulario de inserción', () => {
    cy.contains('button', 'Insertar Nuevo Alumno').click();

    cy.get('input[name="nombre"]').type('Juan');
    cy.get('input[name="apellidos"]').type('Pérez');
    cy.get('input[name="edad"]').type('25');

    cy.get('input[name="nombre"]').should('have.value', 'Juan');
    cy.get('input[name="apellidos"]').should('have.value', 'Pérez');
    cy.get('input[name="edad"]').should('have.value', '25');
  });

  it('permite cancelar el formulario de inserción', () => {
    cy.contains('button', 'Insertar Nuevo Alumno').click();
    cy.contains('button', 'Cancelar').click();
    cy.get('input[name="nombre"]').should('not.exist');
  });

  it('muestra botones de acción en la tabla', () => {
    cy.contains('button', 'Borrar').should('exist');
    cy.contains('button', 'Editar').should('exist');
  });

  it('vuelve al login al pulsar logout', () => {
    cy.contains('button', 'Logearse').click({ force: true });
    cy.url().should('include', '/');
  });
  it('shows insert new learner button', () => {
  cy.contains('button', 'Insertar Nuevo Alumno').should('exist');
});

it('abre el formulario de inserción al pulsar el botón', () => {
  cy.contains('button', 'Insertar Nuevo Alumno').click();

  cy.get('input[name="nombre"]').should('exist');
  cy.get('input[name="apellidos"]').should('exist');
  cy.get('input[name="edad"]').should('exist');
  cy.contains('button', 'Guardar').should('exist');
});

it('permite escribir en el formulario de inserción', () => {
  cy.contains('button', 'Insertar Nuevo Alumno').click();

  cy.get('input[name="nombre"]').type('Juan');
  cy.get('input[name="apellidos"]').type('Pérez');
  cy.get('input[name="edad"]').type('25');

  cy.get('input[name="nombre"]').should('have.value', 'Juan');
  cy.get('input[name="apellidos"]').should('have.value', 'Pérez');
  cy.get('input[name="edad"]').should('have.value', '25');
});

it('permite cancelar el formulario de inserción', () => {
  cy.contains('button', 'Insertar Nuevo Alumno').click();
  cy.contains('button', 'Cancelar').click();
  cy.get('input[name="nombre"]').should('not.exist');
});
});