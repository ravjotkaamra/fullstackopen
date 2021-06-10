const initialMessage = 'Welcome my friend!';

const reducer = (state = initialMessage, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.message;
    case 'REMOVE_NOTIFICATION':
      return initialMessage;
    default:
      return state;
  }
};

// action creators for setting and removing
// the notification message
export const createNotification = (message) => {
  return {
    type: 'SET_NOTIFICATION',
    message,
  };
};

export const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION',
  };
};

export default reducer;
