global.Test = {}
Test.passed = true

Test.Feature = (feature, func) => {
  describe(feature, func)
}

Test.Area = (area, func) => {
  describe(area, func)
}

Test.Stage = (stage, func) => {
  it(stage, () => {
    //expect(Test.passed).to.equal(true)
    if (Test.passed) {
      Test.passed = false
      func()
      cy.Enqueue(() => Test.passed = true)
    }
  })
}

Test.Case = (name, func) => {
  it(name, func)
}

Test.Steps = (func, description) => {
  func()
  cy.log('-----------------------------------------------------------')
  cy.log(description)
  cy.log('-----------------------------------------------------------')
}