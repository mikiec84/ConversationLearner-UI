/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */

import * as entitiesGrid from './EntitiesGrid'
import * as actionsGrid from './ActionsGrid'
import * as trainDialogsGrid from './TrainDialogsGrid'
import * as logDialogsGrid from './LogDialogsGrid'
import * as settings from './Settings'
 
export function VerifyModelName(name: string)     { cy.get('[data-testid="app-index-model-name"]').should(el => { expect(el).to.contain(name) })}
export function VerifyPageTitle()         { cy.get('[data-testid="dashboard-title"]').contains('Log Dialogs').should('be.visible') }

export function NavigateToHome()          { cy.get('[data-testid="app-index-nav-link-home"]').click();          VerifyPageTitle() }
export function NavigateToEntities()      { cy.get('[data-testid="app-index-nav-link-entities"]').click();      entitiesGrid.VerifyPageTitle() }
export function NavigateToActions()       { cy.get('[data-testid="app-index-nav-link-actions"]').click();       actionsGrid.VerifyPageTitle() }
export function NavigateToTrainDialogs()  { cy.get('[data-testid="app-index-nav-link-train-dialogs"]').click(); trainDialogsGrid.VerifyPageTitle() }
export function NavigateToLogDialogs()    { cy.get('[data-testid="app-index-nav-link-log-dialogs"]').click();   logDialogsGrid.VerifyPageTitle() }
export function NavigateToSettings()      { cy.get('[data-testid="app-index-nav-link-settings"]').click();      settings.VerifyPageTitle() }
export function VerifyNoErrorIconOnPage() { (cy as any).DoesNotContain('i[data-icon-name="IncidentTriangle"].cl-color-error') }

// For the Left Pane "Train Dialogs" link.
export function VerifyErrorIconForTrainDialogs() { cy.get('[data-testid="app-index-nav-link-train-dialogs"]').find('i[data-icon-name="IncidentTriangle"].cl-color-error') }

// To validate that this code works, search src\actions\appActions.ts for these and alter them:
//   fetchApplicationTrainingStatusThunkAsync
//   interval:
//   maxDuration:
var canRefreshTrainingStatusTime = 0
export function WaitForTrainingStatusCompleted()  
{
  var currentHtml = Cypress.$('html')[0].outerHTML
  var currentTime = new Date().getTime()
  if (currentHtml.includes('data-testid="training-status-polling-stopped-warning"') &&
     (currentTime > canRefreshTrainingStatusTime))
  {    
    canRefreshTrainingStatusTime = currentTime + (2 * 1000)
    
    // When we get here it is possible there are two refresh buttons on the page, one that
    // is covered up by a popup dialog. Unfortunately the .click() function can take only
    // one element to click on, so this code is an attempt to deal with that issue.
    cy.get('[data-testid="training-status-refresh-button"]').then((elements) => { cy.wrap(elements[elements.length - 1]).click() })
  
    // The reason we need to call this method once again using cy.WaitForTrainingStatusCompleted()
    // is because the .click() function causes the time out to change to a default of 4 seconds
    ;(cy as any).WaitForTrainingStatusCompleted()
  }
  expect(currentHtml.includes('data-testid="training-status-completed"')).to.equal(true)
}