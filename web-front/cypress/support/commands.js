// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


  Cypress.Commands.add('createGroup', (group_name) => {
    cy.wait(2000)
    cy.get('.add-new-button').click();
    cy.contains('New Group').click();
    cy.get('.user-list > :nth-child(1)').click();
    cy.get('.user-list > :nth-child(2)').click();
    cy.get('.forward-icon').click();
    cy.get('#_24x24_On_Light_Edit').click();
    cy.get('[data-testid="bio"]').type(group_name);
    cy.get('[data-testid="button-save-edit"]').click();
    cy.get('.forward-icon').click();
  })

  Cypress.Commands.add('createChannel', (channel_name) => {
    cy.wait(2000)
    cy.get('.add-new-button').click();
    cy.contains('New Channel').click();
    cy.get('.user-list > :nth-child(1)').click();
    cy.get('.user-list > :nth-child(2)').click();
    cy.get('.forward-icon').click();
    cy.get('#_24x24_On_Light_Edit').click();
    cy.get('[data-testid="bio"]').type(channel_name);
    cy.get('[data-testid="button-save-edit"]').click();
    cy.get('.forward-icon').click();
  })

  Cypress.Commands.add('Signup', (WUT) => {
    cy.GetToken().then((token) => {
      const sanitizedToken = token.replace(/-/g, ""); // Removes all hyphens
      cy.visit(WUT);
      cy.get("#name").type("grambell");
      cy.get("#userName").type(`${sanitizedToken}`);
      const TestEmail = `${token}@email.webhook.site`;
      cy.get("#email").type(TestEmail);
      cy.get("#password").type("Goodpassword1");
      cy.get("#confirmPassword").type("Goodpassword1");
      cy.GeneratePhoneNumber().then((phoneNumber) => {
      cy.get('.phone-input').clear();
      cy.get('.phone-input').type(phoneNumber);
      });
      cy.get("#signup-btn").click();
      cy.wait(8000);
      cy.GetVerificationCode(token).then((code) => {
        cy.log('code!!!!', code);
        cy.get('#code').type(code);
        cy.get('[data-testid]').click();
        return cy.wrap(token);
      })
    })
  })

  Cypress.Commands.add('Login', (WUT,email, password, urlCheck = 'http://localhost:5173/') => {
    cy.visit(WUT)
    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get("#login-btn").click();
    cy.url().should('eq',urlCheck);
    cy.reload();
  })

  Cypress.Commands.add('Logout', () => {
    cy.get('[data-testid="logout-icon"]').click();
    cy.get('#logout-ok-btn').click();
    cy.url().should('eq','http://localhost:5173/login');
  })


  Cypress.Commands.add('Signup', (WUT) => {
    cy.GetToken().then((token) => {
      const sanitizedToken = token.replace(/-/g, ""); // Removes all hyphens
      cy.visit(WUT);
      cy.get("#name").type("grambell");
      cy.get("#userName").type(`${sanitizedToken}`);
      const TestEmail = `${token}@email.webhook.site`;
      cy.get("#email").type(TestEmail);
      cy.get("#password").type("Goodpassword1");
      cy.get("#confirmPassword").type("Goodpassword1");
      cy.GeneratePhoneNumber().then((phoneNumber) => {
        cy.get('.phone-input').clear();
        cy.get('.phone-input').type(phoneNumber);
      });
      cy.get("#signup-btn").click();
      cy.wait(8000);
      cy.GetVerificationCode(token).then((code) => {
        cy.log('code!!!!', code);
        cy.get('#code').type(code);
        cy.get('[data-testid]').click();
      })
    })
  })

  Cypress.Commands.add('GetToken', () => {
    return cy.request({
        method: 'POST',
        url: 'https://webhook.site/token',

    }).then((response) => {
        const token = response.body;
        return token.uuid;
    })
  })

  Cypress.Commands.add('GetVerificationCode', (token) => {
    return cy.request({
      method: 'GET',
      url: `https://webhook.site/token/${token}/requests`,
    }).then((response) => {
      const requests = response.body.data; // Get all requests
      const latestRequest = requests[requests.length - 1];
      const emailBody = latestRequest.text_content;
      cy.log('Full Response:', emailBody);
      const codeRegex = /Use this code: ([A-Za-z0-9]{8})/;
      const match = emailBody.match(codeRegex);
      return cy.wrap(match ? match[1] : null);
    });
  });

  Cypress.Commands.add('GeneratePhoneNumber', () => {
    const areaCode = Math.floor(10 + Math.random() * 90);
    const middlePart = Math.floor(100 + Math.random() * 900);
    const lastPart = Math.floor(1000 + Math.random() * 9000);
  
    const phoneNumber = `+201 ${areaCode}-${middlePart}-${lastPart}`;
    return phoneNumber;
  });
  
  const yaml = require('js-yaml');

  Cypress.Commands.add('loadSelectors', () => {
    cy.readFile('cypress/fixtures/selectors.yaml').then((fileContent) => {
      const selectors = yaml.load(fileContent);
      return selectors;
    });
  });
  

