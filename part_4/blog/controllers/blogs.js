const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  // convert jsobject to mongoose object
  const blog = new Blog(request.body);

  // save the blog to db and
  // wait for it to be saved
  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;
