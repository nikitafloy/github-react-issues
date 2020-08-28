import React from 'react';
import { render } from '@testing-library/react';
import Main from './Pages/Main/Main';

test('renders learn react link', () => {
  const { getByText } = render(<Main />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
