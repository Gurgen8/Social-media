/// <reference types="cypress" />


describe('posts', () => {

    it("create posts", () => {

        const postChange = {
            desc: "my new updating post"
        }
        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.request("PUT", "http://localhost:3000/api/post/61dc0f163216083f36907f48", postChange)
    })
})
