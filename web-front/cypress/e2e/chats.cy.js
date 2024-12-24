describe('chats', () => {
    const WUT = "http://localhost:5173/login" // website under test
    let users
  
  
    before(() => {
      cy.fixture('users').then((data) => {
        users = data;
      });
    });
  
    beforeEach(() => {
        cy.Login(WUT, users.user1.email, users.user1.password);
    });
  
  
    describe('text messaging', () => { 
      it('sending a message', () => {
        const message = Math.random().toString(36).substring(2, 60);
        cy.get('.user-list')
        .contains(users.user2.username).click();
        cy.get('[data-testid="text-input"]').type(message);
        cy.get('.voice-send-container').click();
        cy.contains(message).should("be.visible");
        cy.wait(3000)
        cy.contains(".svg-inline--fa fa-check-double read-icon").should("be.visible");
        cy.wait(300000)

      });
  
      it('creating a DUPLICATE channel', () => {
        cy.createChannel(channel_name);
        cy.reload();
        cy.createChannel(channel_name);
        cy.wait(2000)
        cy.get('.chat-list')
        .find('.user-name   ')
        .filter((_, el) => el.textContent === channel_name)
        .should('have.length', 1);
      });
  
      it('send messages and be recieved', () => {
        cy.contains('awy').click();
        cy.wait(3000) // they told me so, i am done with this already
        cy.get('[data-testid="text-input"]').type(message);
        cy.get('.voice-send-container').click();
  
        cy.Logout();
  
        cy.get("#email").type(users.user2.email);
        cy.get("#password").type(users.user2.password);
        cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
        cy.url().should('eq','http://localhost:5173/');
        cy.contains('awy').click();
        cy.contains(message).should("be.visible");
      });
  
  
      
      it('should allow admin to delete channels', () => {
        const channel_name = Math.random().toString(36).substring(2, 30);
        cy.createChannel(channel_name);
        cy.get('.chat-list')
        .contains(channel_name) 
        .click();
        cy.get('.dropdown-container').click();
        cy.get('.dropdown-menu > :nth-child(3)').click();
  
        cy.reload();
  
        cy.get('.chat-list')
        .contains(channel_name).should('not.exist');
      });
  
      it('should allow admin to make users admins', () => {
        const channel_name = Math.random().toString(36).substring(2, 30);
        cy.createChannel(channel_name);
        cy.get('.chat-list')
        .contains(channel_name) 
        .click();
        cy.get('.header-details').click();
        cy.get('.members-list > :nth-child(2) > .svg-inline--fa').click();
        cy.get('.absolute > :nth-child(1)').click();
  
        cy.Logout();
  
        cy.Login(WUT, users.user2.email, users.user2.password);
        cy.wait(2000)
  
        cy.get('.chat-list')
        .contains(channel_name).click();
        cy.get('.header-details').click();
        cy.get('.members-list > :nth-child(3) > .svg-inline--fa').click();
        cy.get('.absolute > :nth-child(2)').should('exist');
      });
  
          it('should allow admin to remove users', () => {
        const channel_name = Math.random().toString(36).substring(2, 30);
        cy.createChannel(channel_name);
        cy.get('.chat-list')
        .contains(channel_name) 
        .click();
        cy.get('.header-details').click(); // Open group settings
        cy.get('.members-list > :nth-child(2) > .svg-inline--fa').click();
        cy.get('.absolute > :nth-child(2)').click();
  
        cy.Logout();
  
        cy.Login(WUT, users.user2.email, users.user2.password);
  
        cy.get('.chat-list')
        .contains(channel_name).should('not.exist');
      });
    
      it('should allow admin to add users', () => {
        const channel_name = Math.random().toString(36).substring(2, 30);
        cy.createChannel(channel_name);
        cy.get('.chat-list')
        .contains(channel_name) 
        .click();
        cy.get('.header-details').click(); // Open group settings
        cy.get('[data-testid="add-button"] > .svg-inline--fa').click();
        cy.get('.user-list > :nth-child(3)').click();
        cy.contains('Add 1 Subscriber').click();
  
        cy.Logout();
  
        cy.Login(WUT, "alia29@hotmail.com", users.user2.password);
        cy.get('.chat-list')
        .contains(channel_name).should('exist');
      });
    
      // it('should allow admin to mute notifications', () => {
      //   const channel_name = Math.random().toString(36).substring(2, 30);
      //   cy.createChannel(channel_name);
      //   cy.get('.chat-list')
      //   .contains(channel_name) 
      //   .click();
      //   cy.get('.dropdown-container').click();
      //   cy.get('.dropdown-menu > :nth-child(1)').click();
      //   cy.wait(10000);
      // });
    
      it('should allow group search', () => {
        cy.contains('awy').click();
        cy.get('.fa-magnifying-glass').click();
        cy.get('.mb-6 > .search-bar').type('Veniam{enter}');
        cy.get('.message-search-result > .message-container')
        .contains('Aequitas').should('be.visible');
      });
      
  
    });
  
  });