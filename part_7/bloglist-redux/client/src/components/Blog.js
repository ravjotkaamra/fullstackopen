import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { likeBlog, removeBlog, addComment } from '../actions/blogActions';

const CommentList = ({ blog }) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addComment(blog.id, comment));
    setComment('');
  };

  if (!blog.comments) {
    return null;
  }

  return (
    <div>
      <h3>comments</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={comment}
          name="Comment"
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>

      <ul>
        {blog.comments.map((comment, idx) => (
          <li key={idx}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

const Blog = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const id = useParams().id;
  const blog = useSelector(({ blogs }) => blogs.find((b) => b.id === id));
  const history = useHistory();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove Blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog.id));
      history.push('/');
    }
  };

  const removeButton = () => {
    if (user.username === blog.user.username) {
      const btnStyle = { color: 'red', textAlign: 'center' };
      return (
        <div>
          <button className="removeBtn" style={btnStyle} onClick={handleDelete}>
            remove
          </button>
        </div>
      );
    }

    return null;
  };

  if (!blog) {
    return null;
  }

  return (
    <div className="blog-post" style={blogStyle}>
      <div className="blogDetails">
        <h3>{blog.title}</h3>
        <div>url {blog.url}</div>
        <div>
          {blog.likes} likes
          <button onClick={() => dispatch(likeBlog(blog))} className="likeBtn">
            like
          </button>
        </div>
        <div>added by {blog.user.name}</div>
        {removeButton()}
        <CommentList blog={blog} />
      </div>
    </div>
  );
};

export default Blog;
