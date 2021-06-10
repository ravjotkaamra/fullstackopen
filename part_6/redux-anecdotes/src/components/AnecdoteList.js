import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { incrementVote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = (props) => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes
      .filter((anecdote) =>
        anecdote.content
          .toUpperCase()
          .includes(filter.slice().trim().toUpperCase())
      )
      .sort((a, b) => b.votes - a.votes)
  );

  const handleVote = (anecdote) => {
    dispatch(incrementVote(anecdote));
    dispatch(setNotification(`you voted: '${anecdote.content}'`, 5));
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote
          anecdote={anecdote}
          key={anecdote.id}
          handleClick={() => handleVote(anecdote)}
        />
      ))}
    </div>
  );
};

export default AnecdoteList;
