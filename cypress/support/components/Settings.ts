/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

export function VerifyPageTitle()         { cy.get('[data-testid="settings-title"]').contains('Settings').should('be.visible') }

export function DeleteModel(modelName: string)
{ 
  cy.visit('http://localhost:5050')
  // cy.get('[data-testId="settings-delete-model-button"]').click() 
  // cy.get('[data-testid="user-input-modal-new-message-input"]').type(`${modelName}{enter}`)
}

