describe('coreect sign up', () => {
  it('coreect sign up', { timeout: 10000 },() => {
    cy.GetToken().then((token) => {
      cy.visit("http://localhost:5173/signup");
      cy.get("#name").type("grambell");
      cy.get("#userName").type(`${token}`);
      const TestEmail = `${token}@email.webhook.site`;
      cy.get("#email").type(TestEmail);
      cy.get("#password").type("Goodpassword1");
      cy.get("#confirmPassword").type("Goodpassword1");
      cy.get('.phone-input').type("1234567890");
      cy.wait(3000); // Waits for recaptcha to load and succeed
      // cy.get('iframe')
      // .first()
      // .then((recaptchaIframe) => {
      //     const body = recaptchaIframe.contents()
      //     cy.wrap(body).find('.recaptcha-checkbox').should('exist').click()
      // })
      cy.get('[style="width: 304px; height: 78px;"] > div > iframe').click();
      cy.get("#signup-btn").click();
    })
  })

})
