import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createPost }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();

    createPost({ title, author, url });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          id="title"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          id="author"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="url"
          id="url"
          value={url}
          name="URL"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>

      <button type="submit" id="create-post">
        create
      </button>
    </form>
  );
};

BlogForm.propTypes = {
  createPost: PropTypes.func.isRequired,
};

export default BlogForm;
