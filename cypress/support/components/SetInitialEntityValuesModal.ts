/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

export function ClickAddInitialValueButton(entityName: string)      { cy.get('[data-testid="teach-session-add-initial-value"]').contains(entityName).click() }
export function VerifyEntityValue(expectedValue: string)            { cy.get('[data-testid="teach-session-entity-name"]').contains(expectedValue) }
export function TypeInitialValue(entityName: string, initialValue: string)  { cy.get('[data-testid="teach-session-initial-value"]').contains(entityName).type(`${initialValue}{enter}`) }
export function ClickDeleteButton(entityName: string)               { cy.get('[data-testid="teach-session-delete-button"]').contains(entityName).click() }

export function ClickOkButton()                             { cy.get('[data-testid="teach-session-ok-button"]').click() }
export function ClickCancelButton()                         { cy.get('[data-testid="teach-session-cancel-button"]').click() }