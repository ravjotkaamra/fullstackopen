import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Blog from './Blog';

describe('<Blog />', () => {
  const blog = {
    title: 'Testing Blog App',
    author: 'React Singh',
    url: 'https://reactjs.org/',
    likes: 12,
    id: '34124314134',
  };

  test('displays the blogs title and author', () => {
    const component = render(<Blog blog={blog} />);
    const div = component.container.querySelector('.blogHeader');
    expect(div).toHaveTextContent('Testing Blog App React Singh');
  });

  test('url and likes should be displayed after clicking the button', () => {
    const component = render(<Blog blog={blog} />);
    const button = component.getByText('view');
    fireEvent.click(button);

    const div = component.container.querySelector('.blogDetails');
    expect(div).toHaveTextContent('url https://reactjs.org/');
    expect(div).toHaveTextContent('likes 12');
  });

  test('if like button is clicked twice, the event handler the component received as props is called twice', () => {
    const user = {
      id: '1232432',
      name: 'Captain',
      username: 'root',
    };
    blog.user = user;

    // mock function for handling clicks on like button
    const updateLikes = jest.fn();

    const component = render(
      <Blog blog={blog} updateLikes={updateLikes} user={user} />
    );

    const showDetailsBtn = component.getByText('view');
    fireEvent.click(showDetailsBtn);

    const likeBtn = component.container.querySelector('.likeBtn');
    fireEvent.click(likeBtn);
    fireEvent.click(likeBtn);

    expect(updateLikes.mock.calls).toHaveLength(2);
  });
});
