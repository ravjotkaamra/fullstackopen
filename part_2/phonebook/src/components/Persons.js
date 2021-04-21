import React from "react";

const Person = (props) => {
  return (
    <div>
      {props.person.name} {props.person.number}{" "}
      <button onClick={props.onDelete}>delete</button>
    </div>
  );
};

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person
          key={person.id}
          person={person}
          onDelete={() => onDelete(person)}
        />
      ))}
    </div>
  );
};

export default Persons;
