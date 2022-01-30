/// <reference types="cypress" />


describe('games', () => {

  it("rock-papaer-scissors", () => {

    cy.visit("http://localhost:3000/login")
    cy.get("#email").type("gug@mail.ru");
    cy.get("#password").type(123456)
    cy.get('.loginButton').click()
    cy.wait(1000)
    cy.get("#games").click()
    cy.get("#rock-papaers-scissors").click()


    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        "http://localhost:3000/game-rock-paper-scissors")
    })


  })
})