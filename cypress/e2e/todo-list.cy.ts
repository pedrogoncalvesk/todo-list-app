describe('Todo List APP Tests', () => {
  const baseUrl = Cypress.config().baseUrl
  const createMockId = 'createTodoList'
  const deleteMockId = 'deleteTodoList'

  it('should create a Todo List without persisting on database', () => {
    const todoListId = new Date().getTime().toString()
    const todoListName = 'New TODO List - Scenario 1'

    // first, must visit home page
    cy.visit('/')

    // typing new Todo List
    cy.get('.Home_cardInput__k1Azr').type(todoListName)
    cy.get('.Home_cardInput__k1Azr').should('have.value', todoListName)

    // preventing API call
    cy.intercept('POST', `${baseUrl}/api/lists`, {
      statusCode: 201,
      body: {
        id: todoListId,
        items: [],
        name: todoListName
      }
    }).as(createMockId)

    // create action will be call
    cy.get('.Home_cardInput__k1Azr').type('{enter}')
    cy.wait(`@${createMockId}`)
    cy.get('.Todo_text__vi7kw').should('contain', todoListName)

    // already in another page
    cy.url().should('include', `${baseUrl}/list/${todoListId}`)
    cy.get('body').should('contain', 404) // not found page because the list wasn't persisted in DB
  })

  it('should create a Todo List, persist on database and delete it', () => {
    const todoListName = 'New TODO List - Scenario 2'

    cy.visit('/')

    cy.get('.Home_cardInput__k1Azr').type(todoListName)
    cy.get('.Home_cardInput__k1Azr').should('have.value', todoListName)

    cy.intercept('POST', `${baseUrl}/api/lists`).as(createMockId)

    cy.get('.Home_cardInput__k1Azr').type('{enter}')

    cy.wait(`@${createMockId}`)
      .its('request.body')
      .should('deep.equal', { name: todoListName })

    cy.get(`@${createMockId}`)
      .its('response.statusCode')
      .should('equal', 201)

    cy.url().should('include', `${baseUrl}/list`)

    cy.get('.Home_title__FX7xZ').should('contain', todoListName)

    cy.location('href').then(url => {
      cy.get('.Home_subTitle__RHTt0').should('contain', url)
    })

    cy.location('pathname').then(path => {
      const todoListId = path.split('/list/')[1]

      cy.go('back')

      cy.intercept('DELETE', `${baseUrl}/api/lists/${todoListId}`).as(deleteMockId)

      cy.get('.Todo_card__JIMrU')
        .should('contain', todoListName)
        .and('have.length', 1)
        .children('.Todo_iconRemove____WM8')
        .should('be.visible')
        .click()

      cy.wait(`@${deleteMockId}`)
        .its('response.statusCode')
        .should('equal', 200)
    })
  })
})
