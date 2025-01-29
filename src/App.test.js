import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders User Management header', async () => {
  render(<App />);
  await waitFor(() => expect(screen.getByText(/User Management/i)).toBeInTheDocument());
  const headerElement = screen.getByText(/User Management/i);
  expect(headerElement).toBeInTheDocument();
});