import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const blogs = useSelector(({ blogs }) =>
    blogs.sort((blog_1, blog_2) => blog_2.likes - blog_1.likes)
  );
  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>{' '}
        </div>
      ))}
    </div>
  );
};

export default BlogList;
