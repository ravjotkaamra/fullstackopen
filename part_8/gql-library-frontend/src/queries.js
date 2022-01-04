import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    id
    author
    published
    genres
  }
`;

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;

export const ALL_BOOKS_AND_GENRES = gql`
  query {
    allBooks {
      ...BookDetails
    }
    allGenres
  }
  ${BOOK_DETAILS}
`;

export const ALL_AUTHORS_AND_BOOKS_AND_GENRES = gql`
  query {
    allAuthors {
      name
      id
      born
      bookCount
    }
    allBooks {
      ...BookDetails
    }
    allGenres
  }
  ${BOOK_DETAILS}
`;

export const ALL_BOOKS_AND_GENRES_AND_ME = gql`
  query {
    allBooks {
      ...BookDetails
    }
    me {
      id
      username
      favoriteGenre
    }
    allGenres
  }
  ${BOOK_DETAILS}
`;

export const GET_BOOKS_BY_GENRE = gql`
  query getBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      title
      id
      author
      published
    }
  }
`;

export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;

export const EDIT_AUTHOR = gql`
  mutation editBirthYearAuthor($name: String!, $birth: Int!) {
    editAuthor(name: $name, setBornTo: $birth) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;
