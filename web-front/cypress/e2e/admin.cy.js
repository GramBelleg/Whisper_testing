describe('admin', () => {
  const WUT = "http://localhost:5173/login" // website under test
  let users
  let groups


  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });

    cy.fixture('groups').then((data) => {
        groups = data;
      });
  });

  beforeEach(() => {
    cy.visit(WUT);
    cy.get("#email").type(users.user_admin.email);
    cy.get("#password").type(users.user_admin.password);
    cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
    cy.url().should('eq','http://localhost:5173/dashboard');
    cy.wait(1000);
    cy.reload();
  });


  describe('Groups - testing functionality', () => { 
    const bad_word = "fack";

    it('testing content filltering', () => {

        cy.get('[data-testid="all-groups-icon"]').click();
        cy.get('.group-list > :nth-child(1)').rightclick();
        cy.get('[data-testid="toggle-filter-button"]').click();

        cy.Logout();

        cy.Login(WUT, users.user2.email, users.user2.password);

        cy.contains(groups.group1.name).click();
        cy.get('[data-testid="text-input"]').type(bad_word);
        cy.get('.voice-send-container').click();
        //   cy.get('.error-message').should('exist');
        cy.wait(4000);
        cy.contains(bad_word).should('not.exist');

    });

    it('testing removing content filltering', () => {
        
        cy.get('[data-testid="all-groups-icon"]').click();
        cy.get('.group-list > :nth-child(1)').rightclick();
        cy.get('[data-testid="toggle-filter-button"]').click();

        cy.reload();

        cy.get('[data-testid="all-groups-icon"]').click();
        cy.get('.group-list > :nth-child(1)').rightclick();
        cy.get('[data-testid="toggle-filter-button"]').click();

        cy.Logout();

        cy.Login(WUT, users.user2.email, users.user2.password);

        cy.contains(groups.group1.name).click();
        cy.get('[data-testid="text-input"]').type(bad_word);
        cy.get('.voice-send-container').click();
        //   cy.get('.error-message').should('exist');
        cy.wait(4000);
        cy.contains(bad_word).should('exist');

    });
    it('testing searching', () => {
        cy.get('[data-testid="all-groups-icon"]').click();
        cy.get('.search-input').type(groups.group1.name);
        cy.get('.group-list')
        .contains(groups.group1.name).should('exist');

    });

  });


  describe('Users - testing functionality', () => { 

    it('testing banning', () => {

        cy.get('[data-testid="all-users-icon"]').click();
        cy.get('.user-list')
        .contains(users.user2.email).rightclick();
        cy.get('[data-testid="toggle-ban-button"]').click();

        cy.Logout();

        cy.visit(WUT)
        cy.get("#email").type(users.user2.email);
        cy.get("#password").type(users.user2.password);
        cy.get("#login-btn").click();

        cy.contains("suspended");

    });


    it('testing unbanning', () => {
        cy.get('[data-testid="all-users-icon"]').click();
        cy.get('.user-list')
        .contains(users.user2.email).rightclick();
        cy.get('[data-testid="toggle-ban-button"]').click();

        cy.reload();

        cy.get('[data-testid="all-users-icon"]').click();
        cy.get('.user-list')
        .contains(users.user2.email).rightclick();
        cy.get('[data-testid="toggle-ban-button"]').click();

        cy.Logout();

        cy.Login(WUT, users.user2.email, users.user2.password);

    });

    it('testing searching', () => {
        cy.get('[data-testid="all-users-icon"]').click();
        cy.get('.search-input').type(users.user2.name);
        cy.get('.user-list')
        .contains(users.user2.name).should('exist');

    });

  });

});