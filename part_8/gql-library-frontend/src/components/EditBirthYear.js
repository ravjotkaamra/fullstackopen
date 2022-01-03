import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const EditBirthYear = ({ authors }) => {
  const [name, setName] = useState(authors[0].name);
  const [birth, setBirth] = useState("");

  const [editBirthYearAuthor] = useMutation(EDIT_AUTHOR, {
    update: (store, response) => {
      const { name, born } = response.data.editAuthor;
      store.updateQuery({ query: ALL_AUTHORS }, (data) => ({
        allAuthors: data.allAuthors.map((a) =>
          a.name === name ? { ...a, born } : a
        ),
      }));
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    editBirthYearAuthor({ variables: { name, birth: parseInt(birth) } });
    setBirth("");
  };

  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={onSubmit}>
        <label>
          Select Author:
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          born:{" "}
          <input
            value={birth}
            onChange={({ target }) => setBirth(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default EditBirthYear;
