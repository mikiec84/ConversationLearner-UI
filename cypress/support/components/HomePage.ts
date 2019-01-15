/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
import * as helpers from '../Helpers'

export function Visit()                         { return cy.visit('http://localhost:5050'); VerifyPageTitle() }
export function VerifyPageTitle()               { return cy.get('[data-testid="model-list-title"]').contains('Create and manage your Conversation Learner models').should('be.visible') }
export function NavigateToModelPage(name: string)       { return (cy.get('[data-testid="model-list-model-name"]') as any).ExactMatch(`${name}`).click() }
export function ClickNewModelButton()           { return cy.get('[data-testid="model-list-create-new-button"]').click() }
export function ClickImportModelButton()        { return cy.get('[data-testid="model-list-import-model-button"]').click() }
export function TypeModelName(name: string)             { return cy.get('[data-testid="model-creator-input-name"]').type(name) }
export function ClickSubmitButton()             { return cy.get('[data-testid="model-creator-submit-button"]').click() }

export function UploadImportModelFile(name: string)     { return (cy as any).UploadFile(name, `[data-testid=model-creator-import-file-picker] > div > input[type="file"]`)}

export function ClickDeleteModelButton(row: string)     { return cy.get(`[data-list-index="${row}"] > .ms-FocusZone > .ms-DetailsRow-fields`).find('i[data-icon-name="Delete"]').click() }
export function ClickConfirmButton()            { return cy.get('.ms-Dialog-main').contains('Confirm').click() }

export function GetModelListRowCount() 
{
  return cy.get('[data-automationid="DetailsList"] > [role="grid"]')
  .then(gridElement => { var rowCount = +gridElement.attr('aria-rowcount')! -1; return rowCount })
}

export function GetModelNameIdList()  
{
  var listToReturn = new Array()
  var elements = Cypress.$('[data-testid="model-list-model-name"]')
  for(var i = 0; i < elements.length; i++)
  {
    var modelName = elements[i].innerText
    var modelId = elements[i].getAttribute('data-model-id');
    listToReturn.push({name: modelName, id: modelId})
    helpers.ConLog('GetModelNameIdList', `modelName: ${modelName} - modelId: ${modelId}`)
  }
  helpers.ConLog('GetModelNameIdList', `Returning a list of ${listToReturn.length} models`)
  return listToReturn
}