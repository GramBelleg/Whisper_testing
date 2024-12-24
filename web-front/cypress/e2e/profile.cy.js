

describe('editing profile', () => {
  const WUT = "http://localhost:5173/login" // website under test
  const master_token = "025f51d6-0945-4af2-8755-a87f0f11fe21"
  const test_Email = `${master_token}@email.webhook.site`
  const html_injection = "<script>alert('test');</script>"
  let users


  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
  });

  beforeEach(() => {
    cy.visit(WUT);
    cy.get("#email").type(users.user3.email);
    cy.get("#password").type(users.user3.password);
    cy.get("#login-btn").click(); // TODO CHECK IF LOGGED IN SUCCESSFULLY
    cy.url().should('eq','http://localhost:5173/');
  });

  describe('BIO', () => { 
    const bio = "Very Good Bio with numbers12345 and symbols !@#$%^&*()_+.,"
    const html_injection = "<script>alert('test');</script>"

    it('testing funcitionality', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-bio"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="bio"]').clear();
      cy.get('[data-testid="bio"]').type(bio);
      cy.get('[data-testid="button-save-edit"]').click();
    });

    it('long bio', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-bio"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="bio"]').clear();
      cy.readFile('cypress/fixtures/long_text.txt').then((long_bio) => {
        cy.get('[data-testid="bio"]').type(long_bio);
      });
      cy.get('[data-testid="bio"]')
      .invoke('val')
      .then((value) => {
        if (value.length > 500) {
          cy.screenshot();
          throw new Error('Bio can be more that 500 characters!');
        } else {
          expect(value.length).to.be.lessThan(500);
        }
      // cy.get('[data-testid="button-save-edit"]').click();
      });
    });

    it('bio saving', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-bio"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="bio"]').clear();
      cy.get('[data-testid="bio"]').type(bio);
      cy.get('[data-testid="button-save-edit"]').click();

      cy.Logout();

      cy.Login(WUT, users.user3.email, users.user3.password);

      // check bio
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-bio"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="bio"]')
      .invoke('val')
      .then((value) => {
        if (value !== bio) {
          cy.screenshot();
          throw new Error('Bio was not saved!');
        } else {
          expect(value).to.equal(bio); 
        }
      });

    });

    it('html injection', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-bio"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="bio"]').clear();
      cy.get('[data-testid="bio"]').type(html_injection);
      cy.get('[data-testid="button-save-edit"]').click();
      cy.get('[data-testid="button-edit-bio"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="bio"]')
      .invoke('val')
      .then((value) => {
        if (value === html_injection) {
          cy.screenshot();
          throw new Error('Bio field contains HTML injection!');
        } else {
          expect(value).to.not.equal(html_injection); 
        }
      });
    });

  });

  describe('Name', () => {

    const good_name = "grambell kilobell tonbell"
    const html_injection = "<script>alert('test');</script>"

    it('testing funcitionality', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-name"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="name"]').clear();
      cy.get('[data-testid="name"]').type(good_name);
      cy.get('[data-testid="button-save-edit"]').click();
    });

    it('long name', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-name"]').click();
      cy.get('[data-testid="name"]').clear();
      cy.readFile('cypress/fixtures/long_text.txt').then((long_name) => {
        cy.get('[data-testid="name"]').type(long_name);
      });
      cy.get('[data-testid="name"]')
      .invoke('val')
      .then((value) => {
        if (value.length <= 500) {
          cy.screenshot();
          throw new Error('Name can be more that 500 characters!');
        } else {
          expect(value.length).to.be.lessThan(500);
        }
      cy.get('[data-testid="button-save-edit"]').click();
      });
    });

    it('name saving', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-name"]').click();
      cy.get('[data-testid="name"]').clear();
      cy.get('[data-testid="name"]').type(good_name);
      cy.get('[data-testid="button-save-edit"]').click();

      cy.Logout();

      cy.Login(WUT, users.user3.email, users.user3.password);
      // check bio
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-name"]').click();
      cy.get('[data-testid="name"]')
      .invoke('val')
      .then((value) => {
        if (value !== good_name) {
          cy.screenshot();
          throw new Error('Name was not saved!');
        } else {
          expect(value).to.equal(good_name);
        }
      });

    });

    it('html injection', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-name"]').click();
      cy.get('[data-testid="name"]').clear();
      cy.get('[data-testid="name"]').type(html_injection);
      cy.get('[data-testid="button-save-edit"]').click();
      // cy.get('[data-testid="button-edit-name"]').click();
      cy.get('[data-testid="name"]')
      .invoke('val')
      .then((value) => {
        if (value === html_injection) {
          cy.screenshot();
          throw new Error('Name field contains HTML injection!');
        } else {
          expect(value).to.not.equal(html_injection); // Regular assertion
        }
      });
    });

  });

  describe('UserName', () => {

    const good_user_name = "grambell13"
    const short_user_name = "gram"
    const bad_user_name = "a_Name_that_contains-all!sort@of=$Pecial%characters"
    const spaced_user_name = "a name that contains spaces"
    const html_injection = "<script>alert('test');</script>"

    it('testing funcitionality', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-userName"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="userName"]').clear();
      cy.get('[data-testid="userName"]').type(good_user_name);
      cy.get('[data-testid="button-save-edit"]').click();
    });

    it('less than 8 characters', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-userName"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="userName"]').clear();
      cy.get('[data-testid="userName"]').type(short_user_name);
      cy.get('[data-testid="button-save-edit"]').click();
      // cy.get('[data-testid="button-edit-userName"]').click();
      cy.get('[data-testid="userName"]')
      .invoke('val')
      .then((value) => {
        if (value === short_user_name) {
          cy.screenshot();
          throw new Error('username accepts less than 8 characters!');
        } else {
          expect(value).to.not.equal(short_user_name); // Regular assertion
        }
      });
    });

    it('long name', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-userName"]').click();
      cy.get('[data-testid="userName"]').clear();
      cy.readFile('cypress/fixtures/long_text.txt').then((long_userName) => {
        cy.get('[data-testid="userName"]').type(long_userName);
      });
      cy.get('[data-testid="userName"]')
      .invoke('val')
      .then((value) => {
        if (value.length <= 500) {
          cy.screenshot();
          throw new Error('userName can be more than 500 characters!');
        } else {
          expect(value.length).to.be.lessThan(500);
        }
      cy.get('[data-testid="button-save-edit"]').click();
      });
    });

    it('special characters', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-userName"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="userName"]').clear();
      cy.get('[data-testid="userName"]').type(bad_user_name);
      cy.get('[data-testid="button-save-edit"]').click();
      // cy.get('[data-testid="button-edit-userName"]').click();
      cy.get('[data-testid="userName"]')
      .invoke('val')
      .then((value) => {
        if (value === bad_user_name) {
          cy.screenshot();
          throw new Error('username accepts special characters!');
        } else {
          expect(value).to.not.equal(bad_user_name); // Regular assertion
        }
      });
    });

    it('spaces', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-userName"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="userName"]').clear();
      cy.get('[data-testid="userName"]').type(spaced_user_name);
      cy.get('[data-testid="button-save-edit"]').click();
      // cy.get('[data-testid="button-edit-userName"]').click();
      cy.get('[data-testid="userName"]')
      .invoke('val')
      .then((value) => {
        if (value === spaced_user_name) {
          cy.screenshot();
          throw new Error('username accepts spaces!');
        } else {
          expect(value).to.not.equal(spaced_user_name); // Regular assertion
        }
      });
    });

    it('userName saving', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-userName"]').click();
      cy.get('[data-testid="userName"]').clear();
      cy.get('[data-testid="userName"]').type(good_user_name);
      cy.get('[data-testid="button-save-edit"]').click();

      cy.Logout();

      cy.Login(WUT, users.user3.email, users.user3.password);
      // check bio
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-userName"]').click();
      cy.get('[data-testid="userName"]')
      .invoke('val')
      .then((value) => {
        if (value !== good_user_name) {
          cy.screenshot();
          throw new Error('userName was not saved!');
        } else {
          expect(value).to.equal(good_user_name);
        }
      });

    });

    it('html injection', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-userName"]').click();
      cy.get('[data-testid="userName"]').clear();
      cy.get('[data-testid="userName"]').type(html_injection);
      cy.get('[data-testid="button-save-edit"]').click();
      // cy.get('[data-testid="button-edit-userName"]').click();
      cy.get('[data-testid="userName"]')
      .invoke('val')
      .then((value) => {
        if (value === html_injection) {
          cy.screenshot();
          throw new Error('username field contains HTML injection!');
        } else {
          expect(value).to.not.equal(html_injection); // Regular assertion
        }
      });
    });

  });

  describe('phone number', () => {

    const good_name = "grambell kilobell tonbell"
    const html_injection = "<script>alert('test');</script>"

    it('testing funcitionality', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-phoneNumber"]').click();
      cy.GeneratePhoneNumber().then((phoneNumber) => {
        cy.get('[data-testid="phone-phoneNumber"]').clear();
        cy.get('[data-testid="phone-phoneNumber"]').type(phoneNumber);
        
        cy.get('[data-testid="button-save-edit"]').click();

        cy.Logout();

        cy.Login(WUT, users.user3.email, users.user3.password);
        // check bio
        cy.get('.w-12').click();
        cy.get('[data-testid="button-edit-phoneNumber"]').click();
        cy.get('[data-testid="phone-phoneNumber"]')
        .invoke('val')
        .then((value) => {
          if (value !== phoneNumber) {
            cy.screenshot();
            throw new Error('phoneNumber was not saved!');
          } else {
            expect(value).to.equal(phoneNumber);
          }
        });
      });
    });

    it('bad number', () => {
      const phoneNumber = "922292929292929292"
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-phoneNumber"]').click();
   
      cy.get('[data-testid="phone-phoneNumber"]').clear();
      cy.get('[data-testid="phone-phoneNumber"]').type(phoneNumber);
      
      cy.get('[data-testid="button-save-edit"]').click();
      cy.wait(2000);
      cy.contains("Phone number structure is not valid").should("exist");

    });

    it('html injection', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-phoneNumber"]').click();
      cy.get('[data-testid="phone-phoneNumber"]').clear();
      cy.get('[data-testid="phone-phoneNumber"]').type(html_injection);
      cy.get('[data-testid="button-save-edit"]').click();

      cy.contains("phone number structure is not valid").should("exist");

    });

  });

  describe('email', () => {

    const bad_email = "an emailthathasspaces_and-no.domain@.com"
    const html_injection = "<script>alert('test');</script>"


    it('testing funcitionality', () => {
      cy.Logout();
      cy.Login(WUT, users.user4.email, users.user4.password);
      cy.GetToken().then((token) => {
        const TestEmail = `${token}@emailhook.site`
        cy.get('.w-12').click();
        cy.get('[data-testid="button-edit-email"] > #_24x24_On_Light_Edit').click();
        cy.get('[data-testid="email"]').clear();
        cy.get('[data-testid="email"]').type(TestEmail);
        cy.get('[data-testid="button-save-edit"]').click();
        cy.wait(10000);
        cy.GetVerificationCode(token).then((code) => {
          cy.log('code!!!!', code);
          cy.get('#profile-verify-code').type(code);
          cy.get('#button-profile-verify').click();
        })

        cy.Logout();

        cy.Login(WUT, TestEmail, users.user4.password);

        // check email
        cy.get('.w-12').click();
        cy.get('[data-testid="button-edit-email"]').click();
        cy.get('[data-testid="email"]')
        .invoke('val')
        .then((value) => {
          if (value !== TestEmail) {
            cy.screenshot();
            throw new Error('email was not saved!');
          } else {
            expect(value).to.equal(TestEmail);
          }
        });
      });

    });

    it('bad email', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-email"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="email"]').clear();
      cy.get('[data-testid="email"]').type(bad_email);
      cy.get('[data-testid="button-save-edit"]').click()
      // cy.get('[data-testid="button-edit-email"]').click();
      cy.get('[data-testid="email"]')
      .invoke('val')
      .then((value) => {
        if (value === bad_email) {
          cy.screenshot();
          throw new Error('email box accepts invalid emails!');
        } else {
          expect(value).to.not.equal(bad_email); // Regular assertion
        }
      });
    });


    it('exisiting email', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-email"] > #_24x24_On_Light_Edit').click();
      cy.get('[data-testid="email"]').clear();
      cy.get('[data-testid="email"]').type(users.user1.email);
      cy.get('[data-testid="button-save-edit"]').click()
      // cy.get('[data-testid="button-edit-email"]').click();
      cy.get('[data-testid="email"]')
      .invoke('val')
      .then((value) => {
        if (value === users.user1.email) {
          cy.screenshot();
          throw new Error('email accepts existing emails!');
        } else {
          expect(value).to.not.equal(users.user1.email); // Regular assertion
        }
      });
    });

    it('long email', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-email"]').click();
      cy.get('[data-testid="email"]').clear();
      cy.readFile('cypress/fixtures/long_email.txt').then((long_email) => {
        cy.get('[data-testid="email"]').type(long_email);
        cy.get('[data-testid="button-save-edit"]').click();
      });
      cy.get('[data-testid="email"]')
      .invoke('val')
      .then((value) => {
        if (value.length >= 500) {
          cy.screenshot();
          throw new Error('email can be more than 500 characters!');
        } else {
          expect(value.length).to.be.lessThan(500);
        }
      });
    });


    it('html injection', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="button-edit-email"]').click();
      cy.get('[data-testid="email"]').clear();
      cy.get('[data-testid="email"]').type(html_injection);
      cy.get('[data-testid="button-save-edit"]').click();
      cy.get('[data-testid="email"]')
      .invoke('val')
      .then((value) => {
        if (value === html_injection) {
          cy.screenshot();
          throw new Error('email field contains HTML injection!');
        } else {
          expect(value).to.not.equal(html_injection); // Regular assertion
        }
      });
    });

  });

  describe('phone number', () => {

    it('change profile picture', () => {
      cy.get('.w-12').click();
      cy.get('[data-testid="EditProfilePic"]').click(); 
      const filePath = 'profile.png';
      cy.get('input[type="file"]').attachFile(filePath); 

      cy.get('.absolute')
        .should('have.attr', 'src')
        .and('include', 'blob'); 

  });
});

});
