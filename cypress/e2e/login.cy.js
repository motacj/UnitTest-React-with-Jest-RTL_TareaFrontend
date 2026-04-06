/// <reference types="cypress" />

describe('Login', () => {
  it('abre la aplicación', () => {
    cy.visit('http://localhost:3000');
    cy.url().should('include', '/');
  });

  it('muestra el formulario de login', () => {
    cy.visit('http://localhost:3000');

    cy.get('#form2Example11').should('exist');
    cy.get('#form2Example22').should('exist');
    cy.contains('button', 'Login').should('exist');
    cy.contains('Inicio de la Sesión').should('exist');
  });

  it('permite escribir usuario y contraseña', () => {
    cy.visit('http://localhost:3000');

    cy.get('#form2Example11').type('admin');
    cy.get('#form2Example22').type('1234');

    cy.get('#form2Example11').should('have.value', 'admin');
    cy.get('#form2Example22').should('have.value', '1234');
  });

  it('muestra un alert si el login falla', () => {
    cy.visit('http://localhost:3000');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alerta');
    });

    cy.get('#form2Example11').type('usuariofalso');
    cy.get('#form2Example22').type('clavefalsa');
    cy.contains('button', 'Login').click();

    cy.get('@alerta').should('have.been.calledWith', 'Usuario o contraseña incorrectos');
  });
});