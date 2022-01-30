/// <reference types="cypress" />




describe('profile', () => {

    it("update info", () => {

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
        cy.wait(2000)
        cy.get('.fa-pencil-square').click({ force: true })
        cy.wait(100)
        cy.get("#lastname").type("Mkrtchyan")
        cy.get("#lastname").should("value", "Mkrtchyan")

        cy.get("#age").type(25)
        cy.get("#age").should("value", 25)

        cy.get("#status").type("hello world")
        cy.get("#status").should("value", "hello world")

        cy.get("#countries").type("Armenya")
        cy.get("#countries").should("value", "Armenya")


        cy.get("#city").type("Gyumri")
        cy.get("#city").should("value", "Gyumri")

        cy.get("#scool").type("HAPH")
        cy.get("#scool").should("value", "HAPH")

        cy.get("#job").type("bacend developer")
        cy.get("#job").should("value", "bacend developer")


        cy.get("#phone").type('098867865')
        cy.get("#phone").should('value', '098867865')

        cy.get("#married").check()
        cy.get("#married").should("value", "married")

        cy.get(".ok_btn").click({ force: true })

        cy.wait(1000)
        cy.get("#citys-desc").should("have.text", "Gyumri")
        cy.get("#single-desc").should("have.text", "married")
        cy.get("#job-desc").should("have.text", "bacend developer")
        cy.get('.profileInfoName').should("have.text", "gug Mkrtchyan")
        cy.get('.profileInfoDesc').should("have.text", "hello world")

        cy.get(".info-title").click({ force: true })

        cy.get("#citys-info").should("have.text", "Gyumri")
        cy.get("#countries-info").should("have.text", "Armenya")
        cy.get("#scool-info").should("have.text", "HAPH")
        cy.get("#age-info").should("have.text", 25)
        cy.get("#phone-info").should("have.text", "98867865")
        cy.get("#job-info").should("have.text", "bacend developer")
        cy.get("#single-info").should("have.text", 'married')
        cy.wait(3000)

        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/profile/gug")
        })

    })
})
