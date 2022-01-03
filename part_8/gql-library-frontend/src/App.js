import { useApolloClient } from "@apollo/client";
import React, { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const Navbar = () => (
    <div>
      <button onClick={() => setPage("authors")}>authors</button>
      <button onClick={() => setPage("books")}>books</button>

      {token ? (
        <>
          <button onClick={() => setPage("add")}>add book</button>
          <button onClick={logout}>logout</button>
        </>
      ) : (
        <button onClick={() => setPage("login")}>login</button>
      )}
    </div>
  );

  return (
    <div>
      <Notify errorMessage={errorMessage} />

      <Navbar />

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} setError={notify} />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setError={notify}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
