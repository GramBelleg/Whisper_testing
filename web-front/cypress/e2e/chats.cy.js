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
        cy.get('.chat-list')
        .contains(users.user2.username).click();
        cy.get('[data-testid="text-input"]').type(message);
        cy.get('.voice-send-container').click();
        cy.wait(4000);
        cy.contains(message).should("be.visible");
        
        cy.Logout();

        cy.Login(WUT, users.user2.email, users.user2.password)
        
        cy.get('.chat-list')
        .contains(users.user1.username).click();
        cy.reload();
        cy.get('.chat-list')
        .contains(users.user1.username).click();
        cy.contains(message).should("be.visible");
      });


      it('sending a long message', () => {
        cy.readFile('cypress/fixtures/long_text.txt').then((long_message) => {
          cy.get('.chat-list')
          .contains(users.user2.username).click();
          cy.get('[data-testid="text-input"]').type(long_message);
          cy.get('.voice-send-container').click();
          cy.contains(long_message).should("be.visible");
          
          cy.Logout();

          cy.Login(WUT, users.user2.email, users.user2.password)

          cy.reload();

          cy.get('.chat-list')
          .contains(users.user1.username).click();
          cy.contains(long_message).should("be.visible");
        });
      });

      it('send files and be recieved', () => {
        cy.get('.chat-list')
        .contains(users.user2.username).click();
        cy.get('[data-testid="attach-icon"]').click();
        const filePath = "cypress/fixtures/test_image.jpg";
        cy.get('[data-testid="attach-menu"] > :nth-child(2)').selectFile(filePath, { force: true });
        cy.get('.voice-send-container').click();
  
        cy.get('.image-container img')
        .invoke('attr', 'src')
        .then((src) => {
  
          cy.log('Image src:', src);
          
          cy.Logout();

          cy.Login(WUT, users.user2.email, users.user2.password)

          cy.get('.chat-list')
          .contains(users.user1.username).click();
          cy.get('.image-container img')
          .invoke('attr', 'src')
          .then((src_) => {
            if (src_ !== src) {
              cy.screenshot();
              throw new Error('image didnt deliver !');
            } else {
              expect(value.length).to.be.lessThan(500);
            }
          });
  
        });
  
  
  
      });

  
  
  
    });
  
  });