/// <reference types="cypress" />


describe('posts', () => {

    it(" remove comment  post", () => {

        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.wait(3000)
        cy.get("#comments_span").click({ force: true })
        cy.wait(2000)
        cy.get('#remove-comment').trigger('mouseenter').click({ force: true })

    })
})
