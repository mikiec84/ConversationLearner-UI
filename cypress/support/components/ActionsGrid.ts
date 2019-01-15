/**
* Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
*/

import * as helpers from '../Helpers'

export function VerifyPageTitle() {
  cy.get('[data-testid="actions-title"]')
    .contains('Actions')
    .should('be.visible')
}
export function ValidateExpectedEntities(entities: string[]) {
  ValidateEntities('[data-testid="action-details-expected-entity"]', '[data-testid="action-details-empty-expected-entities"]', entities)}

// The UI automatically populates the Required Entities field with entities found in the response text,
// so the additionalRequiredEntities parameter allows the caller to specify entities not found in the response text.
export function ValidateRequiredEntities(requiredEntitiesFromResponse: string[], additionalRequiredEntities: string[])  { ValidateEntities('[data-testid="action-details-required-entity"]', '[data-testid="action-details-empty-required-entities"]', requiredEntitiesFromResponse, additionalRequiredEntities)}

// The UI automatically populates the Disqualtifying Entities field with the expected entities,
// so the disqualifyingEntities parameter allows the caller to specify entities not found in expectedEntities.
export function ValidateDisqualifyingEntities(expectedEntities: string[], disqualifyingEntities: string[])              { ValidateEntities('[data-testid="action-details-disqualifying-entity"]', '[data-testid="action-details-empty-disqualifying-entities"]', expectedEntities, disqualifyingEntities) }

// IMPORTANT: Call this method before calling any of the Validate* methods.
export function GetRowToBeValidated(response: string)
{
  cy.get('[data-testid="action-scorer-text-response"]')
    .contains(response)
    .parents('div.ms-DetailsRow-fields')
    .as('responseDetailsRow')
}


function ValidateEntitiesIsEmpty(selector: string)              { cy.get('@responseDetailsRow').find(selector) }

function ValidateEntities(selector: string, emptySelector: string, entities1: string[] | string, entities2?: string | string[])
{ 
  if (!entities1 && !entities2) return ValidateEntitiesIsEmpty(emptySelector)

  var entities: string[] = []
  if (entities1)
  {
    if(!Array.isArray(entities1)) entities1 = [entities1]
    entities = entities1
  }
  if (entities2)
  {
    if(!Array.isArray(entities2)) entities2 = [entities2]
    entities = [...entities, ...entities2]
  }
  entities = helpers.RemoveDuplicates(entities)
  
  if (entities.length == 0) return ValidateEntitiesIsEmpty(emptySelector)

  cy.get('@responseDetailsRow').find(selector).as('entitiesList')
  entities.forEach(entity => cy.get('@entitiesList').contains(entity))
  cy.get('@entitiesList').should('have.length', entities.length)
}



