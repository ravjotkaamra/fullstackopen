import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilter] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);
  console.log("render", persons.length, "persons");

  const filteredPersons = persons.filter((person) =>
    person.name.toUpperCase().includes(filterName.slice().trim().toUpperCase())
  );

  const addPerson = (event) => {
    event.preventDefault();

    const newPersonObj = {
      id: persons.length + 1,
      name: newName,
      number: newNumber,
    };

    const found = persons.find((person) => person.name === newName);

    if (found) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(newPersonObj));
    }

    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFiltering = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        text="filter name with "
        filterName={filterName}
        handleFiltering={handleFiltering}
      />

      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} />
    </div>
  );
};

export default App;
