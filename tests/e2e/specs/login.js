// https://docs.cypress.io/api/introduction/api.html

describe('User Login', () => {
  it('Should Login', () => {
    cy.visit('/')
    cy.get('[data-cy="appEmail"]').type('admin@admin.com')
    cy.get('[data-cy="appPassword"]').type('admin')
    cy.get('[data-cy="appLogin"]').click()
    cy.screenshot()
  })
})
