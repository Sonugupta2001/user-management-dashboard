import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UsersTable from '../components/UsersTable';

describe('UsersTable', () => {
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      department: 'IT'
    }
  ];

  const mockProps = {
    users: mockUsers,
    page: 0,
    rowsPerPage: 5,
    handleChangePage: jest.fn(),
    handleChangeRowsPerPage: jest.fn(),
    editUser: jest.fn(),
    handleOpenDeleteDialog: jest.fn()
  };

  it('renders table with user data', () => {
    render(<UsersTable {...mockProps} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('IT')).toBeInTheDocument();
  });

  it('handles edit button click', () => {
    render(<UsersTable {...mockProps} />);

    fireEvent.click(screen.getByLabelText('edit'));
    expect(mockProps.editUser).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('handles delete button click', () => {
    render(<UsersTable {...mockProps} />);

    fireEvent.click(screen.getByLabelText('delete'));
    expect(mockProps.handleOpenDeleteDialog).toHaveBeenCalledWith(mockUsers[0].id);
  });

  it('displays no users message when users array is empty', () => {
    render(<UsersTable {...mockProps} users={[]} />);

    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });
});