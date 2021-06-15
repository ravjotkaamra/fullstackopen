import blogService from '../services/blogs';
import { setNotification } from '../actions/notificationActions';

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
    try {
      const newBlog = await blogService.create(blog);
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog,
      });

      dispatch({
        type: 'PUSH_BLOG_USER',
        data: newBlog,
      });

      dispatch(
        setNotification(
          {
            message: `New Post ${blog.title} created`,
            type: 'success',
          },
          5000
        )
      );
    } catch (error) {
      console.log('blog creation failed', error);
      dispatch(
        setNotification(
          {
            message: 'Wrong credentials or data missing',
            type: 'error',
          },
          5000
        )
      );
    }
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch({ type: 'REMOVE_BLOG', id });
    dispatch({ type: 'REMOVE_BLOG_USER', id });
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.update(blog.id, {
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1,
      });
      dispatch({
        type: 'UPDATE_BLOG',
        data: { ...blog, likes: blog.likes + 1 },
      });
    } catch (error) {
      console.log('error in liking >> ', error);
    }
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    await blogService.postComment(id, comment);
    dispatch({
      type: 'ADD_COMMENT',
      data: { id, comment },
    });
  };
};
