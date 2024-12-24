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


  describe('uploading stories', () => {
    const caption = "test caption"

    it('testing images', () => {
      cy.get('.stories-list > :nth-child(1)').click();
      cy.get('.three-dots-button > .svg-inline--fa').click();
      const filePath = 'test_images.png';
      cy.get('.add').click().attachFile(filePath)
      cy.get('.send-button').click()

      cy.Logout();

      cy.Login(WUT, users.user2.email, users.user2.password)

      cy.get('.stories-list')
      .contains(users.user1.username).click();

    });


    it('testing images with captions', () => {
      cy.get('.stories-list > :nth-child(1)').click();
      cy.get('.three-dots-button > .svg-inline--fa').click();
      const filePath = 'test_images.png';
      cy.get('.add').click().attachFile(filePath)
      cy.get('.story-caption').type(caption)
      cy.get('.send-button').click()

      cy.Logout();

      cy.Login(WUT, users.user2.email, users.user2.password)

      cy.get('.stories-list')
      .contains(users.user1.username).click();
      cy.contains(caption).should('exist');

    });

    it('testing videos', () => {
      cy.get('.stories-list > :nth-child(1)').click();
      cy.get('.three-dots-button > .svg-inline--fa').click();
      const filePath = 'test_video.mp4';
      cy.get('.add').click().attachFile(filePath)
      cy.get('.send-button').click()

      cy.Logout();

      cy.Login(WUT, users.user2.email, users.user2.password)

      cy.get('.stories-list')
      .contains(users.user1.username).click();

    });


    it('testing video with captions', () => {
      cy.get('.stories-list > :nth-child(1)').click();
      cy.get('.three-dots-button > .svg-inline--fa').click();
      const filePath = 'test_video.mp4';
      cy.get('.add').click().attachFile(filePath)
      cy.get('.story-caption').type(caption)
      cy.get('.send-button').click()

      cy.Logout();

      cy.Login(WUT, users.user2.email, users.user2.password)

      cy.get('.stories-list')
      .contains(users.user1.username).click();
      cy.contains(caption).should('exist');

    });
  });

});