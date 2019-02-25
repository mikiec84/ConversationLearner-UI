const models = require('../support/Models')
const modelPage = require('../support/components/ModelPage')
// const entities = require('../support/Entities')
// const actions = require('../support/Actions')
// const actionsGrid = require('../support/components/ActionsGrid')
const editDialogModal = require('../support/components/EditDialogModal')
const train = require('../support/Train')

Test.Feature('Training Scenario and Tags', () => {
  Test.Area('Train Dialogs', () => {
    before(() => {
      // import the saved model for tags and description testing
      models.ImportModel('z-TagAndScenario', 'z-whatsYourName.cl')
    })

    beforeEach(() => {
      // open model for tags and description testing
    })

    Test.Area('Create', () => {
      Test.Stage('Should have no Scenario nor Tags when creating new dialog.', () => {
        modelPage.NavigateToTrainDialogs()
        //cy.WaitForTrainingStatusCompleted()
        train.CreateNewTrainDialog()
        
        editDialogModal.VerifyScenario('')
        editDialogModal.VerifyTags([])
      })

      Test.Stage('Should save the tags and description on the new dialog', () => {
        editDialogModal.TypeScenario('Test Scenario')
        editDialogModal.AddTag('TagX')

        // Must have done some training in order to save the dialog.
        train.TypeYourMessage('Hello')
        editDialogModal.ClickScoreActionsButton()
        train.SelectAction("What's your name?")

        train.Save()
      })
    })

    Test.Area('Edit', () => {
      Test.Stage('Should open with the tags and description', () => {
        train.EditTrainingNEW('TagX', 'Test Scenario')
        editDialogModal.VerifyScenario('Test Scenario')
        editDialogModal.VerifyTags(['TagX'])
      })

      Test.Stage('should discard the changes made to tags and description when abandoned', () => {
        editDialogModal.TypeScenario('Changed Test Scenario')
        editDialogModal.AddTag('TagY')
        train.AbandonDialog()

        train.EditTrainingNEW('TagX', 'Test Scenario')
        editDialogModal.VerifyScenario('Test Scenario')
        editDialogModal.VerifyTags(['TagX'])
      })

      Test.Stage('should save the edited tags and description', () => {
        editDialogModal.TypeScenario('Edited Test Scenario')
        editDialogModal.AddTag('TagY')
        train.Save()

        train.EditTrainingNEW('TagXTagY', 'Edited Test Scenario')
        editDialogModal.VerifyScenario('Edited Test Scenario')
        editDialogModal.VerifyTags(['TagX', 'TagY'])
      })

      Test.Stage('(advanced edit) should save the edited tags, description, and rounds', () => {
        // Open train dialog
        // Edit tags
        // Edit description
        // Modify dialog to add user input
        // Modify dialog to add bot response
        // Save
        // Reload
        // Re-open dialog
        // Verify edited tags, description, and rounds
        expect(true).to.equal(true)
      })
    })


    Test.Area('Continue', () => {
      Test.Stage('should preserve tags and description when continuing a dialog', () => {
        // Open train dialog
        // Edit the tags
        // Edit the description
        // Type into webchat to continue the dialog
        // Verify the edited tags and description are the same
        // Save the dialog
        // Verify the edited tags and description are in the list
        expect(true).to.equal(true)
      })
    })

    Test.Area('Branch', () => {
      Test.Stage('should preserve tags and description after branching', () => {
        // Open train dialog
        // Edit tags
        // Edit description
        // Click branch on one of the user inputs
        // Enter a new input
        // (Dialog is branched after input is entered)
        // Verify edited tags and description are preserved
        // Save dialog
        // Reload
        // Verify old dialog with original tags and description is still in the list
        // Verify new dialog with edited tags and description is now in the list
        expect(true).to.equal(true)
      })
    })
  })

  Test.Area('Log Dialogs', () => {
    before(() => {
      // import model for testing tags and description on log dialogs
    })

    Test.Stage('should not show tags or description fields on log dialogs', () => {
      // Open log dialog
      // Verify that the tags and description fields do not show up
      // Enter into webchat to continue the dialog
      // Verify that the tags and description fields still do not show up on new window
      expect(true).to.equal(true)
    })
  })
})