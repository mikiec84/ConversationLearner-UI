/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

import * as homePage from './HomePage'
import * as helpers from '../Helpers'

export const AllChatMessagesSelector = 'div[data-testid="web-chat-utterances"] > div.wc-message-content > div > div.format-markdown > p'

export function TypeYourMessage(trainMessage: string)         { cy.get('input.wc-shellinput').type(`${trainMessage}{enter}`) }  // data-testid NOT possible
export function TypeAlternativeInput(trainMessage: string)    { cy.get('[data-testid="entity-extractor-alternative-input-text"]').type(`${trainMessage}{enter}`) }
export function ClickSetInitialStateButton()          { cy.get('[data-testid="teach-session-set-initial-state"]').click() }
export function ClickScoreActionsButton()             { cy.get('[data-testid="score-actions-button"]').click() }
export function VerifyEntityMemoryIsEmpty()           { cy.get('[data-testid="memory-table-empty"]').contains('Empty') }
export function EntitySearch()                        { cy.get('[data-testid="entity-picker-entity-search"]') }
export function ClickAddAlternativeInputButton()      { cy.get('[data-testid="entity-extractor-add-alternative-input-button"]').click() }
export function ClickEntityDetectionToken(tokenValue: string) { cy.get('[data-testid="token-node-entity-value"]').contains(tokenValue).click() }
export function ClickSubmitChangesButton()            { cy.get('[data-testid="submit-changes-button"]').click() }
export function GetAllChatMessages()                  { return helpers.StringArrayFromInnerHtml(AllChatMessagesSelector)}
export function VerifyErrorMessage(expectedMessage: string)   { (cy.get('div.cl-editdialog-error > div > span') as any).ExactMatch(expectedMessage)}
export function VerifyNoErrorMessage()                { (cy as any).DoesNotContain('div.cl-editdialog-error > div > span')}
export function ClickDeleteChatTurn()                 { cy.get('[data-testid="edit-dialog-modal-delete-turn-button"]').click() }

export function ClickSaveCloseButton()                { cy.get('[data-testid="edit-teach-dialog-close-save-button"]').click() }
export function VerifyCloseButtonLabel()              { cy.get('[data-testid="edit-teach-dialog-close-save-button"]').contains('Close') }
export function VerifySaveBranchButtonLabel()         { cy.get('[data-testid="edit-teach-dialog-close-save-button"]').contains('Save Branch') }
export function ClickAbandonDeleteButton()            { cy.get('[data-testid="edit-dialog-modal-abandon-delete-button"]').click() }
export function VerifyDeleteButtonLabel()             { cy.get('[data-testid="edit-dialog-modal-abandon-delete-button"]').contains('Delete') }
export function VerifyAbandonBranchButtonLabel()      { cy.get('[data-testid="edit-dialog-modal-abandon-delete-button"]').contains('Abandon Branch') }
export function ClickUndoButton()                     { cy.get('[data-testid="edit-teach-dialog-undo-button"]').click() }

export function ClickConfirmAbandonDialogButton()     { return cy.get('.ms-Dialog-main').contains('abandon').parents('.ms-Dialog-main').contains('Confirm').click() }

// Verify that the branch button is within the same control group as the message.
export function VerifyBranchButtonGroupContainsMessage(message: string)
{
  cy.get('[data-testid="edit-dialog-modal-branch-button"]').as('branchButton')
    .parents('div.wc-message-selected').contains('p', message)
}

export function AbandonBranchChanges()
{
  ClickAbandonDeleteButton()
  homePage.ClickConfirmButton()
}

