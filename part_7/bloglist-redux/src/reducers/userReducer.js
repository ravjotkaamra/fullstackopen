const userReducer = (state = { username: 'mluukkai' }, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.user;
  case 'LOGOUT':
    return {};
  default:
    return state;
  }
};

export default userReducer;
