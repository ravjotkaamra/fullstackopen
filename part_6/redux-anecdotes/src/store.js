import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import ancecdoteReducer from './reducers/anecdoteReducer';
import notificationReducer from './reducers/notificationReducer';
import filterReducer from './reducers/filterReducer';

// store's state will look like this
// which means there will be three states
// one for all the ancecdotes, second for
// notification message, last for filtering
const reducer = combineReducers({
  anecdotes: ancecdoteReducer,
  notification: notificationReducer,
  filter: filterReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
