import React, { useState } from 'react';

const Blog = ({ blog, user, updateLikes, deletePost }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const showDetailsWhenVisible = { display: visible ? '' : 'none' };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const incrementLikes = () => {
    const blogObj = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
      id: blog.id,
    };

    updateLikes(blog.id, blogObj);
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove Blog ${blog.title} by ${blog.author}`)) {
      await deletePost(blog.id);
    }
  };

  const removeButton = () => {
    if (blog.user && user.username === blog.user.username) {
      const btnStyle = { color: 'red', textAlign: 'center' };
      return (
        <div>
          <button style={btnStyle} onClick={handleDelete}>
            remove
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>

      <div style={showDetailsWhenVisible}>
        <div>url {blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={incrementLikes}>like</button>
        </div>
        <div>{blog.user ? blog.user.name : null}</div>
        {removeButton()}
      </div>
    </div>
  );
};

export default Blog;
