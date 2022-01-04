const { AuthenticationError, UserInputError } = require("apollo-server-core");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const db = require("./db");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Author: {
    bookCount: (root) => root.book_count,
  },

  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
    bookCount: async () => {
      const { rows: book } = await db.query("SELECT COUNT(*) FROM book;");
      console.log(`books:`, book);
      return book[0].count;
    },
    authorCount: async () => {
      const { rows: author } = await db.query("SELECT COUNT(*) FROM author;");
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
      const { rows: authors } = await db.query(`
        SELECT
          a.id,
          a.name,
          a.born,
          b.book_count
        FROM
        (
          SELECT
            author_id AS id,
            count(*) AS book_count
          FROM
            book
          GROUP BY
            author_id
        ) AS b
          NATURAL JOIN author a
        ORDER BY id;
      `);
      console.log(`authors: `, authors);
      return authors;
    },
    allGenres: async () => {
      const { rows: genres } = await db.query(
        "SELECT DISTINCT name FROM genre;"
      );
      console.log(`genres: `, genres);
      return genres.map((g) => g.name);
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const { currentUser } = context;
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

      const newBook = { ...args, id: bookId };
      console.log("new book added :>> ", newBook);

      pubsub.publish("BOOK_ADDED", { bookAdded: newBook });

      return newBook;
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
