/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

export function CreateNewLogDialogButton()  { cy.get('[data-testid="log-dialogs-new-button"]').click() }
export function ClickDoneTestingButton()    { return cy.get('[data-testid="chat-session-modal-done-testing-button"]').click() }
export function ClickSessionTimeoutButton() { cy.get('[data-testid="chat-session-modal-session-timeout-button"]').click() }
export function TypeYourMessage(message: string)    { cy.get('input[placeholder="Type your message..."]').type(`${message}{enter}`) }  // data-testid NOT possible

export function TypeYourMessageValidateResponse(message: string, expectedResponse: string)
{
  cy.get('input[placeholder="Type your message..."]').type(`${message}{enter}`)  // data-testid NOT possible

  // Verify both the input message is reflected back and the response is what we are expecting.
  // This also has the useful side effect of blocking this function from returning until after
  // the response has been returned.
  var messageCount = 0
  var expectedUtterance = message.replace(/'/g, "’")
  cy.get('.wc-message-content').then(elements => 
  {
    messageCount = elements.length;
    cy.wrap(elements[elements.length - 1]).contains(expectedUtterance)
  }).then(() =>
  {
    if (expectedResponse)
    {
      expectedUtterance = expectedResponse.replace(/'/g, "’")
      cy.get('.wc-message-content', {timeout: 60000}).then(elements => 
      {
        cy.wrap(elements[messageCount]).contains(expectedUtterance)
      })
    }
    else
    {
      cy.get('.wc-message-content', {timeout: 60000}).then(elements => 
      {
        ;(cy.wrap(elements[messageCount]) as any).DoesNotContain(expectedUtterance)
      })
    }
  })
}