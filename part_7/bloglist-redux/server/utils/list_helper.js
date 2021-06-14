const { result } = require('lodash');
const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (total, blog) => {
    return total + blog.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (topBlog, blog) => {
    return topBlog.likes > blog.likes ? topBlog : blog;
  };

  return blogs.reduce(reducer, {});
};

const mostBlogs = (blogs) => {
  const result = _(blogs)
    .countBy('author')
    .map((val, key) => ({
      author: key,
      blogs: val,
    }))
    .maxBy('blogs');

  return result;
};

const mostLikes = (blogs) => {
  const result = _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      author: key,
      likes: _.sumBy(objs, 'likes'),
    }))
    .maxBy('likes');

  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
