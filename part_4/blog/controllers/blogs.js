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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
    }
  );
  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(400).json({ error: 'invalid id' });
  }
});

module.exports = blogsRouter;
