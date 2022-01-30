/// <reference types="cypress" />


describe('posts', () => {

    it("watching posts", () => {


        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.wait(8000)
        cy.get(".postImg").click({ multiple: true, force: true })
        cy.wait(3500)
        cy.get(".quit-modal-post").click({ force: true, multiple: true })

        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/")
        })


    })
})
