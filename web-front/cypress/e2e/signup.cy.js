describe('coreect sign up', () => {

  const WUT = "http://localhost:5173/signup" // website under test

  // Cypress.on('fail', (error, runnable) => {
  //   // Log the error, but continue the test run
  //   console.error('Test failed:', runnable.title);
  //   // Returning `false` prevents the test from failing and stops Cypress from terminating the test suite
  //   return false;
  // });

  it('coreect sign up', { timeout: 10000 },() => {
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

  it('sign up with an existing email', { timeout: 10000 }, () => {
    cy.Signup(WUT).then((existingToken) => {
      cy.Logout(WUT);
      const exisiting_email = `${existingToken}@email.webhook.site`;
      cy.GetToken().then((token) => {
        const sanitizedToken = token.replace(/-/g, "");
        cy.visit(WUT);
        cy.get("#name").type("grambell");
        cy.get("#userName").type(`${sanitizedToken}`);
        cy.get("#email").type(exisiting_email);
        cy.get("#password").type("Goodpassword1");
        cy.get("#confirmPassword").type("Goodpassword1");
        cy.GeneratePhoneNumber().then((phoneNumber) => {
          cy.get('.phone-input').clear();
          cy.get('.phone-input').type(phoneNumber);
        });
        cy.get("#signup-btn").click();
        cy.wait(3000);
        cy.contains("already exists").should("be.visible");
      });
    });
  });

  it('sign up with an existing username', { timeout: 10000 }, () => {
    cy.Signup(WUT).then((existingToken) => {
      cy.Logout(WUT);
      cy.GetToken().then((token) => {
        const sanitizedToken = existingToken.replace(/-/g, "");
        cy.visit(WUT);
        cy.get("#name").type("grambell");
        cy.get("#userName").type(`${sanitizedToken}`);
        cy.get("#email").type(`${token}@email.webhook.site`);
        cy.get("#password").type("Goodpassword1");
        cy.get("#confirmPassword").type("Goodpassword1");
        cy.GeneratePhoneNumber().then((phoneNumber) => {
          cy.get('.phone-input').clear();
          cy.get('.phone-input').type(phoneNumber);
        });
        cy.get("#signup-btn").click();
        cy.wait(3000);
        cy.contains("already exists").should("be.visible");
      });
    });
  });

  it('sign up with an existing phone number', { timeout: 10000 }, () => {
    cy.GeneratePhoneNumber().then((phoneNumber) => {
      cy.GetToken().then((token) => {
        const sanitizedToken = token.replace(/-/g, "");
        cy.visit(WUT);
        cy.get("#name").type("grambell");
        cy.get("#userName").type(`${sanitizedToken}`);
        const TestEmail = `${token}@email.webhook.site`;
        cy.get("#email").type(TestEmail);
        cy.get("#password").type("Goodpassword1");
        cy.get("#confirmPassword").type("Goodpassword1");
        cy.get('.phone-input').clear();
        cy.get('.phone-input').type(phoneNumber);
        cy.get("#signup-btn").click();
        cy.wait(8000);
        cy.GetVerificationCode(token).then((code) => {
          cy.log('code!!!!', code);
          cy.get('#code').type(code);
          cy.get('[data-testid]').click();
        });
      });
      cy.Logout(WUT);

      //sign up again with the same random phone number
      cy.GetToken().then((token) => {
        const sanitizedToken = token.replace(/-/g, ""); 
        cy.visit(WUT);
        cy.get("#name").type("grambell");
        cy.get("#userName").type(`${sanitizedToken}`);
        const TestEmail = `${token}@email.webhook.site`;
        cy.get("#email").type(TestEmail);
        cy.get("#password").type("Goodpassword1");
        cy.get("#confirmPassword").type("Goodpassword1");
        cy.get('.phone-input').clear();
        cy.get('.phone-input').type(phoneNumber);
        cy.get("#signup-btn").click();
        cy.contains("already exists").should("be.visible");
      });
    });
  });

  it('sign up with mismatched passwords', { timeout: 10000 }, () => {
    cy.GetToken().then((token) => {
      const sanitizedToken = token.replace(/-/g, "");
      cy.visit(WUT);
      cy.get("#name").type("passwordfail");
      cy.get("#userName").type(`${sanitizedToken}`);
      const TestEmail = `${token}@email.webhook.site`;
      cy.get("#email").type(TestEmail);
      cy.get("#password").type("Goodpassword1");
      cy.get("#confirmPassword").type("Wrongpassword1");
      cy.GeneratePhoneNumber().then((phoneNumber) => {
        cy.get('.phone-input').clear();
        cy.get('.phone-input').type(phoneNumber);
      });
      cy.get("#signup-btn").click();
      cy.wait(3000);
      cy.contains("Passwords must match").should("be.visible");
    });
  });

  it('sign up with missing fields', { timeout: 10000 }, () => {
    cy.visit(WUT);
    cy.get("#signup-btn").click();
    cy.wait(1000);
    cy.contains("Name is required").should("be.visible");
    cy.contains("User name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password is required").should("be.visible");
    cy.contains("Phone number is required").should("be.visible");
  });

  it('sign up with invalid email format', { timeout: 10000 }, () => {
    cy.GetToken().then((token) => {
      const sanitizedToken = token.replace(/-/g, "");
      cy.visit(WUT);
      cy.get("#name").type("invalidemail");
      cy.get("#userName").type(`${sanitizedToken}`);
      cy.get("#email").type("invalidemailformat");
      cy.get("#password").type("Goodpassword1");
      cy.get("#confirmPassword").type("Goodpassword1");
      cy.GeneratePhoneNumber().then((phoneNumber) => {
        cy.get('.phone-input').clear();
        cy.get('.phone-input').type(phoneNumber);
      });
      cy.get("#signup-btn").click();
      cy.wait(1000);
      cy.contains("Please enter a valid email").should("be.visible");
    });
  });

  

  it('sign up with invalid phone number', { timeout: 10000 }, () => {
    cy.GetToken().then((token) => {
      const sanitizedToken = token.replace(/-/g, "");
      cy.visit(WUT);
      cy.get("#name").type("invalidphone");
      cy.get("#userName").type(`${sanitizedToken}`);
      const TestEmail = `${token}@email.webhook.site`;
      cy.get("#email").type(TestEmail);
      cy.get("#password").type("Goodpassword1");
      cy.get("#confirmPassword").type("Goodpassword1");
      cy.get('.phone-input').clear();
      cy.get('.phone-input').type("12345"); // Invalid phone number
      cy.get("#signup-btn").click();
      cy.wait(3000);
      cy.contains("Phone number can't be shorter than 10 characters").should("be.visible");
    });
  });

  it('validate username requirements', { timeout: 10000 }, () => {
    cy.GetToken().then((token) => {
      const sanitizedToken = token.replace(/-/g, "");
      const TestEmail = `${token}@email.webhook.site`;
  
      const invalidUsernames = [
        { username: "short", error: "User name must be at least 8 characters" }, 
        { username: "a".repeat(51), error: "name must be at most 50 characters" },
        { username: "invalid@char", error: "User name can only contain letters and numbers" }, 
        { username: "space in username", error: "User name can only contain letters and numbers" }, 
        { username: "validUsername", error: null } 
      ];
  
      cy.visit(WUT);
  
      invalidUsernames.forEach((testCase) => {
        cy.log(`Testing username: ${testCase.username}`);
  
        cy.get("#name").clear().type("usernameTester");
        cy.get("#userName").clear().type(testCase.username);
        cy.get("#email").clear().type(TestEmail);
        cy.get("#password").clear().type("Goodpassword1!");
        cy.get("#confirmPassword").clear().type("Goodpassword1!");
        cy.GeneratePhoneNumber().then((phoneNumber) => {
          cy.get('.phone-input').clear().type(phoneNumber);
        });
  
        cy.get("#signup-btn").click();
        cy.wait(1000);
  
        if (testCase.error) {
          cy.contains(testCase.error).should("be.visible");
        } else {
          cy.contains("Username must").should("not.exist"); // Ensures no error appears for valid username
        }
      });
    });
  });
  
  
  it('validate password requirements', { timeout: 10000 }, () => {
    cy.GetToken().then((token) => {
      const sanitizedToken = token.replace(/-/g, "");
      const TestEmail = `${token}@email.webhook.site`;
  
      const invalidPasswords = [
        { password: "short", error: "password must be at least 8 characters" },
        { password: "alllowercase", error: "Password must include both uppercase and lowercase letters." },
        { password: "ALLUPPERCASE", error: "Password must include both uppercase and lowercase letters." },
        { password: "NoNumberHere", error: "Password must include at least one number" },
        { password: "NoSpecial1", error: "Password must include at least one special character" },
        { password: "Goodpassword1!", error: null }
      ];
  
      cy.visit(WUT);
  
      invalidPasswords.forEach((testCase) => {
        cy.log(`Testing password: ${testCase.password}`);
  
        cy.get("#name").clear().type("passwordTester");
        cy.get("#userName").clear().type(sanitizedToken);
        cy.get("#email").clear().type(TestEmail);
        cy.get("#password").clear().type(testCase.password);
        cy.get("#confirmPassword").clear().type(testCase.password);
        cy.GeneratePhoneNumber().then((phoneNumber) => {
          cy.get('.phone-input').clear().type(phoneNumber);
        });
  
        cy.get("#signup-btn").click();
        cy.wait(1000);
  
        if (testCase.error) {
          cy.contains(testCase.error).should("be.visible");
        } else {
          cy.contains("Password must").should("not.exist");
        }
      });
    });
  });
  
  


})