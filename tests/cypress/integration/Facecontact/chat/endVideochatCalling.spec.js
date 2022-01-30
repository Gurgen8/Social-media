/// <reference types="cypress" />


describe('messanger', () => {

  it("videochat end", () => {

    cy.visit("http://localhost:3000/login")
    cy.get("#email").type("gug@mail.ru");
    cy.get("#password").type(123456)
    cy.get('.loginButton').click()
    cy.wait(3000)
    cy.get("#chat").click()
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
    cy.wait(3000)
    cy.get("#convert").dblclick({ force: true })
    cy.wait(1500)
    cy.get(".callicon").click({ force: true })
    cy.wait(2000)
    cy.get('.fa-video-camera').click({ force: true })
    cy.wait(5000)
    cy.get(".callicon").click({ force: true })
    cy.wait(4000)
    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        "http://localhost:3000/messenger")
    })

  })
})
