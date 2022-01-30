/// <reference types="cypress" />


describe('rightbar', () => {

  it("paymant system", () => {

    cy.visit("http://localhost:3000/login")
    cy.get("#email").type("gug@mail.ru");
    cy.get("#password").type(123456)
    cy.get('.loginButton').click()
    cy.wait(3000)
    cy.get("#travel-banner").click({ force: true })


    cy.get("#name").focus().type("Gurgen")
    cy.get("#email").focus().type("gug8@mail.ru")
    cy.get("#phone").focus().type("098867865")
    cy.get(".__PrivateStripeElement-input").focus().type("888888888888")
    cy.get(".SubmitButton").click({ force: true })

    cy.location().should((loc) => {
      expect(loc.host).to.eq('localhost:3000')
      expect(loc.hostname).to.eq('localhost')
      expect(loc.href).to.eq(
        "http://localhost:3000/paymantsystem-travel")
    })


  })
})