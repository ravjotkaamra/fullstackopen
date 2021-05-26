import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Login from './components/Login';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const [notify, setNotify] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
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

      setNotify({ message: `Welcome ${user.name}`, type: 'success' });
    } catch (exception) {
      console.log('exception :>> ', exception);
      setNotify({ message: 'Wrong username or password', type: 'error' });
    } finally {
      setTimeout(() => {
        setNotify(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    // required without reload
    blogService.setToken(null);
    // required after reload
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const handleNewPost = async (event) => {
    event.preventDefault();

    try {
      const newBlog = await blogService.create({
        title,
        author,
        url,
      });

      setBlogs(blogs.concat(newBlog));
      setTitle('');
      setAuthor('');
      setUrl('');

      setNotify({
        message: `New Post ${newBlog.title} created`,
        type: 'success',
      });
    } catch (exception) {
      console.log('exception :>> ', exception);
      setNotify({ message: 'Wrong credentials', type: 'error' });
    } finally {
      setTimeout(() => {
        setNotify(null);
      }, 5000);
    }
  };

  // print login form if user is not logged in
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notify={notify} />

        <Login
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  // print all the blogs if user is logged in
  return (
    <div>
      <h2>Blogs</h2>
      <Notification notify={notify} />

      <div>
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
      </div>
      <div>
        <h3>Create a Post</h3>
        <BlogForm
          title={title}
          author={author}
          url={url}
          setTitle={setTitle}
          setAuthor={setAuthor}
          setUrl={setUrl}
          createPost={handleNewPost}
        />
      </div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
