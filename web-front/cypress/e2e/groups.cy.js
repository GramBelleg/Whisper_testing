

describe('Groups chat', () => {
  const WUT = "http://localhost:5173/login" // website under test
  const master_token = "f5a836f5-72da-4c01-8de2-caa1e60f41b3" // website under test
  const test_Email = `${master_token}@emailhook.site` 
  const user1_email = "tre.cummings@yahoo.com"
  const user1_password = "abcdefgh"
  const user2_email = "eden74@yahoo.com"
  const user2_password = "22222222"

  // before(() => {
  //   cy.fixture('selectors').then((selectors) => {
  //     selectors = selectors;
  //   });
  // });

  beforeEach(() => {
    cy.visit(WUT);
    cy.get("#email").type(user1_email);
    cy.get("#password").type(user1_password);
    cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
    cy.url().should('eq','http://localhost:5173/');
  });

  describe('creating a group', () => { 
    const group_name = "best group ever"
    const message = Math.random().toString(36).substring(2, 60);

    // it('creating a group', () => {
    //   cy.wait(2000)
    //   cy.get('.add-new-button').click();
    //   cy.contains('New Group').click();
    //   cy.get('.user-list > :nth-child(1)').click();
    //   cy.get('.user-list > :nth-child(2)').click();
    //   cy.get('.forward-icon').click();
    //   cy.get('#_24x24_On_Light_Edit').click();
    //   cy.get('[data-testid="bio"]').type(group_name);
    //   cy.get('[data-testid="button-save-edit"]').click();
    //   cy.get('.forward-icon').click();

    //   // cy.get('[data-testid="bio"]').type(bio);
    // });

    it('send messages and be recieved', () => {
      cy.wait(2000)
      cy.contains('tessssst').click();
      cy.get('[data-testid="text-input"]').type(message);
      cy.get('.voice-send-container').click();
      cy.wait(10000)

      cy.Logout();

      cy.get("#email").type(user2_email);
      cy.get("#password").type(user2_password);
      cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
      cy.url().should('eq','http://localhost:5173/');
      cy.contains('tessssst').click();
      cy.contains(message).should("be.visible");



      // cy.get('[data-testid="bio"]').type(bio);
    });

    it('should allow admin to add/remove users', () => {
      cy.contains(group_name).click();
      cy.get('.group-settings').click(); // Open group settings
      cy.get('.add-user-button').click(); // Add a user
      cy.contains('User3').click(); // Example user
      cy.get('.save-changes-button').click();
      cy.contains('User3').should('be.visible'); // Verify user is added
  
      // Remove user
      cy.get('.remove-user-button').click(); // Example remove button
      cy.contains('User3').should('not.exist'); // Verify user is removed
    });
  
    it('should allow admin to set group privacy', () => {
      cy.contains(group_name).click();
      cy.get('.group-settings').click();
      cy.get('.privacy-toggle').click(); // Toggle privacy
      cy.get('.save-changes-button').click();
      cy.contains('Private Group').should('be.visible'); // Verify privacy change
    });
  
    it('should allow admin to mute notifications', () => {
      cy.contains(group_name).click();
      cy.get('.group-settings').click();
      cy.get('.mute-notifications').click(); // Mute notifications
      cy.get('.duration-select').select('1 Hour'); // Example duration
      cy.get('.save-changes-button').click();
      cy.contains('Muted for 1 Hour').should('be.visible'); // Verify mute
    });
  
    it('should allow group search', () => {
      cy.get('.search-bar').type(group_name); // Search for group
      cy.contains(group_name).should('be.visible'); // Verify search result
    });
    

  });

});