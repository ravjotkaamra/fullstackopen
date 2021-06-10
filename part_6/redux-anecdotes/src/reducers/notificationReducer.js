const initialMessage = 'Welcome my friend!';

const reducer = (state = initialMessage, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.message;
    case 'CLEAR_NOTIFICATION':
      return initialMessage;
    default:
      return state;
  }
};

// action creators for setting and removing
// the notification message
export const setNotification = (message, timeout) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      message,
    });

    setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION',
      });
    }, timeout * 1000);
  };
};

export default reducer;
