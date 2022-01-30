/// <reference types="cypress" />


describe('posts', () => {

    it("commented post", () => {

        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.wait(3000)
        cy.get("#comments_span").click({ force: true })
        cy.get("#comments_span").should("contain.text", "comments")
        cy.wait(3000)
        cy.get(".comment_textarea").focus().type("good post brother!")
        cy.get("#send-comment").click({ force: true })

    })
})
