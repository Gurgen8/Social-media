/// <reference types="cypress" />


describe('games', () => {

    it("milionare", () => {

        cy.visit("http://localhost:3000/login")
        cy.get("#email").type("gug@mail.ru");
        cy.get("#password").type(123456)
        cy.get('.loginButton').click()
        cy.wait(1000)
        cy.get("#games").click()
        cy.get("#millionares").click()


        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/game-millionair")
        })
        cy.get(".startInput").focus().type("gug").type("{enter}")


        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/game-millionair")
        })

    })
})