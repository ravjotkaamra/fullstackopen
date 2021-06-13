import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import { useDispatch } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, createBlog } from './reducers/blogReducer';
import BlogList from './components/BlogList';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const blogRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((blog_1, blog_2) => blog_2.likes - blog_1.likes);
      setBlogs(blogs);
    });
  }, []);

  // if the user had already logged-in, get the user details
  // from the browser's local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');

      dispatch(
        setNotification(
          { message: `Welcome ${user.name}`, type: 'success' },
          5000
        )
      );
    } catch (exception) {
      console.log('exception :>> ', exception);
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

  const handleLogout = () => {
    // required without reload
    blogService.setToken(null);
    // required after reload
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const handleNewPost = async (blogObj) => {
    try {
      blogRef.current.toggleVisibility();

      const newBlog = await blogService.create(blogObj);
      setBlogs(blogs.concat(newBlog));

      dispatch(createBlog(blogObj));

      dispatch(
        setNotification(
          {
            message: `New Post ${newBlog.title} created`,
            type: 'success',
          },
          5000
        )
      );
    } catch (exception) {
      console.log('exception :>> ', exception);
      dispatch(
        setNotification(
          {
            message: 'Wrong credentials or data missing',
            type: 'error',
          },
          5000
        )
      );
    }
  };

  const loginForm = () => (
    <Login
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  );
  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogRef}>
      <BlogForm createPost={handleNewPost} />
    </Togglable>
  );

  // print login form if user is not logged in
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        {loginForm()}
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
        {blogForm()}
      </div>
      <BlogList />
    </div>
  );
};

export default App;
