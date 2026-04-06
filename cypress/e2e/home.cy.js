/// <reference types="cypress" />

describe('Home', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/home', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'token-falso');
        win.localStorage.setItem('jwt', 'token-falso');
      },
    });
  });

  it('abre la ruta /home', () => {
    cy.url().should('include', '/home');
  });

  it('muestra enlaces y botón principales', () => {
    cy.contains('a', 'Listar Alumnos')
      .should('exist')
      .and('have.attr', 'href', '/personas');

    cy.contains('a', 'Listar Asignaturas')
      .should('exist')
      .and('have.attr', 'href', '/asignaturas');

    cy.contains('a', /Matr/i)
      .should('exist')
      .and('have.attr', 'href', '/matriculas');

    cy.contains('button', 'Cerrar sesión').should('exist');
  });

  it('navega a personas al pulsar "Listar Alumnos"', () => {
    cy.contains('a', 'Listar Alumnos').click();
    cy.url().should('include', '/personas');
  });

  it('navega a asignaturas al pulsar "Listar Asignaturas"', () => {
    cy.visit('http://localhost:3000/home', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'token-falso');
        win.localStorage.setItem('jwt', 'token-falso');
      },
    });

    cy.contains('a', 'Listar Asignaturas').click();
    cy.url().should('include', '/asignaturas');
  });

  it('navega a matrículas al pulsar "Listar Matrículas"', () => {
    cy.visit('http://localhost:3000/home', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'token-falso');
        win.localStorage.setItem('jwt', 'token-falso');
      },
    });

    cy.contains('a', /Matr/i).click();
    cy.url().should('include', '/matriculas');
  });

  it('redirect to login by pressing "Log out"', () => {
  cy.visit('http://localhost:3000/home', {
    onBeforeLoad(win) {
      win.localStorage.setItem('token', 'token-falso');
      win.localStorage.setItem('jwt', 'token-falso');
    },
  });

  cy.contains('button', 'Cerrar sesión')
    .should('be.visible')
    .as('btnLogout');

  cy.get('@btnLogout').click();

  cy.url().should('include', '/');
});
});