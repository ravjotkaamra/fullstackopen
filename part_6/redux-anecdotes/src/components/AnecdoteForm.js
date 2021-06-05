import React from 'react';
import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = (props) => {
  const dispatch = useDispatch();

  const addAnecdote = (event) => {
    event.preventDefault();

    // extract the content from the input field of the form
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';

    // use the action creator from anecdoteReducer to generate an action
    // and dispatch it to update the state of the store
    dispatch(createAnecdote(content));
  };

  return (
    <form onSubmit={addAnecdote}>
      <div>
        <input name="anecdote" />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default AnecdoteForm;
