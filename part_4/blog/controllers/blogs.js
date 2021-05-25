const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;

  const userId = request.user;

  // now get the user from the database using the id field
  const user = await User.findById(userId);
  if (!user) {
    return response.status(401).json({ error: 'user does not exist' });
  }

  // now finally save the blog in db and update the user's blogs field
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const userId = request.user.id;
  const blog = await Blog.findById(request.params.id);

  if (!blog || !blog.user) {
    return response.status(404).json({ error: 'blog does not exist' });
  }

  if (blog.user.toString() !== userId.toString()) {
    return response.status(401).json({ error: 'unauthorised access' });
  }

  await blog.remove();
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
