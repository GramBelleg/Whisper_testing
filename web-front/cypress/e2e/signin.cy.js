describe('Sign in tests', () => {
  const WUT = "http://localhost:5173/login" // website under test

  let users


  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
  });
  
  describe('Wrong sign-in formats', () => {

    it('empty sign-in fields', { timeout: 10000 }, () => {
      cy.visit(WUT);
      cy.get("#login-btn").click();
      cy.get("#error-email").contains("Email is required");
      cy.get("#error-password").contains("Password is required");
    });
    
    it('Wrong short password', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type(users.user1.email);
      cy.get("#password").type("wrong1");
      cy.get("#login-btn").click();
      cy.get("#error-password").contains("Password must be at least 8 characters")
    })

    it('Wrong email with spaces', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type("not a valid email");
      cy.get("#password").type("wrongbutmorethan8characters");
      cy.get("#login-btn").click();
      cy.get("#error-email").contains("Invalid email address")
    })

    it('Wrong email with not @', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type("emailThatHasNoSapcesButNoAtSign");
      cy.get("#password").type("wrongbutmorethan8characters");
      cy.get("#login-btn").click();
      cy.get("#error-email").contains("Invalid email address")
    })

    it('Wrong email with no domain', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type("emailThatHasNoSapcesAndHasAn@");
      cy.get("#password").type("wrongbutmorethan8characters");
      cy.get("#login-btn").click();
      cy.get("#error-email").contains("Invalid email address")
    })

    it('Wrong email with no domain but with a .com', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type("emailThatHasNoSapcesAndHasAn@.com");
      cy.get("#password").type("wrongbutmorethan8characters");
      cy.get("#login-btn").click();
      cy.get("#error-email").contains("Invalid email address")
    })

    it('too long email', { timeout: 10000 }, () => {
      cy.visit(WUT);
      cy.get("#email").type("a".repeat(256) + "@grambell.com"); 
      cy.get("#password").type("correctPassword1");
      cy.get("#login-btn").click();
      cy.get("#error-email").contains("Invalid email address");
    });
    
    

  })

  describe('correct sign-in formats', () => {

    it('email with special characters', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type("Email-with.spicial_characters+~'!#$%&^*?@grambell.com");
      cy.get("#password").type("correctPassword1");
      cy.get("#login-btn").click();
      cy.get("#error-email").should("not.exist");
    })

    it('email with special domains', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type("EmailWithSpecialDomains@gram-bell.eg.edu");
      cy.get("#password").type("correctPassword1");
      cy.get("#login-btn").click();
      cy.get("#error-email").should("not.exist");
    })
    it('email case sensitivity', { timeout: 10000 }, () => {
      cy.visit(WUT);
      cy.get("#email").type(users.user1.email);
      cy.get("#password").type("correctPassword1");
      cy.get("#login-btn").click();
      cy.get("#error-email").should('not.exist');
    });

    it('password masking', { timeout: 10000 }, () => {
      cy.visit(WUT);
      cy.get("#password").type("password123");
      cy.get("#password").should('have.attr', 'type', 'password');
    });
    
    it('password visibility toggle', { timeout: 10000 }, () => {
      cy.visit(WUT);
      cy.get("#password").type("password123");
      cy.get("#password-toggle").click();
      cy.get("#password").should('have.attr', 'type', 'text');
    });

    it('error message disappears on valid input', { timeout: 10000 }, () => {
      cy.visit(WUT);
      cy.get("#email").type("not a valid email");
      cy.get("#password").type("short");
      cy.get("#login-btn").click();
      cy.get("#error-email").should('exist');
      cy.get("#email").clear().type(users.user1.email);
      cy.get("#password").clear().type(users.user1.password);
      cy.get("#login-btn").click();
      cy.get("#error-email").should('not.exist');
      cy.get("#error-password").should('not.exist');
    });
    
  })


  describe('missing sign in fields', () => {
    it('email with no password', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type(users.user1.email);
      cy.get("#login-btn").click();
      cy.get("#error-password").contains("Password is required")
    })

    it('password with no email', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#password").type("wrongbutmorethan8characters");
      cy.get("#login-btn").click();
      cy.get("#error-email").contains("Email is required")
    })
  })

  describe('wrong sign in info', () => {
    it('Wrong email', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type("notgrambell.whisper@gmail.com");
      cy.get("#password").type("wrongggggg1");
      cy.get("#login-btn").click();
    })

    it('Wrong password', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type(users.user1.email);
      cy.get("#password").type("wrongggggg1");
      cy.get("#login-btn").click();
    })
  })

  describe('correct sign in', () => {
    it('sign in', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type(users.user1.email);
      cy.get("#password").type(users.user1.password);
      cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
      cy.url().should('eq','http://localhost:5173/');
    })

    it('sign out', { timeout: 10000 },() => {
      cy.visit(WUT);
      cy.get("#email").type(users.user1.email);
      cy.get("#password").type(users.user1.password);
      cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
      cy.url().should('eq','http://localhost:5173/');
      cy.get('[data-testid="logout-icon"]').click();
      cy.get('#logout-ok-btn').click();
      cy.url().should('eq','http://localhost:5173/login');
    })
  })
})
