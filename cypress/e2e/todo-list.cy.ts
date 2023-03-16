describe('Testes para Todo List', () => {

  it('should create a Todo List without persisting on database', () => {

    cy.intercept('POST', '/api/lists', {
      statusCode: 201,
      body: {
        id: "1678998407629",
        items: [],
        name: "Teste"
      }
    }).as('createMock')

    cy.visit('/')

    cy.get('.Home_cardInput__k1Azr').type('Teste')

    cy.get('.Home_cardInput__k1Azr').should('have.value', 'Teste')

    cy.get('.Home_cardInput__k1Azr').type('{enter}')

    cy.wait('@createMock')

    cy.url().should('include', '/list/1678998407629')

    cy.get('body').should('contain', '404')

    cy.go('back')

  })

  it('should create a Todo List, persist on database and delete it', () => {

    cy.intercept('POST', '/api/lists').as('createMock')

    cy.visit('/')

    cy.get('.Home_cardInput__k1Azr').type('Teste')

    cy.get('.Home_cardInput__k1Azr').should('have.value', 'Teste')

    cy.get('.Home_cardInput__k1Azr').type('{enter}')

    cy.wait('@createMock')

    cy.url().should('include', `/list`)

    cy.go('back')

    cy.get('.Todo_text__vi7kw').should('contain', 'Teste')

    cy.get('.Todo_iconRemove____WM8').click()
  })
})
