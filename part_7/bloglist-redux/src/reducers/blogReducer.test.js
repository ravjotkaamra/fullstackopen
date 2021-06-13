import deepFreeze from 'deep-freeze';
import blogReducer from './blogReducer';

describe('blog reducer', () => {
  const initialState = [];
  const finalState = [
    {
      title: 'Testing Blog Reducer',
      author: 'Captain',
      url: 'http://localhost:3000/',
    },
  ];

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING',
    };

    const newState = blogReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test('blog post can be created', () => {
    const action = {
      type: 'NEW_BLOG',
      data: {
        title: 'Testing Blog Reducer',
        author: 'Captain',
        url: 'http://localhost:3000/',
      },
    };
    const state = initialState;
    deepFreeze(state);

    const newState = blogReducer(state, action);
    expect(newState).toEqual(finalState);
  });
});
