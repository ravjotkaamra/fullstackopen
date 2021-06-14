import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../actions/userActions';
import blogService from '../services/blogs';

const Navbar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // required without reload
    blogService.setToken(null);
    // required after reload
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(logoutUser());
  };

  const user = useSelector((state) => state.user);
  return (
    <nav>
      <Link to="/">blogs </Link>
      <Link to="/users">users </Link>
      <span>{user.name} logged in </span>
      <button onClick={handleLogout}>logout</button>
    </nav>
  );
};
export default Navbar;
