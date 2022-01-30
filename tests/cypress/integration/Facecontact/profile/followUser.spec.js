/// <reference types="cypress" />


describe('profile', () => {

    it("follow-unfollow user", () => {


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
        cy.wait(2000)
        cy.get("#search").type("poxos")
        cy.wait(5000)
        cy.get("#search").type("{enter}");
        cy.wait(2000)
        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                'http://localhost:3000/allusers?search=poxos')
        })

        cy.wait(3000)
        cy.get(".user-div").click({ force: true, multiple: true })
        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                'http://localhost:3000/profile/poxos')
        })

        cy.wait(4500)
        cy.get("#follow").click({ force: true })
        cy.wait(1000)
        cy.get('#allfriends-icon').click({ force: true })

        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                'http://localhost:3000/profile/poxos')
        })
    })
})