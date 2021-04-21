import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilter] = useState("");

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const filteredPersons = persons.filter((person) =>
    person.name.toUpperCase().includes(filterName.slice().trim().toUpperCase())
  );

  const addPerson = (event) => {
    event.preventDefault();

    const newPersonObj = {
      name: newName,
      number: newNumber,
    };

    const person = persons.find((p) => p.name === newName);

    if (person) {
      const confirm = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirm) {
        personService.update(person.id, newPersonObj).then((returnedPerson) => {
          console.log("updated", returnedPerson);
          const newPersons = persons.map((p) =>
            p.id !== person.id ? p : returnedPerson
          );
          setPersons(newPersons);
          setNewName("");
          setNewNumber("");
        });
      }
    } else {
      personService.create(newPersonObj).then((returnedPerson) => {
        console.log(returnedPerson);
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const onDelete = ({ id, name }) => {
    const confirm = window.confirm(`Delete ${name} ?`);

    console.log("Delete", id, name);
    console.log("confirm :>> ", confirm);

    if (confirm) {
      personService.remove(id).then((deletedPerson) => {
        const newPersons = persons.filter((p) => p.id !== id);
        setPersons(newPersons);
      });
    }
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
      <Persons persons={filteredPersons} onDelete={onDelete} />
    </div>
  );
};

export default App;
