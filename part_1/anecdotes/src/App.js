import React, { useState } from "react";

const Button = (props) => {
  return <button onClick={props.handleClick}>{props.text}</button>;
};

const Display = (props) => {
  return (
    <div>
      <div>{props.text}</div>
      <div>has {props.votes} votes</div>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  // callback function for printing next random anecdote
  // from the array of ancedotes
  const nextAnecdote = () => {
    const randomAnecdote = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomAnecdote);
  };

  // callback function for incrementing
  // the number of votes for selected anecdote
  const incrementVotes = () => {
    // create a copy of the old votes array
    const newVotes = [...votes];
    // increment the vote by one of the selected anecdote
    newVotes[selected]++;
    setVotes(newVotes);
  };

  const mostUpvotedAnec = () => {
    const iMax = votes.indexOf(Math.max(...votes));
    return { anecdote: anecdotes[iMax], votes: votes[iMax] };
  };

  return (
    <div>
      <div>
        <h1>Anecdote of the day</h1>
        <Display text={anecdotes[selected]} votes={votes[selected]} />
        <Button handleClick={incrementVotes} text="vote" />
        <Button handleClick={nextAnecdote} text="next anecdote" />
      </div>

      <div>
        <h1>Anecdote with most votes</h1>

        <Display
          text={mostUpvotedAnec().anecdote}
          votes={mostUpvotedAnec().votes}
        />
      </div>
    </div>
  );
};

export default App;
