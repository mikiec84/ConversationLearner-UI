/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

export function VerifyPageTitle()       { cy.get('[data-testid="entities-title"]').contains('Entities').should('be.visible') }
export function ClickButtonNewEntity()  { cy.get('[data-testid="entities-button-create"]').click() }
export function VerifyItemInList(name: string)  { cy.get('.ms-DetailsRow-cell').should('contain', name) }