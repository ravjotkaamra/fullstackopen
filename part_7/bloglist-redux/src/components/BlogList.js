import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlog, removeBlog } from '../actions/blogActions';

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const showDetailsWhenVisible = { display: visible ? '' : 'none' };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove Blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog.id));
    }
  };

  const removeButton = () => {
    if (blog.user && user.username === blog.user.username) {
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

  return (
    <div className="blog-post" style={blogStyle}>
      <div className="blogHeader">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} className="blogBtn">
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      <div style={showDetailsWhenVisible} className="blogDetails">
        <div>url {blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => dispatch(likeBlog(blog))} className="likeBtn">
            like
          </button>
        </div>
        <div>{blog.user ? blog.user.name : null}</div>
        {removeButton()}
      </div>
    </div>
  );
};

const BlogList = () => {
  const blogs = useSelector((state) =>
    state.blogs.sort((blog_1, blog_2) => blog_2.likes - blog_1.likes)
  );

  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
