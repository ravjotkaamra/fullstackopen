import React from "react";

const Genres = ({ setGenre, genres }) => {
  return (
    <div>
      {genres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setGenre("")}>all genres</button>
    </div>
  );
};

export default Genres;
