/// <reference types="cypress" />

describe('stori', () => {

    it(" all storis  watching", () => {


        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.wait(3000)
        cy.get(".topbarImg").click({ force: true, multiple: true })
        cy.wait(2000)
        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/profile/gug")
        })
        cy.wait(4000)
        cy.get('.fa-tablet').click({ force: true })
        cy.wait(2000)
        cy.get('.fa-slideshare').click({ force: true })


        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/profile/gug")
        })


    })
})