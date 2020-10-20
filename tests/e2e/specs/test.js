describe('App', () => {
  it('App frame exists', () => {
    cy.visit('/')
    cy.get('[data-ta="app-main"]').should('exist')
  })
})
