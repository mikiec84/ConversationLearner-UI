const models = require('../../../../support/Models')
const modelPage = require('../../../../support/components/ModelPage')
// const entities = require('../support/Entities')
// const actions = require('../support/Actions')
// const actionsGrid = require('../support/components/ActionsGrid')
// const editDialogModal = require('../support/components/EditDialogModal')
const train = require('../../../../support/Train')

export var testCompletedSuccessfully = false
describe('Create', () => {
  it('Should Save The Tags And Description On The New Dialog', () => {
    train.TypeYourMessage('Hi')
    train.AbandonDialog()
    cy.Enqueue(() => {testCompletedSuccessfully = true})
  })
})

describe('GroupX', () => {
  it('Extra test case to show how it looks', () => {
    cy.log('Always Passes')
    expect(true).to.equal(true)
  })
})
