/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */


// data-testid="teach-session-admin-train-status" (Running, Completed, Failed)
export function ClickRefreshScoreButton()       { cy.get('[data-testid="teach-session-admin-refresh-score-button"]').click() }
export function SelectAnAction()                { cy.get('[data-testid="action-scorer-button-clickable"]').should("be.visible").click() }
export function ClickAddActionButton()          { cy.get('[data-testid="action-scorer-add-action-button"]').click() }

export function ClickAction(expectedResponse: string)
{
  ;(cy.get('[data-testid="action-scorer-text-response"]') as any).ExactMatch(expectedResponse)
    .parents('div.ms-DetailsRow-fields').find('[data-testid="action-scorer-button-clickable"]')
    .click()
  VerifyLastChatMessage(expectedResponse)
}

export function VerifyLastChatMessage(expectedMessage: string)
{
  var expectedUtterance = expectedMessage.replace(/'/g, "’")

  cy.get('[data-testid="web-chat-utterances"]').then(elements => {
    cy.wrap(elements[elements.length - 1]).within(e => {
      cy.get('div.format-markdown > p').should('have.text', expectedUtterance)
    })})
}

export function VerifyContainsEnabledAction(expectedResponse: string)
{
    cy.get('[data-testid="action-scorer-text-response"]').contains(expectedResponse)
    .parents('div.ms-DetailsRow-fields').find('[data-testid="action-scorer-button-clickable"]')
    .should('be.enabled')
}

export function VerifyContainsDisabledAction(expectedResponse: string)
{
    cy.get('[data-testid="action-scorer-text-response"]').contains(expectedResponse)
    .parents('div.ms-DetailsRow-fields').find('[data-testid="action-scorer-button-no-click"]')
    .should('be.disabled')
}

export function VerifyEntityInMemory(entityName: string, entityValue: string)
{
  cy.get('[data-testid="entity-memory-name"]').contains(entityName)
  cy.get('[data-testid="entity-memory-value"]').contains(entityValue)
}

