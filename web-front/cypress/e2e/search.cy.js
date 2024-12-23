describe('search', () => {
  const WUT = "http://localhost:5173/login" // website under test
  let users
  let groups
  let text


  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });

    cy.fixture('groups').then((data) => {
      groups = data;
    });

    cy.fixture('text').then((data) => {
      text = data;
    });
  });

  beforeEach(() => {
    cy.Login(WUT, users.user1.email, users.user1.password);
  });


  describe('text - testing functionality', () => {

    // it('testing existent text', () => {

    //   cy.get('[data-testid="search-input-test"]').click();
    //   cy.get('.filters-search > :nth-child(2)').click();
    //   cy.get('[data-testid="search-input-test"]').type("Coerceo{enter}");
    //   cy.get('.message-search-result')
    //   .contains(text.text1.content).should('exist');

    // });

    // it('testing existent text', () => {

    //   cy.get('[data-testid="search-input-test"]').click();
    //   cy.get('.filters-search > :nth-child(2)').click();
    //   cy.get('[data-testid="search-input-test"]').type("coerceo{enter}");
    //   cy.get('.message-search-result')
    //   .contains(text.text1.content).should('exist');

    // });

    // it('testing non-existent text', () => {

    //   cy.get('[data-testid="search-input-test"]').click();
    //   cy.get('.filters-search > :nth-child(2)').click();
    //   cy.get('[data-testid="search-input-test"]').type("doesn,t exist text{enter}");
    //   cy.get('.message-search-result').should('not.exist');

    // });

    


    // it('testing navegation text', () => {

    //   cy.get('[data-testid="search-input-test"]').click();
    //   cy.get('.filters-search > :nth-child(2)').click();
    //   cy.get('[data-testid="search-input-test"]').type(text.text1.content+"{enter}");
    //   cy.get('.message-search-result')
    //   .contains(text.text1.content).click();
    //   cy.get('.single-chat-header')
    //   .contains(groups.group1.name).should('exist');

    // });
  });



  describe('chats - testing functionality', () => {

    it('testing existent chat', () => {

      cy.get('[data-testid="search-input-test"]').click();
      cy.get('.filters-search > :nth-child(1)').click();
      cy.get('[data-testid="search-input-test"]').type(groups.group1.name+"{enter}");
      cy.get('[data-testid="chat-item"]')
      .contains(groups.group1.name).should('exist');

    });

    it('testing non-existent chat', () => {

      cy.get('[data-testid="search-input-test"]').click();
      cy.get('.filters-search > :nth-child(2)').click();
      cy.get('[data-testid="search-input-test"]').type("doesn,t exist text{enter}");
      cy.get('[data-testid="chat-item"]').should('not.exist');

    });

    


    it('testing navegation chat', () => {

      cy.get('[data-testid="search-input-test"]').click();
      cy.get('.filters-search > :nth-child(1)').click();
      cy.get('[data-testid="search-input-test"]').type(groups.group1.name+"{enter}");
      cy.get('[data-testid="chat-item"]')
      .contains(groups.group1.name).click();
      cy.get('.single-chat-header')
      .contains(groups.group1.name).should('exist');

    });


    describe('chats - testing functionality', () => {

      it('testing existent chat', () => {
  
        cy.get('[data-testid="search-input-test"]').click();
        cy.get('.filters-search > :nth-child(1)').click();
        cy.get('[data-testid="search-input-test"]').type(groups.group1.name+"{enter}");
        cy.get('[data-testid="chat-item"]')
        .contains(groups.group1.name).should('exist');
  
      });
  
      it('testing non-existent chat', () => {
  
        cy.get('[data-testid="search-input-test"]').click();
        cy.get('.filters-search > :nth-child(2)').click();
        cy.get('[data-testid="search-input-test"]').type("doesn,t exist text{enter}");
        cy.get('[data-testid="chat-item"]').should('not.exist');
  
      });
  
  
      it('testing navegation chat', () => {
  
        cy.get('[data-testid="search-input-test"]').click();
        cy.get('.filters-search > :nth-child(1)').click();
        cy.get('[data-testid="search-input-test"]').type(groups.group1.name+"{enter}");
        cy.get('[data-testid="chat-item"]')
        .contains(groups.group1.name).click();
        cy.get('.single-chat-header')
        .contains(groups.group1.name).should('exist');
  
      });

    });
  });

});