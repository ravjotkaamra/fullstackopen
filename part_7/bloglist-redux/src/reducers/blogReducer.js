import blogService from '../services/blogs';

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_BLOG':
    return [...state, action.data];
  case 'INIT_BLOGS':
    return action.data;
  case 'REMOVE_BLOG':
    break;
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

export default blogReducer;
