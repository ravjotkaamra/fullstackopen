import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { ALL_BOOKS_AND_GENRES_AND_ME, GET_BOOKS_BY_GENRE } from "../queries";
import Genres from "./Genres";

const Books = (props) => {
  const [genre, setGenre] = useState("");
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const { loading, error, data } = useQuery(ALL_BOOKS_AND_GENRES_AND_ME);
  const [getBooksByGenre, result] = useLazyQuery(GET_BOOKS_BY_GENRE);

  useEffect(() => {
    if (result.data) {
      setFavoriteBooks(result.data.allBooks);
    }
  }, [result]);

  if (!props.show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :{error.message} </p>;

  const { allBooks: books, me: user, allGenres: genres } = data;
  const filteredBooks = !genre
    ? books
    : books.filter((b) => b.genres.includes(genre));

  const onClickRecommendations = () => {
    getBooksByGenre({ variables: { genre: user.favoriteGenre } });
    setShowRecommendations(!showRecommendations);
  };

  const BookList = ({ books }) => (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
        {books.map((b) => (
          <tr key={b.id}>
            <td>{b.title}</td>
            <td>{b.author}</td>
            <td>{b.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <section>
        <h2>books</h2>

        {genre && (
          <p>
            in genre <strong>{genre}</strong>
          </p>
        )}
        <BookList books={filteredBooks} />

        <Genres genres={genres} setGenre={setGenre} />
      </section>

      {user && (
        <section>
          <h2>recommendations</h2>
          {!showRecommendations ? (
            <button onClick={onClickRecommendations}>show</button>
          ) : (
            <div>
              <p>
                books in your favorite genre{" "}
                <strong>{user.favoriteGenre}</strong>
              </p>

              <BookList books={favoriteBooks} />
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Books;
