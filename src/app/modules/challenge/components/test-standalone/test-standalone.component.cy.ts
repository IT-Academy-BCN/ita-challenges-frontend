import { TestStandaloneComponent } from './test-standalone.component'

describe('TestStandaloneComponent', () => {
  it('should mount', () => {
    cy.mount(TestStandaloneComponent)
  })
})
