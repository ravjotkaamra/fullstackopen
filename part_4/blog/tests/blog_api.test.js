const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  // array of mongoose objects
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());

  // wait for all notes to be saved
  await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('all blogs unique identifier should be id', async () => {
  const response = await api.get('/api/blogs');

  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

describe('New Blog Post', () => {
  test('can be added', async () => {
    const newBlog = {
      title: 'Testing POST Method on Blogs',
      author: 'Admin',
      url: 'https://localhost/3001/api/blogs',
      likes: 1,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('Testing POST Method on Blogs');
  });

  test('without likes should be defaulted to zero likes', async () => {
    const newBlog = {
      title: 'Testing likes default value on Blogs',
      author: 'Admin',
      url: 'https://localhost/3001/api/blogs',
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test('without title/url should return 400', async () => {
    const newBlog = {
      author: 'Admin',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
