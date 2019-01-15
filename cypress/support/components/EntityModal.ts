/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
export function ClickEntityType(type: string)                 { cy.get(`button.ms-Dropdown-item`).contains(type).click() }
export function TypeEntityName(entityName: string)            { cy.get('[data-testid="entity-creator-entity-name-text"]').type(entityName) } 
export function ClickEntityTypeDropdown()             { cy.get('[data-testid="entity-creator-entity-type-dropdown"]').click() }
export function ClickCreateButton()                   { cy.get('[data-testid="entity-creator-button-save"]').click() }

export function ClickMultiValueCheckbox()             { cy.get('[data-testid="entity-creator-multi-valued-checkbox"] > button.cl-checkbox').click() }
export function ClickNegatableCheckbox()              { cy.get('[data-testid="entity-creator-negatable-checkbox"] > button.cl-checkbox').click() }

export function ClickOkButtonOnNoteAboutPreTrained()  { return cy.get('.ms-Dialog-main').contains('pre-trained Entity').parents('.ms-Dialog-main').contains('OK').click() }

export function SelectResolverType(resolverType: string)
{ 
  cy.get('[data-testid="entity-creator-resolver-type-dropdown"]').click()
  
  ;(cy.get('div[role="listbox"].ms-Dropdown-items > button.ms-Dropdown-item > div > div > span.clDropdown--normal') as any)
    .ExactMatch(resolverType)
    .parents('button.ms-Dropdown-item')
    .click()
}
