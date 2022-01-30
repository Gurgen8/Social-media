/// <reference types="cypress" />


describe('sidebar', () => {

  it("movies", () => {

    cy.visit("http://localhost:3000/login")
    cy.get("#email").type("gug@mail.ru");
    cy.get("#password").type(123456)
    cy.get('.loginButton').click()
    cy.wait(1000)
    cy.get("#movies").click()

    cy.get(".search").focus().type("interstellar").type("{enter}")

    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        "http://localhost:3000/movies")
    })


  })
})