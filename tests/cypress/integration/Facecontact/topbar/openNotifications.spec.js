/// <reference types="cypress" />


describe('topbar notification', () => {

    it("all notification watching", () => {


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

        cy.get("#friend-notification").click({ force: true })
        cy.wait(1000)
        cy.get(".button").invoke('show').click({ force: true })
        cy.wait(1000)
        cy.get("#message-notification").click({ force: true })
        cy.get("#msg-btn").click({ force: true })
        cy.wait(1000)
        cy.get("#all-notification").click({ force: true })
        cy.get("#all-notification-btn").invoke('show').click({ force: true })
        cy.get("#all-notification").click({ force: true })
        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/")
        })



    })
})