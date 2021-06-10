import anecdoteServices from '../services/anecdotes';

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
export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteServices.getAll();
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    });
  };
};

export const incrementVote = (anecdote) => {
  return async (dispatch) => {
    await anecdoteServices.update(anecdote.id, {
      ...anecdote,
      votes: anecdote.votes + 1,
    });
    dispatch({
      type: 'VOTE',
      data: anecdote,
    });
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteServices.create(content);
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    });
  };
};

export default ancecdoteReducer;
