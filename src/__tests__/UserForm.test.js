import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from '../components/UserForm';

describe('UserForm', () => {
  const mockInitialValues = {
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  };

  const mockOnSubmit = jest.fn();
  const mockCancelEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add user form correctly', () => {
    render(
      <UserForm
        initialValues={mockInitialValues}
        onSubmit={mockOnSubmit}
        editingUser={null}
        cancelEdit={mockCancelEdit}
      />
    );

    expect(screen.getByText('Add New User')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <UserForm
        initialValues={mockInitialValues}
        onSubmit={mockOnSubmit}
        editingUser={null}
        cancelEdit={mockCancelEdit}
      />
    );

    fireEvent.click(screen.getByText('Add User'));

    await waitFor(() => {
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Department is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(
      <UserForm
        initialValues={mockInitialValues}
        onSubmit={mockOnSubmit}
        editingUser={null}
        cancelEdit={mockCancelEdit}
      />
    );

    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    const departmentSelect = screen.getByLabelText(/department/i);
    fireEvent.mouseDown(departmentSelect);
    fireEvent.click(screen.getByText('Romaguera-Crona'));

    fireEvent.click(screen.getByText('Add User'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: '',
        email: 'john@example.com',
        department: 'Romaguera-Crona'
      });
    });
  });
});