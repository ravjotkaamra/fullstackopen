import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import blogService from './services/blogs';

import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import User from './components/User';
import UserList from './components/UserList';

import { initializeBlogs } from './actions/blogActions';
import { initializeUsers } from './actions/usersActions';

const App = () => {
  const blogRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
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
    <Router>
      <div>
        <Navbar />
        <h2>Blogs</h2>
        <Notification />

        <Switch>
          <Route path="/users/:id">
            <User />
          </Route>
          <Route path="/users">
            <UserList />
          </Route>
          <Route path="/blogs/:id">
            <Blog />
          </Route>
          <Route path="/blogs">
            <BlogList />
          </Route>
          <Route path="/">
            <div>
              <h3>Create a Post</h3>
              <Togglable buttonLabel="create new blog" ref={blogRef}>
                <BlogForm blogRef={blogRef} />
              </Togglable>
            </div>
            <BlogList />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
