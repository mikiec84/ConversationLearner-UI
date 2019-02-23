global.Test = {}

Test.Feature = (label, func) => {
  describe(label, func)
}

Test.Area = (label, func) => {
  describe(label, func)
}

Test.Stage = (label, func) => {
  it(label, () => {
    expect(Test.passed).to.equal(true)
    func()
    Test.passed = true
  })
}

beforeEach(() => {
  Test.passed = false
})