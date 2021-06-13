const notificationReducer = (state = {}, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.data;
  case 'CLEAR_NOTIFICATION':
    return {};
  default:
    return state;
  }
};

// action creators for setting and removing
// the notification message
let prevTimerId = null;

export const setNotification = (notification, timeout) => {
  return async (dispatch) => {
    // before displaying a new notification on to the screen,
    // first remove the timer set by the old notification
    clearTimeout(prevTimerId);

    dispatch({
      type: 'SET_NOTIFICATION',
      data: notification,
    });

    prevTimerId = setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION',
      });
    }, timeout);
  };
};

export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION',
  };
};

export default notificationReducer;
