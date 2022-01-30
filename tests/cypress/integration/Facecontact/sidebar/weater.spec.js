/// <reference types="cypress" />


describe('sidebar', () => {

  it("weather", () => {

    cy.visit("http://localhost:3000/login")
    cy.get("#email").type("gug@mail.ru");
    cy.get("#password").type(123456)
    cy.get('.loginButton').click()
    cy.wait(4000)
    cy.get("#weather").click()
    Cypress.on('uncaught:exception', (err, runnable) => {

      return false

    })


    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        "http://localhost:3000/weather")
    })

    cy.wait(3000)
    cy.get(".search").type("gyumri").type("{enter}")
    cy.wait(3000)

    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        "http://localhost:3000/weather")
    })

  })
})