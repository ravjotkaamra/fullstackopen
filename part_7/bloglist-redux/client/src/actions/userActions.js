import loginService from '../services/login';
import blogService from '../services/blogs';
import { setNotification } from '../actions/notificationActions';

export const loginUser = ({ username, password }) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);

      dispatch({
        type: 'LOGIN',
        user,
      });
      dispatch(
        setNotification(
          { message: `Welcome ${user.name}`, type: 'success' },
          5000
        )
      );
    } catch (error) {
      console.log('login error :>> ', error);
      dispatch(
        setNotification(
          {
            message: 'Wrong username or password',
            type: 'error',
          },
          5000
        )
      );
    }
  };
};

export const logoutUser = () => {
  return {
    type: 'LOGOUT',
  };
};
