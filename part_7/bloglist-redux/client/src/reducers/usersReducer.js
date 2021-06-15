const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return action.data;
    case 'PUSH_BLOG_USER': {
      const blog = action.data;
      return state.map((user) =>
        user.username !== blog.user.username
          ? user
          : { ...user, blogs: [...user.blogs, blog] }
      );
    }
    case 'REMOVE_BLOG_USER': {
      const id = action.id;
      return state.map((user) => {
        const filteredBlogs = user.blogs.filter((blog) => blog.id !== id);
        const newUser = { ...user, blogs: filteredBlogs };
        return newUser;
      });
    }
    default:
      return state;
  }
};

export default usersReducer;
