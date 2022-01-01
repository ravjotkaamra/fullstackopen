require("dotenv").config();

const {
  ApolloServer,
  UserInputError,
  AuthenticationError,
  gql,
} = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core/dist/plugin/landingPage/graphqlPlayground");
const db = require("./db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!): User
    login(username: String!, password: String!): Token
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
    bookCount: async () => {
      const { rows: book } = await db.query("SELECT COUNT(*) FROM book");
      console.log(`books:`, book);
      return book[0].count;
    },
    authorCount: async () => {
      const { rows: author } = await db.query("SELECT COUNT(*) FROM author");
      console.log(`author:`, author);
      return author[0].count;
    },
    allBooks: async (root, args) => {
      const { rows: books } = await db.query(`
        SELECT
          b.id AS id,
          b.title AS title,
          b.published AS published,
          a.name AS author,
          ARRAY_AGG(g.name) AS genres
        FROM
          book b,
          genre g,
          author a
        WHERE
          b.author_id = a.id
          AND b.id = g.book_id
        GROUP BY
          b.id,
          a.id
        ORDER BY id;
      `);
      console.log(`books: `, books);

      const { author, genre } = args;
      if (author && genre) {
        return books.filter(
          (book) => book.author === author && book.genres.includes(genre)
        );
      }
      if (author) {
        return books.filter((book) => book.author === author);
      }
      if (genre) {
        return books.filter((book) => book.genres.includes(genre));
      }
      return books;
    },
    allAuthors: async () => {
      const { rows: authors } = await db.query(
        "SELECT * FROM author ORDER BY id"
      );
      console.log(`authors: `, authors);
      return authors;
    },
  },

  Author: {
    bookCount: async (root) => {
      console.log(`root`, root);
      const { rows: book } = await db.query(
        `
        SELECT
          COUNT(*) AS book_count
        FROM
            BOOK
        WHERE
          author_id = $1`,
        [root.id]
      );

      console.log(`book`, book);
      return book[0].book_count;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const { currentUser } = context;
      console.log(`currentUser`, currentUser);
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      // get the author if already exists
      // else insert it into author table
      const { rows: author } = await db.query(
        `
        WITH insert_author AS (
          INSERT INTO author (name)
            VALUES ($1)
          ON CONFLICT(name) DO NOTHING
          RETURNING id
        )
        SELECT * FROM insert_author
          UNION
        SELECT id FROM author WHERE name=$1;`,
        [args.author]
      );
      const authorId = author[0].id;
      console.log(`authorId: `, authorId);

      // insert the book if not exists
      // else throw an error
      let bookId;
      try {
        const { rows: book } = await db.query(
          `
          INSERT INTO
            book (title, published, author_id)
            VALUES ($1, $2, $3)
            RETURNING id`,
          [args.title, args.published, authorId]
        );
        bookId = book[0].id;
        console.log(`bookId: `, bookId);
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      // generate the query to insert genres
      // for the new book into genre table
      let query = "INSERT INTO genre (book_id, name) VALUES";
      args.genres.forEach((name) => {
        query += `(${bookId}, '${name}'),`;
      });
      query = query.slice(0, -1);
      query += ";";
      console.log(`query`, query);

      // execute the query
      try {
        await db.query(query);
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return { ...args, id: bookId };
    },
    editAuthor: async (root, args, context) => {
      const { currentUser } = context;
      console.log(`currentUser`, currentUser);
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const { rows: updatedAuthors } = await db.query(
        `
        UPDATE author
          SET born = $1 
          WHERE name = $2
          RETURNING *
      `,
        [args.setBornTo, args.name]
      );
      console.log(`updatedAuthor: `, updatedAuthors[0]);
      return updatedAuthors[0];
    },
    createUser: async (root, args) => {
      try {
        const { rows: users } = await db.query(
          "INSERT INTO myuser (username) VALUES($1) RETURNING *",
          [args.username]
        );
        return users[0];
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    login: async (root, args) => {
      const { rows: users } = await db.query(
        "SELECT * FROM myuser WHERE username=$1",
        [args.username]
      );
      if (!users[0] || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: users[0].username,
        id: users[0].id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);

      const { rows: users } = await db.query(
        "SELECT * FROM myuser WHERE id=$1",
        [decodedToken.id]
      );

      return { currentUser: users[0] };
    }
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
