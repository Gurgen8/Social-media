/// <reference types="cypress" />


describe('posts', () => {

    it("likelist-comentlist-heartelist open ", () => {

        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.wait(3000)
        cy.get("#likelist-span").click({ force: true })
        cy.wait(5000)
        cy.get("#likelist-span").click({ force: true })
        cy.get("#hearelist-span").click({ force: true })
        cy.wait(5000)
        cy.get("#hearelist-span").click({ force: true })
        cy.get("#comments_span").click({ force: true })


    })
})
