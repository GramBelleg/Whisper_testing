

describe('Groups chat', () => {
  const WUT = "http://localhost:5173/login" // website under test
  let users;

  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.visit(WUT);
    cy.get("#email").type(users.user1.email);
    cy.get("#password").type(users.user1.password);
    cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
    cy.url().should('eq','http://localhost:5173/');
    cy.wait(1000);
    cy.reload();
  });


  describe('group chatting', () => { 
    const message = Math.random().toString(36).substring(2, 60);
    const group_name = Math.random().toString(36).substring(2, 30);

    // it('creating a group', () => {
    //   const group_name = Math.random().toString(36).substring(2, 30);

    //   cy.get('.add-new-button').click();
    //   cy.contains('New Group').click();
    //   cy.get('.user-list > :nth-child(1)').click();
    //   cy.get('.user-list > :nth-child(2)').click();
    //   cy.get('.forward-icon').click();
    //   cy.get('#_24x24_On_Light_Edit').click();
    //   cy.get('[data-testid="bio"]').type(group_name);
    //   cy.get('[data-testid="button-save-edit"]').click();
    //   cy.get('.forward-icon').click();
    //   cy.get('.chat-list')
    //   .contains(group_name).should('exist');
    // });

    // it('creating a DUPLICATE group', () => {
    //   cy.createGroup(group_name);
    //   cy.reload();
    //   cy.createGroup(group_name);
    //   cy.wait(2000)
    //   cy.get('.chat-list')
    //   .find('.user-name   ')
    //   .filter((_, el) => el.textContent === group_name)
    //   .should('have.length', 1);
    // });

    // it('send messages and be recieved', () => {
    //   cy.contains('bahebak').click();
    //   cy.wait(3000) // they told me so, i am done with this already
    //   cy.get('[data-testid="text-input"]').type(message);
    //   cy.get('.voice-send-container').click();

    //   cy.Logout();

    //   cy.get("#email").type(users.user2.email);
    //   cy.get("#password").type(users.user2.password);
    //   cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
    //   cy.url().should('eq','http://localhost:5173/');
    //   cy.contains('bahebak').click();
    //   cy.contains(message).should("be.visible");
    // });

    it('send files and be recieved', () => {
      cy.contains('bahebak').click();
      cy.get('[data-testid="attach-icon"]').click();
      const filePath = "cypress/fixtures/test_image.jpg";
      cy.get('[data-testid="attach-menu"] > :nth-child(2)').click().selectFile(filePath, { force: true });;
      cy.wait(300000) // they told me so, i am done with this already
      cy.get('[data-testid="text-input"]').type(message);
      cy.get('.voice-send-container').click();

      cy.Logout();

      cy.get("#email").type(users.user2.email);
      cy.get("#password").type(users.user2.password);
      cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
      cy.url().should('eq','http://localhost:5173/');
      cy.contains('bahebak').click();
      cy.contains(message).should("be.visible");
    });


    
    it('should allow admin to delete groups', () => {
      const group_name = Math.random().toString(36).substring(2, 30);
      cy.createGroup(group_name);
      cy.get('.chat-list')
      .contains(group_name) 
      .click();
      cy.get('.dropdown-container').click();
      cy.get('.dropdown-menu > :nth-child(3)').click();

      cy.reload();

      cy.get('.chat-list')
      .contains(group_name).should('not.exist');
    });

    it('should allow admin to make users admins', () => {
      const group_name = Math.random().toString(36).substring(2, 30);
      cy.createGroup(group_name);
      cy.get('.chat-list')
      .contains(group_name) 
      .click();
      cy.get('.header-details').click();
      cy.get('.members-list > :nth-child(2) > .svg-inline--fa').click();
      cy.get('.absolute > :nth-child(1)').click();

      cy.Logout();

      cy.Login(WUT, users.user2.email, users.user2.password);
      cy.wait(2000)

      cy.get('.chat-list')
      .contains(group_name).click();
      cy.get('.header-details').click();
      cy.get('.members-list > :nth-child(3) > .svg-inline--fa').click();
      cy.get('.absolute > :nth-child(2)').should('exist');
    });

        it('should allow admin to remove users', () => {
      const group_name = Math.random().toString(36).substring(2, 30);
      cy.createGroup(group_name);
      cy.get('.chat-list')
      .contains(group_name) 
      .click();
      cy.get('.header-details').click(); // Open group settings
      cy.get('.members-list > :nth-child(2) > .svg-inline--fa').click();
      cy.get('.absolute > :nth-child(2)').click();

      cy.Logout();

      cy.Login(WUT, users.user2.email, users.user2.password);

      cy.get('.chat-list')
      .contains(group_name).should('not.exist');
    });
  
    it('should allow admin to add users', () => {
      const group_name = Math.random().toString(36).substring(2, 30);
      cy.createGroup(group_name);
      cy.get('.chat-list')
      .contains(group_name) 
      .click();
      cy.get('.header-details').click(); // Open group settings
      cy.get('[data-testid="add-button"] > .svg-inline--fa').click();
      cy.get('.user-list > :nth-child(3)').click();
      cy.contains('Add 1 Member').click();

      cy.Logout();

      cy.Login(WUT, "alia29@hotmail.com", users.user2.password);
      cy.get('.chat-list')
      .contains(group_name).should('exist');
    });
  
    // it('should allow admin to mute notifications', () => {
    //   const group_name = Math.random().toString(36).substring(2, 30);
    //   cy.createGroup(group_name);
    //   cy.get('.chat-list')
    //   .contains(group_name) 
    //   .click();
    //   cy.get('.dropdown-container').click();
    //   cy.get('.dropdown-menu > :nth-child(1)').click();
    //   cy.wait(10000);
    // });
  
    it('should allow group search', () => {
      cy.contains('bahebak').click();
      cy.get('.fa-magnifying-glass').click();
      cy.get('.mb-6 > .search-bar').type('Veniam{enter}');
      cy.get('.message-search-result > .message-container')
      .contains('Veniam').should('be.visible');
    });
    

  });

});