import blogService from '../services/blogs';

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_BLOG':
    return [...state, action.data];
  case 'INIT_BLOGS':
    return action.data;
  case 'REMOVE_BLOG': {
    const id = action.id;
    return state.filter((blog) => blog.id !== id);
  }
  case 'LIKE_BLOG': {
    const id = action.id;
    return state.map((blog) =>
      blog.id !== id ? blog : { ...blog, likes: blog.likes + 1 }
    );
  }
  default:
    return state;
  }
};

// action creators
export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    });
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    });
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch({ type: 'REMOVE_BLOG', id });
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    blog = { ...blog, likes: blog.likes + 1 };
    await blogService.update(blog.id, blog);
    dispatch({ type: 'REMOVE_BLOG', id: blog.id });
  };
};

export default blogReducer;
