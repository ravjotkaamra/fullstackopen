import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBlog } from '../actions/blogActions';

const BlogForm = ({ blogRef }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    blogRef.current.toggleVisibility();
    dispatch(createBlog({ title, author, url }));
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit}>
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

export default BlogForm;
