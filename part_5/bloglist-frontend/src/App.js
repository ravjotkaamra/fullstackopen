import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Login from './components/Login';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const [notify, setNotify] = useState(null);

  const blogRef = useRef();

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

  const handleNewPost = async (blogObj) => {
    try {
      blogRef.current.toggleVisibility();

      const newBlog = await blogService.create(blogObj);
      setBlogs(blogs.concat(newBlog));
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

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <Login
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    </Togglable>
  );

  const handleLikes = async (id, blogObj) => {
    try {
      const updatedBlogObj = await blogService.update(id, blogObj);

      const newBlogs = blogs.map((blog) =>
        blog.id !== updatedBlogObj.id
          ? blog
          : { ...blog, likes: updatedBlogObj.likes }
      );

      newBlogs.sort((blog_1, blog_2) => blog_2.likes - blog_1.likes);
      setBlogs(newBlogs);
    } catch (error) {
      console.log('error like button :>> ', error);
    }
  };

  const handleDeletePost = async (blogId) => {
    try {
      await blogService.remove(blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (error) {
      console.log('error: deletion failed :>> ', error);
    }
  };

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
        <Notification notify={notify} />
        {loginForm()}
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
        {blogForm()}
      </div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateLikes={handleLikes}
          deletePost={handleDeletePost}
        />
      ))}
    </div>
  );
};

export default App;
