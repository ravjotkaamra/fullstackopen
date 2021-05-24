const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Build a Blog Using Express.js and React in 30 Minutes',
    author: 'Scotch',
    url: 'https://scotch.io/tutorials/build-a-blog-using-expressjs-and-react-in-30-minutes',
    likes: 100,
    id: '60a91b95b636cf7ea1fcaa07',
  },
  {
    title: 'How to Create and Test a Node.js Blog API',
    author: 'Ben Merchant',
    url: 'https://medium.com/@benmerchant/how-to-create-and-test-a-node-js-blog-api-819170280abd',
    likes: 60,
    id: '60a91c8db636cf7ea1fcaa08',
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    url: 'www.google.com',
    author: 'admin',
    likes: 0,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
};
