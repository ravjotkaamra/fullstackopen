const ancecdoteReducer = (state = [], action) => {
  console.log('state now: ', state);
  console.log('action', action);

  switch (action.type) {
    case 'NEW_ANECDOTE':
      return [...state, action.data];
    case 'INIT_ANECDOTES':
      return action.data;
    case 'VOTE': {
      const id = action.data.id;
      const anecdoteToBeUpdated = state.find((ancedote) => ancedote.id === id);
      const updatedAnecdote = {
        ...anecdoteToBeUpdated,
        votes: anecdoteToBeUpdated.votes + 1,
      };

      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : updatedAnecdote
      );
    }
    default:
      return state;
  }
};

// action creators
export const initializeAnecdotes = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: anecdotes,
  };
};

export const incrementVote = (id) => {
  return {
    type: 'VOTE',
    data: { id },
  };
};

export const createAnecdote = (data) => {
  return {
    type: 'NEW_ANECDOTE',
    data,
  };
};

export default ancecdoteReducer;
