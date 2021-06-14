import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UserList = () => {
  const users = useSelector((state) => state.users);
  return (
    <div>
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}> {u.name}</Link>{' '}
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
