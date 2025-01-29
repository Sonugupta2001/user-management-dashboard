import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import UserManagement from './components/UserManagement';
import UserForm from './components/UserForm';
import UsersTable from './components/UsersTable';
import { fetchUsersAPI, addUserAPI, updateUserAPI, deleteUserAPI } from './services/api';
import { splitFullName, combineName } from './utils/utils';
import React from 'react';
import '@testing-library/jest-dom';

jest.mock('./services/api');

// Utility function tests
test('splitFullName should correctly split full names', () => {
  expect(splitFullName('John Doe')).toEqual({ firstName: 'John', lastName: 'Doe' });
  expect(splitFullName('Alice')).toEqual({ firstName: 'Alice', lastName: '' });
});

test('combineName should correctly join first and last names', () => {
  expect(combineName('John', 'Doe')).toBe('John Doe');
  expect(combineName('Alice', '')).toBe('Alice');
});

// UserManagement component test
test('renders UserManagement and fetches users', async () => {
  fetchUsersAPI.mockResolvedValue({ data: [{ id: 1, name: 'John Doe', email: 'john@example.com', company: { name: 'IT' } }] });

  await act(async () => {
    render(<UserManagement />);
  });

  expect(screen.getByText('User Management')).toBeInTheDocument();
  await waitFor(() => expect(fetchUsersAPI).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
});

// UserForm tests
test('UserForm submits correct values', async () => {
  const mockSubmit = jest.fn();
  render(<UserForm initialValues={{ firstName: '', lastName: '', email: '', department: '' }} onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
  fireEvent.change(screen.getByLabelText(/Department/i), { target: { value: 'IT' } });

  fireEvent.click(screen.getByRole('button', { name: /add user/i }));
  
  await waitFor(() => expect(mockSubmit).toHaveBeenCalledWith({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    department: 'IT'
  }));
});

// UsersTable test
test('UsersTable displays user data correctly', () => {
  const mockEditUser = jest.fn();
  const mockHandleDelete = jest.fn();

  render(
    <UsersTable
      users={[{ id: 1, name: 'John Doe', email: 'john@example.com', department: 'IT' }]}
      page={0}
      rowsPerPage={5}
      editUser={mockEditUser}
      handleOpenDeleteDialog={mockHandleDelete}
    />
  );

  expect(screen.getByText('John')).toBeInTheDocument();
  expect(screen.getByText('Doe')).toBeInTheDocument();
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
  expect(screen.getByText('IT')).toBeInTheDocument();
});


/* ----------------------------------------------------------------------
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders User Management header', () => {
  render(<App />);
  const headerElement = screen.getByText(/User Management/i);
  expect(headerElement).toBeInTheDocument();
});

----------------------------------------------------------------------- */
