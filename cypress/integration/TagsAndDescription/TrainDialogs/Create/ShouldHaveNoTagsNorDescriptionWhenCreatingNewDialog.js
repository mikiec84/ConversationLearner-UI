const models = require('../../../../support/Models')
const modelPage = require('../../../../support/components/ModelPage')
// const entities = require('../support/Entities')
// const actions = require('../support/Actions')
// const actionsGrid = require('../support/components/ActionsGrid')
// const editDialogModal = require('../support/components/EditDialogModal')
const train = require('../../../../support/Train')

export var testCompletedSuccessfully = false
describe(test.group, () => {
  it('Should Have No Tags Nor Description When Creating New Dialog', () => {
    models.CreateNewModel('z-disqualifyngEnt')
    modelPage.NavigateToTrainDialogs()
    train.CreateNewTrainDialog()
    cy.Enqueue(() => {testCompletedSuccessfully = true})
  })
})