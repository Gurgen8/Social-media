/// <reference types="cypress" />


describe('stori', () => {

    it("storis watching", () => {


        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/")
        })

        cy.wait(5000)
        cy.get('.home-storis-img').click({ multipe: true, force: true })

        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/")
        })



    })
})