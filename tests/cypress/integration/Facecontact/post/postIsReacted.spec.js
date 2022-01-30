/// <reference types="cypress" />


describe('posts', () => {

    it("reacted", () => {

        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.wait(2000)
        cy.get('#like-heart').click({ force: true })

    })
})
