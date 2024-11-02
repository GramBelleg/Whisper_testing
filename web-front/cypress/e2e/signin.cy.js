describe('Wrong sign in formats', () => {
  it('Wrong password format', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#email").type("grambell.whisper@gmail.com");
    cy.get("#password").type("wrong1");
    cy.get("#login-btn").click();
    cy.get("#error-password").contains("Password must be at least 8 characters")
  })

  it('Wrong email format 1', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#email").type("not a valid email");
    cy.get("#password").type("wrongbutmorethan8characters");
    cy.get("#login-btn").click();
    cy.get("#error-email").contains("Invalid email address")
  })

  it('Wrong email format 2', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#email").type("emailThatHasNoSapcesButNoAtSign");
    cy.get("#password").type("wrongbutmorethan8characters");
    cy.get("#login-btn").click();
    cy.get("#error-email").contains("Invalid email address")
  })

  it('Wrong email format 3', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#email").type("emailThatHasNoSapcesAndHasAn@");
    cy.get("#password").type("wrongbutmorethan8characters");
    cy.get("#login-btn").click();
    cy.get("#error-email").contains("Invalid email address")
  })

  it('Wrong email format 4', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#email").type("emailThatHasNoSapcesAndHasAn@.com");
    cy.get("#password").type("wrongbutmorethan8characters");
    cy.get("#login-btn").click();
    cy.get("#error-email").contains("Invalid email address")
  })

})


describe('missing sign in fields', () => {
  it('email with no password', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#email").type("grambell.whisper@gmail.com");
    cy.get("#login-btn").click();
    cy.get("#error-password").contains("Password is required")
  })

  it('password with no email', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#password").type("wrongbutmorethan8characters");
    cy.get("#login-btn").click();
    cy.get("#error-email").contains("Email is required")
  })
})

describe('wrong sign in info', () => {
  it('Wrong email', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#email").type("notgrambell.whisper@gmail.com");
    cy.get("#password").type("wrongggggg1");
    cy.get("#login-btn").click();
  })

  it('Wrong password', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#email").type("grambell.whisper@gmail.com");
    cy.get("#password").type("wrongggggg1");
    cy.get("#login-btn").click();
  })
})

describe('correct sign in', () => {
  it('sign in', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#email").type("grambell.whisper@gmail.com");
    cy.get("#password").type("12345678kK");
    cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
    cy.url().should('eq','http://localhost:5173/');
  })

  it('sign out', { timeout: 10000 },() => {
    cy.visit("http://localhost:5173/login");
    cy.get("#email").type("grambell.whisper@gmail.com");
    cy.get("#password").type("12345678kK");
    cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
    cy.url().should('eq','http://localhost:5173/');
    cy.get('[data-testid="logout-icon"]').click();
    cy.get('#logout-ok-btn').click();
    cy.url().should('eq','http://localhost:5173/login');
  })
})
