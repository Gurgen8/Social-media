/// <reference types="cypress" />


describe('sidebar', () => {

  it("books libraies  groups", () => {

    cy.visit("http://localhost:3000/login")
    cy.get("#email").type("gug@mail.ru");
    cy.get("#password").type(123456)
    cy.get('.loginButton').click()
    cy.wait(1000)
    cy.get("#books").click()
    cy.wait(1000)
    cy.get("#books").click()

    cy.get("#courses").click()
    cy.wait(1000)
    cy.get("#courses").click()
    cy.get("#groups").click()


    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        "http://localhost:3000/allusers")
    })


  })
})