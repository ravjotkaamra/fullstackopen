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
    case 'UPDATE_BLOG': {
      const id = action.data.id;
      return state.map((blog) => (blog.id !== id ? blog : action.data));
    }
    default:
      return state;
  }
};

export default blogReducer;
