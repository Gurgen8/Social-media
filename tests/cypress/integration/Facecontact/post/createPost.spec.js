/// <reference types="cypress" />


describe('posts', () => {

  it("create posts", () => {

    cy.visit("http://localhost:3000/login")
    cy.get("#email").type("gug@mail.ru");
    cy.get("#password").type(123456)
    cy.get('.loginButton').click()
    cy.wait(5000)
    cy.get("#share-textarea").focus().type("hello my friends (tests)")
    cy.get("#location-share").click({ force: true }).wait(2000)
    cy.get(".shareCancelbtn").click({ force: true })
    cy.get("#share-button").click({ force: true })

    //cy.request("POST","http://localhost:3000/api/post",newPost)
  })
})