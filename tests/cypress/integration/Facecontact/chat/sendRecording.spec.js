/// <reference types="cypress" />




describe('messanger', () => {

  it("create and send videorecording", () => {

    cy.visit("http://localhost:3000/login")
    cy.get("#email").type("gug@mail.ru");
    cy.get("#password").type(123456)
    cy.get('.loginButton').click()
    cy.wait(3000)
    cy.get("#chat").click({ force: true })
    cy.wait(6000)
    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        "http://localhost:3000/messenger")
    })
    Cypress.on('uncaught:exception', (err, runnable) => {

      return false

    })
    cy.get("#convert").dblclick({ force: true })
    cy.wait(1000)
    cy.get("#video-recording").click({ force: true })
    cy.get('.start').click({ forrce: true })
    cy.wait(5000)
    cy.get(".stop").click({ force: true })
    cy.get(".close").click({ force: true })
    cy.get('.chatSubmitButton').click({ force: true })
    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        "http://localhost:3000/messenger")
    })



  })
})