// Selects FROM ALL chat messages, from both Bot and User
// Once clicked, more UI elements will become visible & enabled
export function SelectChatTurn(message: string, index = 0)
{
  message = message.replace(/'/g, "’");

  (cy.get(AllChatMessagesSelector) as any).ExactMatches(message).then((elements: any) => 
  {
    if (elements.length <= index) throw `Could not find '${message}' #${index} in chat utterances`
    cy.wrap(elements[index]).click()
  })
}

// This is meant to be called after SelectChatTurn for a user message.
// Do NOT use this for bot messages, since they have no branching capabilities.
// Side Effect: '@branchButton' alias is created.
export function VerifyBranchButtonIsInSameControlGroupAsMessage(message: string)
{
  // Verify that the branch button is within the same control group as the originalMessage that was just selected.
  cy.get('[data-testid="edit-dialog-modal-branch-button"]').as('branchButton')
    .parents('div.wc-message-selected').contains('p', message)
}

// This depends on the '@branchButton' alias having been created by the VerifyBranchButtonIsInSameControlGroupAsMessage() function.
export function BranchChatTurn(message: string)
{
  cy.get('@branchButton').click()
  cy.get('[data-testid="user-input-modal-new-message-input"]').type(`${message}{enter}`)
}

// Creates the '@allChatTurns' alias.
export function GetAllChatTurns()
{
  cy.get('[data-testid="web-chat-utterances"]').as('allChatTurns')  
}

export function VerifyChatTurnControls(element: HTMLElement, index: number)
{
  var userMessage
  if (element.classList.contains('wc-message-from-me')) userMessage = true
  else if (element.classList.contains('wc-message-from-bot')) userMessage = false
  else
  {
    helpers.Dump(`VerifyChatTurnControls()`, element)
    throw 'Expecting element to contain class with either "wc-message-from-me" or "wc-message-from-bot" (see console output for element dump)'
  }

  if (index > 0) cy.contains('[data-testid="edit-dialog-modal-delete-turn-button"]', 'Delete Turn')
  else (cy as any).DoesNotContain('[data-testid="edit-dialog-modal-delete-turn-button"]')
  
  cy.contains('[data-testid="chat-edit-add-bot-response-button"]', '+')

  if (userMessage) (cy.get('[data-testid="edit-dialog-modal-branch-button"]').contains('Branch') as any).ConLog(`VerifyChatTurnControls()`, 'Branch Found')
  else (cy as any).DoesNotContain('[data-testid="edit-dialog-modal-branch-button"]')

  cy.contains('[data-testid="chat-edit-add-user-input-button"]', '+')
}

// Provide any user message and any Bot message expected in chat.
export function VerifyThereAreNoChatEditControls(userMessage: string, botMessage: string)
{
  // These confirm we are looking at the chat history we are expecting to validate.
  cy.get('.wc-message-from-me').contains(userMessage)
  cy.get('.wc-message-from-bot').contains(botMessage)

  // These do the actual validation this function is intended to validate.
  const cyAny = cy as any
  cyAny.DoesNotContain('[data-testid="edit-dialog-modal-delete-turn-button"]')
  cyAny.DoesNotContain('[data-testid="chat-edit-add-bot-response-button"]', '+')
  cyAny.DoesNotContain('[data-testid="edit-dialog-modal-branch-button"]')
  cyAny.DoesNotContain('[data-testid="chat-edit-add-user-input-button"]', '+')
}

export function LabelTextAsEntity(text: string, entity: string)
{
  cy.get('body').trigger('Test_SelectWord', {detail: text})
  cy.get('[data-testid="entity-picker-entity-search"]').type(`${entity}{enter}`)
}

// Verify that a specific word of a user utterance has been labeled as an entity.
// word = a word within the utterance that should already be labeled
// entity = name of entity the word was labled with
// *** This may work for multiple word labels, but you must only pass in the one
// *** word that uniquely identifies the labeled text
export function RemoveEntityLabel(word: string, entity: string, index = 0)
{
  cy.get('div.slate-editor').then(elements =>
  {
    expect(elements.length).to.be.at.least(index - 1)
    cy.wrap(elements[index]).within(() =>
    {
      cy.wrap(elements[index]).click();
      (cy.get('[data-testid="token-node-entity-value"] > span > span') as any)
        .ExactMatch(word)
        .parents('.cl-entity-node--custom')
        .find('[data-testid="custom-entity-name-button"]')
        .contains(entity)
        .click()
      
      cy.get('button[title="Unselect Entity"]').click()
    })
  })

}

// Verify that a specific word of a user utterance has been labeled as an entity.
// textEntityPairs object contains these two variables, it can be either an array or single instance:
//  word = a word within the utterance that should already be labeled
//  entity = name of entity the word should be labeled with
// *** This does NOT work for multiple words. ***
export function VerifyEntityLabel(word: string, entity: string)
{
  (cy.get('[data-testid="token-node-entity-value"] > span > span') as any)
    .ExactMatch(word)
    .parents('.cl-entity-node--custom')
    .find('[data-testid="custom-entity-name-button"]')
    .contains(entity)
}

// textEntityPairs object contains these two variables, it can be either an array or single instance:
//  text = a word within the utterance that should already be labeled
//  entity = name of entity to label the word with
type IEntityPair = { text: string, entity: string }
export function VerifyEntityLabeledDifferentPopupAndClose(textEntityPairs: IEntityPair[])  {VerifyEntityLabeledDifferentPopupAndClickButton(textEntityPairs, 'Close')}
export function VerifyEntityLabeledDifferentPopupAndAccept(textEntityPairs: IEntityPair[]) {VerifyEntityLabeledDifferentPopupAndClickButton(textEntityPairs, 'Accept')}

function VerifyEntityLabeledDifferentPopupAndClickButton(textEntityPairs: IEntityPair[], buttonLabel: string) 
{ 
  cy.get('.ms-Dialog-main')     // This returns multiple parent objects
    .contains('Entity is labelled differently in another user utterance') // Narrows it down to 1
    .parents('.ms-Dialog-main') // Back to the single parent object
    .within(() =>
  {
    if (!Array.isArray(textEntityPairs)) textEntityPairs = [textEntityPairs]
    for (var i = 0; i < textEntityPairs.length; i++) VerifyEntityLabel(textEntityPairs[i].text, textEntityPairs[i].entity)

    // TODO: Wanted to use 'ExactMatch' instead of 'contains', but there is a weird problem...
    //       for some reson the first two button texts on this popup all end with a newline.
    cy.get('button.ms-Button').contains(buttonLabel).click()
  })
}

export function VerifyEntityLabelWithinSpecificInput(textEntityPairs: IEntityPair[], index: number)
{
  cy.get('div.slate-editor').then(elements =>
  {
    expect(elements.length).to.be.at.least(index - 1)
    cy.wrap(elements[index]).within(() =>
    {
      if (!Array.isArray(textEntityPairs)) textEntityPairs = [textEntityPairs]
      for (var i = 0; i < textEntityPairs.length; i++) VerifyEntityLabel(textEntityPairs[i].text, textEntityPairs[i].entity)
    })
  })
}

export function InsertUserInputAfter(existingMessage: string, newMessage: string)
{
  SelectChatTurn(existingMessage);
  (cy as any).RunAndExpectDomChange(() => { Cypress.$('[data-testid="chat-edit-add-user-input-button"]')[0].click() })
  cy.get('[data-testid="user-input-modal-new-message-input"]').type(`${newMessage}{enter}`)
}
