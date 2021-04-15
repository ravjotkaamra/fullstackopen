import React from "react";

const Header = (props) => {
  return <h1>{props.course_name}</h1>;
};

const Part = (props) => {
  return (
    <div>
      <p>
        {props.part_name} {props.exercises}
      </p>
    </div>
  );
};

const Content = (props) => {
  return (
    <div>
      <Part
        part_name={props.parts[0].name}
        exercises={props.parts[0].exercises}
      />
      <Part
        part_name={props.parts[1].name}
        exercises={props.parts[1].exercises}
      />
      <Part
        part_name={props.parts[2].name}
        exercises={props.parts[2].exercises}
      />
    </div>
  );
};

const Total = (props) => {
  let count = 0;
  props.parts.forEach((part) => (count += part.exercises));
  return (
    <div>
      <p>Number of exercises {count}</p>
    </div>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course_name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
