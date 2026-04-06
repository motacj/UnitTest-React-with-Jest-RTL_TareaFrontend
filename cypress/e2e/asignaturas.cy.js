/// <reference types="cypress" />

describe("Asignaturas", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:8080/api/v2/asignaturas", {
      statusCode: 200,
      body: [
        {
          id_profesor: 1,
          id_asignatura: 101,
          nombre_asignatura: "Matemáticas",
          horario: "Mañana",
        },
        {
          id_profesor: 2,
          id_asignatura: 102,
          nombre_asignatura: "Lengua",
          horario: "Tarde",
        },
      ],
    }).as("getAsignaturas");

    cy.visit("http://localhost:3000", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", "token-falso");
      },
    });

    cy.visit("http://localhost:3000/asignaturas");
    cy.wait("@getAsignaturas");
  });

  it("abre la ruta /asignaturas", () => {
    cy.url().should("include", "/asignaturas");
  });

  it("muestra el título de la página", () => {
    cy.contains("Lista de Asignaturas").should("exist");
  });

  it("muestra la tabla de asignaturas", () => {
    cy.get("table").should("exist");
    cy.contains("th", "ID Profesor").should("exist");
    cy.contains("th", "ID Asignatura").should("exist");
    cy.contains("th", "Nombre").should("exist");
    cy.contains("th", "Horario").should("exist");
    cy.contains("th", "Acciones").should("exist");
  });

  it("muestra datos cargados en la tabla", () => {
    cy.contains("td", "1").should("exist");
    cy.contains("td", "101").should("exist");
    cy.contains("td", "Matemáticas").should("exist");
    cy.contains("td", "Mañana").should("exist");
    cy.contains("td", "2").should("exist");
    cy.contains("td", "102").should("exist");
    cy.contains("td", "Lengua").should("exist");
    cy.contains("td", "Tarde").should("exist");
  });

  it("muestra el botón de insertar nueva asignatura", () => {
    cy.contains("button", "Insertar Nueva Asignatura").should("exist");
  });

  it("abrir el formulario de inserción al pulsar el botón", () => {
    cy.contains("button", "Insertar Nueva Asignatura").click();
    cy.get('input[name="id_profesor"]').should("exist");
    cy.get('input[name="nombre_asignatura"]').should("exist");
    cy.contains("button", "Guardar").should("exist");
  });

  it("permite escribir en el formulario de inserción", () => {
    cy.contains("button", "Insertar Nueva Asignatura").click();
    cy.get('input[name="id_profesor"]').clear().type("3");
    cy.get('input[name="nombre_asignatura"]').clear().type("Historia");
    cy.get('input[name="nombre_asignatura"]').should("have.value", "Historia");
  });

  it("permite cancelar el formulario de inserción", () => {
    cy.contains("button", "Insertar Nueva Asignatura").click();
    cy.contains("button", "Cancelar").click();
    cy.get('input[name="id_profesor"]').should("not.exist");
  });

  it("muestra botones de acción en la tabla", () => {
    cy.contains("button", "Borrar").should("exist");
    cy.contains("button", "Editar").should("exist");
  });

  it("abre el formulario de edición al pulsar editar", () => {
    cy.contains("button", "Edit").first().click();
    cy.get('input[name="id_profesor"]').should("exist");
    cy.get('input[name="nombre_asignatura"]').should("exist");
    cy.contains("button", "Actualizar").should("exist");
  });

  it("carga los datos en el formulario de edición", () => {
    cy.contains("button", "Edit").first().click();
    cy.get('input[name="id_profesor"]').should("have.value", "1");
    cy.get('input[name="nombre_asignatura"]').should(
      "have.value",
      "Matemáticas",
    );
  });

  it("permite modificar los datos en el formulario de edición", () => {
    cy.contains("button", "Editar").first().click();
    cy.get('input[name="nombre_asignatura"]').clear().type("Física");
    cy.get('select[name="horario"]').select("Tarde");
    cy.get('input[name="nombre_asignatura"]').should("have.value", "Física");
    cy.get('select[name="horario"]').should("have.value", "Tarde");
  });

  it("permite cancelar la edición", () => {
    cy.contains("button", "Editar").first().click();
    cy.contains("button", "Cancelar").click();
    cy.contains("button", "Actualizar").should("not.exist");
  });

  it("pide confirmación al borrar una asignatura", () => {
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(false).as("confirmarBorrado");
    });
    cy.contains("button", "Borrar").first().click();
    cy.get("@confirmarBorrado").should("have.been.called");
  });

  it("vuelve al login al pulsar logout", () => {
    cy.contains("button", /log/i).should("be.visible").click({ force: true });
    cy.url().should("include", "/");
  });
});
