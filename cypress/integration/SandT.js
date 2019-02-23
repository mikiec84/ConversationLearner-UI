const models = require('../support/Models')
const modelPage = require('../support/components/ModelPage')
const editDialogModal = require('../support/components/EditDialogModal')
const train = require('../support/Train')

Test.Feature('Scenario and Tags', () => {
  Test.Case('Training', () => {
    Test.Steps(() => {
      models.ImportModel('z-TagAndScenario', 'z-whatsYourName.cl')
      modelPage.NavigateToTrainDialogs()
      //cy.WaitForTrainingStatusCompleted()
    }, `Setup - Model has been created`)

    Test.Steps(() => {
      train.CreateNewTrainDialog()
      editDialogModal.VerifyScenario('')
      editDialogModal.VerifyTags([])
    }, 'New Train Dialog Created - Verified Scenario and Tags are empty.')

    Test.Steps(() => {
      editDialogModal.TypeScenario('Test Scenario')
      editDialogModal.AddTag('TagX')

      // Must have done some training in order to save the dialog.
      train.TypeYourMessage('Hello')
      editDialogModal.ClickScoreActionsButton()
      train.SelectAction("What's your name?")

      train.Save()
    }, 'Added Scenario and Tag, Saved the Train Dialog')

    Test.Steps(() => {
      train.EditTrainingNEW('TagX', 'Test Scenario')
      editDialogModal.VerifyScenario('Test Scenario')
      editDialogModal.VerifyTags(['TagX'])
    }, 'Verified Scenario and Tag in Grid by Editing Train Dialog, Verified Scenario and Tag Retained.')

    Test.Steps(() => {
      editDialogModal.TypeScenario('Changed Test Scenario')
      editDialogModal.AddTag('TagY')
      train.AbandonDialog()

      train.EditTrainingNEW('TagX', 'Test Scenario')
      editDialogModal.VerifyScenario('Test Scenario')
      editDialogModal.VerifyTags(['TagX'])
    }, 'Changed Scenario, Added Another Tag, Abandonded Changes, Re-edited to Verify All')

    Test.Steps(() => {
      editDialogModal.TypeScenario('Edited Test Scenario')
      editDialogModal.AddTag('TagZ')
      train.Save()

      train.EditTrainingNEW('TagXTagY', 'Edited Test Scenario')
      editDialogModal.VerifyScenario('Edited Test Scenario')
      editDialogModal.VerifyTags(['TagX', 'TagZ'])
    }, 'Changed Scenario, Added A Different Tag, Saved Changes, Edited to Verify')
  })
})