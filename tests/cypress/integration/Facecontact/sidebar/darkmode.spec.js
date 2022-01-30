/// <reference types="cypress" />


describe('sidebar', () => {

    it("darkmode lightmode", () => {

        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.wait(3000)
        cy.get("#setting").click()
        cy.get(".fa-toggle-off").click({ force: true })

        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/")
        })
        cy.wait(4000)
        cy.get("#setting").click()
        cy.get(".fa-toggle-on").click({ force: true })

        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/")
        })


    })
})


