/// <reference types="cypress" />


describe('posts', () => {

    it("delete posts", () => {

        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.wait(4500);
        cy.get("#bars").click({ multiple: true, force: true })
        cy.get(".delete_post").click({ force: true })
        // cy.request("DELETE","http://localhost:3000/api/post/61d724aa2fc3b66f6701d64e")
    })
})

