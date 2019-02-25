global.Test = {}
Test.passed = true
Test.stage = undefined

Test.Feature = (feature, func) => {
  describe(feature, func)
}

Test.Area = (area, func) => {
  describe(area, func)
}

Test.Stage = (stage, func) => {
  it(stage, () => {
    if (!Test.passed) {
      // This will always fail, we use it to get an acceptable output to display.
      expect(`Previous test stage: '${Test.stage}'`).to.equal('Passed')
    } else {

    Test.passed = false
    Test.stage = stage
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