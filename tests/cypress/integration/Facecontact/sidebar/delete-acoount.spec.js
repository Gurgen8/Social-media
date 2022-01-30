/// <reference types="cypress" />


describe('sidebar', () => {

  it("delete account", () => {

    cy.visit("http://localhost:3000/login")
    cy.get("#email").type("martiros@mail.ru");
    cy.get("#password").type(123456)
    cy.get('.loginButton').click()
    cy.wait(3000)
    cy.get("#setting").click()
    cy.get("#delete-account").click({ force: true })
    cy.wait(2000)
    cy.get("#yes-del").click()


    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        "http://localhost:3000/")
    })


  })
})


