import deepFreeze from 'deep-freeze';
import notificationReducer from './notificationReducer';

describe('notification reducer', () => {
  const initialState = {};
  const finalState = {
    message: 'Hello there!',
    type: 'success',
  };

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING',
    };

    const newState = notificationReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test('notification can be set', () => {
    const action = {
      type: 'SET_NOTIFICATION',
      data: finalState,
    };
    const state = initialState;
    deepFreeze(state);

    const newState = notificationReducer(state, action);
    expect(newState).toEqual(finalState);
  });

  test('notification can be cleared', () => {
    const action = {
      type: 'CLEAR_NOTIFICATION',
    };
    const state = finalState;
    deepFreeze(state);

    const newState = notificationReducer(state, action);
    expect(newState).toEqual(initialState);
  });
});
