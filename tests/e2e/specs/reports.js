describe('Responsive Test', () => {
  it('Should Resize the screen', () => {
    cy.visit('/')
    cy.get('[name="email"]').type('admin@admin.com')
    cy.get('[name="password"]').type('admin')
    cy.get('#login').click()
    cy.wait(500).visit('/plan/reports/')

    var genArr = Array.from({ length: 5 }, (v, k) => k + 1)
    cy.wrap(genArr).each(() => {
      cy.wait(500).viewport(1024, 768)
      cy.wait(500).viewport('iphone-6')
      cy.wait(500).viewport(1920, 1024)
      cy.wait(500).viewport('iphone-5')
    })
  })
})
