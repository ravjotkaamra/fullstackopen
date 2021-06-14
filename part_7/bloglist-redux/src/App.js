import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import blogService from './services/blogs';

import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import { initializeBlogs } from './actions/blogActions';
import { logoutUser } from './actions/userActions';

const App = () => {
  const blogRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  // if the user had already logged-in, get the user details
  // from the browser's local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch({ type: 'LOGIN', user });
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    // required without reload
    blogService.setToken(null);
    // required after reload
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(logoutUser());
  };

  // print login form if user is not logged in
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    );
  }

  // print all the blogs if user is logged in
  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <div>
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
      </div>
      <div>
        <h3>Create a Post</h3>
        <Togglable buttonLabel="create new blog" ref={blogRef}>
          <BlogForm blogRef={blogRef} />
        </Togglable>
      </div>
      <BlogList />
    </div>
  );
};

export default App;
