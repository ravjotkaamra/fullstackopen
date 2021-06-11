import React from 'react';
import { connect } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteForm = (props) => {
  const addAnecdote = async (event) => {
    event.preventDefault();

    // extract the content from the input field of the form
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';

    // use the action creator from anecdoteReducer to generate an action
    // and dispatch it to update the state.anecdotes of the store
    props.createAnecdote(content);

    // use the action creator from notificationReducer to generate an action
    // and dispatch it to update the state.notificaiton of the store and,
    // after five seconds remove the notification message
    props.setNotification(`Anecode created: '${content}'`, 5);
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

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (content) =>
      dispatch(setNotification(`Anecode created: '${content}'`, 5)),
    createAnecdote: (content) => dispatch(createAnecdote(content)),
  };
};

export default connect(null, mapDispatchToProps)(AnecdoteForm);
