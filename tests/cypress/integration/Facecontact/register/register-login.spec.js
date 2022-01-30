/// <reference types="cypress" />


describe('user registration and login', () => {
    const password = 123456
    const email = "mkrtgfawwwfaaf@mail.ru"


    it("register and login", () => {


        cy.pause()

        cy.visit("http://localhost:3000/register");
        cy.get("#name").type("Gurgenw19w");
        cy.get("#name").should("value", "Gurgenw19w");
        cy.get("#lastname").type("Mkrtchyan");
        cy.get("#lastname").should("value", "Mkrtchyan");

        cy.get("#email").type(email);
        cy.get("#email").should("value", email);

        cy.get("#from").type("Armenya");
        cy.get("#from").should("value", "Armenya");

        cy.get("#city").type("Gyumri");
        cy.get("#city").should("value", "Gyumri");

        cy.get("#age").type("25");
        cy.get("#age").should("value", "25");

        cy.get("#job").type("Economist");
        cy.get("#job").should("value", "Economist")

        cy.get("#scool").type("HAPH");
        cy.get("#scool").should("value", "HAPH");

        cy.get("#phone").type("098867865")
        cy.get("#phone").should("value", "098867865")

        //cy.get("#birthday").type("12121985").should("have.value", "1985-11-15")
        cy.get("#man").check("man")
        cy.get("#man").should("value", "man")

        cy.get("#password").type(password)
        cy.get("#password").should("value", password)

        cy.get("#againpassword").type(password)
        cy.get("#againpassword").should("value", password)

        cy.get('.loginButton').click()
        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/login")
        })


        cy.get("#email").type(email);
        cy.get("#email").should("value", email);


        cy.get("#password").type(password)
        cy.get("#password").should("value", password)

        cy.get('.loginButton').click()
        cy.location().should((loc) => {
            expect(loc.host).to.eq('localhost:3000')
            expect(loc.hostname).to.eq('localhost')
            expect(loc.href).to.eq(
                "http://localhost:3000/")
        })

    })

})