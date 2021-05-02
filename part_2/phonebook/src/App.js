import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);

  // for handling input of name field
  const [newName, setNewName] = useState('');

  // for handling input of phone field
  const [newNumber, setNewNumber] = useState('');

  // for handling input of find field
  const [filterName, setFilter] = useState('');

  // for sending messages after success or failure
  // after create, update or delete
  const [displayMessage, setMessage] = useState(null);
  const [isError, setError] = useState(false);

  // to fetch initial persons array from database
  useEffect(() => {
    console.log('effect');
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const filteredPersons = persons.filter((person) =>
    person.name.toUpperCase().includes(filterName.slice().trim().toUpperCase())
  );

  // for updating phone number if person already exists
  const updatePerson = (person, newPersonObj) => {
    personService
      .update(person.id, newPersonObj)
      .then((returnedPerson) => {
        console.log('updated', returnedPerson);
        const newPersons = persons.map((p) =>
          p.id !== person.id ? p : returnedPerson
        );
        setPersons(newPersons);
        setNewName('');
        setNewNumber('');
        setError(false);
        setMessage(`Updated Phone Number for ${returnedPerson.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.log('error :>> ', error);
        const newPersons = persons.filter((p) => p.id !== person.id);
        setPersons(newPersons);
        setNewName('');
        setNewNumber('');
        setError(true);
        setMessage(
          `Information of ${person.name} has already been removed from server`
        );
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
  };

  // for adding new persons to the database
  // called when form is submitted
  const addPerson = (event) => {
    event.preventDefault();

    const newPersonObj = {
      name: newName,
      number: newNumber,
    };

    // check whether person already exists
    const person = persons.find((p) => p.name === newName);

    // if person already exists, ask user for updating the phone number
    if (person) {
      const confirm = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirm) {
        updatePerson(person, newPersonObj);
      }
    } else {
      personService
        .create(newPersonObj)
        .then((createdPerson) => {
          console.log(createdPerson);

          setPersons(persons.concat(createdPerson));
          setNewName('');
          setNewNumber('');

          setError(false);
          setMessage(`Added ${createdPerson.name}`);

          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.log('error :>> ', error.response);

          setError(true);
          setMessage(error.response.data.error);

          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };

  // for deleting persons from the database
  // called when delete button is clicked
  const handleDeletePerson = ({ id, name }) => {
    const confirm = window.confirm(`Delete ${name} ?`);

    console.log('Delete', id, name);
    console.log('confirm :>> ', confirm);

    if (confirm) {
      personService.remove(id).then((deletedPerson) => {
        const newPersons = persons.filter((p) => p.id !== id);
        setPersons(newPersons);
        setMessage(`Deleted ${name} from Phonebook`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
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
      <Notification message={displayMessage} error={isError} />
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
      <Persons persons={filteredPersons} onDelete={handleDeletePerson} />
    </div>
  );
};

export default App;
