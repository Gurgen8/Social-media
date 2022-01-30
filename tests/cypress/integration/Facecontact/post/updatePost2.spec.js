/// <reference types="cypress" />


describe('posts', () => {

    it("update posts", () => {

        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.wait(4000)
        cy.get("#bars").click({ multiple: true, force: true })
        cy.get('#update-post-input').focus().type("post changing !!!").type("{enter}")

    })
})
