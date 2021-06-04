describe('Blog app', function () {
  beforeEach(function () {
    // delete the old data from the blog-test database
    cy.request('POST', 'http://localhost:3001/api/testing/reset');

    // create here a user to backend
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    };

    cy.request('POST', 'http://localhost:3001/api/users', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('Log in to application');
    cy.get('input[name=Username]');
    cy.get('input[name=Password]');
    cy.contains('login');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input[name=Username]').type('mluukkai');
      cy.get('input[name=Password]').type('salainen');
      cy.contains('login').click();
      cy.contains('Matti Luukkainen');
    });

    it('fails with wrong credentials', function () {
      cy.get('input[name=Username]').type('ravjot');
      cy.get('input[name=Password]').type('1234567');
      cy.contains('login').click();
      cy.contains('Wrong username or password');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' });
    });

    it('A blog can be created', function () {
      cy.contains('create new blog').click();
      cy.get('input[name=Title]').type('Testing Cypress.io');
      cy.get('input[name=Author]').type('Captain Saab');
      cy.get('input[name=URL]').type('https://www.cypress.io/');
      cy.get('#create-post').click();
      cy.contains('New Post Testing Cypress.io created');
    });

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createPost({
          title: 'Another Testing For Cypress.io',
          author: 'TNT Captain',
          url: 'https://www.cypress.io/',
        });
      });

      it('user can click the like button', function () {
        cy.get('.blogBtn').click();
        cy.contains('likes 0');
        cy.get('.likeBtn').click();
        cy.contains('likes 1');
      });

      it('user who created a blog can delete it', function () {
        cy.contains('Another Testing For Cypress.io').as('BlogPost');
        cy.get('@BlogPost').contains('view').click();
        cy.get('@BlogPost').parent().find('.removeBtn').click();
        cy.get('html').should('not.contain', 'Another Testing For Cypress.io');
      });
    });

    describe('multiple blog-posts exists', function () {
      beforeEach(function () {
        const blogs = [
          {
            title: 'Testing 1.0',
            author: 'Captain Saab',
            url: 'https://www.cypress.io/',
            likes: 12,
          },
          {
            title: 'Testing 2.0',
            author: 'Captain Saab',
            url: 'https://www.cypress.io/',
            likes: 21,
          },
          {
            title: 'Testing 3.0',
            author: 'Captain Saab',
            url: 'https://www.cypress.io/',
            likes: 15,
          },
        ];

        blogs.forEach((blog) => cy.createPost(blog));
      });

      it('blogs are sorted by likes', function () {
        cy.get('.blog-post').eq(0).should('contain', 'Testing 2.0');
        cy.get('.blog-post').eq(1).should('contain', 'Testing 3.0');
        cy.get('.blog-post').eq(2).should('contain', 'Testing 1.0');
      });
    });
  });
});
