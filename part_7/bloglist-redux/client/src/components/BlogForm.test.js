import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createPost = jest.fn();

  const component = render(<BlogForm createPost={createPost} />);

  const title = component.container.querySelector('#title');
  const author = component.container.querySelector('#author');
  const url = component.container.querySelector('#url');
  const form = component.container.querySelector('form');

  fireEvent.change(title, {
    target: { value: 'Testing Blog Form' },
  });
  fireEvent.change(author, {
    target: { value: 'Captain Singh' },
  });
  fireEvent.change(url, {
    target: { value: 'https://testing-library.com/' },
  });

  fireEvent.submit(form);

  expect(createPost.mock.calls).toHaveLength(1);
  console.log('createPost :>> ', createPost.mock.calls);
  expect(createPost.mock.calls[0][0].title).toBe('Testing Blog Form');
  expect(createPost.mock.calls[0][0].author).toBe('Captain Singh');
  expect(createPost.mock.calls[0][0].url).toBe('https://testing-library.com/');
});
