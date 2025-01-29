import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import UserManagement from '../components/UserManagement';
import { fetchUsersAPI, addUserAPI, updateUserAPI, deleteUserAPI } from '../services/api';

jest.mock('../services/api');

describe('UserManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays users', async () => {
    // Mock the API response
    fetchUsersAPI.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Leanne Graham',
          email: 'Sincere@april.biz',
          company: { name: 'Romaguera-Crona' },
        },
      ],
    });

    render(<UserManagement />);

    // Verify that the loading message is displayed initially
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();

    // Wait for the loading to finish and the data to be rendered
    await waitFor(() => {
      expect(screen.queryByText(/loading users/i)).not.toBeInTheDocument();
    });

    // Check that the user's first name and last name are displayed
    expect(screen.getByText('Leanne')).toBeInTheDocument();
    expect(screen.getByText('Graham')).toBeInTheDocument();

    // Verify other user details
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument();
    expect(screen.getByText('Romaguera-Crona')).toBeInTheDocument();
  });

  it('handles add user', async () => {
    // Mock API calls
    fetchUsersAPI.mockResolvedValue({ data: [] });
    addUserAPI.mockResolvedValue({});

    render(<UserManagement />);

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText(/loading users/i)).not.toBeInTheDocument();
    });

    // Verify that the "Add New User" form is displayed
    expect(screen.getByText(/add new user/i)).toBeInTheDocument();

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });

    // Open the department dropdown
    fireEvent.mouseDown(screen.getByLabelText(/department/i));
    const listbox = within(screen.getByRole('listbox'));
    // Select a department
    fireEvent.click(listbox.getByText(/romaguera-crona/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /add user/i }));

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText(/user added successfully/i)).toBeInTheDocument();
    });

    // Verify that the new user appears in the table
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();

    // Ensure the API was called correctly
    expect(addUserAPI).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john.doe@example.com',
      company: { name: 'Romaguera-Crona' },
    });
  });

  it('handles edit user', async () => {
    // Mock API calls
    fetchUsersAPI.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Leanne Graham',
          email: 'Sincere@april.biz',
          company: { name: 'Romaguera-Crona' },
        },
      ],
    });
    updateUserAPI.mockResolvedValue({});

    render(<UserManagement />);

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(screen.queryByText(/loading users/i)).not.toBeInTheDocument();
    });

    // Click the edit button for the user
    fireEvent.click(screen.getByLabelText('edit'));

    // Verify that the form shows "Edit User"
    expect(screen.getByText(/edit user/i)).toBeInTheDocument();

    // Update the user's first name
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /update user/i }));

    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText(/user updated successfully/i)).toBeInTheDocument();
    });

    // Verify that the updated name appears in the table
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.queryByText('Leanne')).not.toBeInTheDocument();

    // Ensure the API was called with the correct parameters
    expect(updateUserAPI).toHaveBeenCalledWith(1, {
      name: 'Jane Graham',
      email: 'Sincere@april.biz',
      company: { name: 'Romaguera-Crona' },
    });
  });

  it('handles delete user', async () => {
    // Mock API calls
    fetchUsersAPI.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Leanne Graham',
          email: 'Sincere@april.biz',
          company: { name: 'Romaguera-Crona' },
        },
      ],
    });
    deleteUserAPI.mockResolvedValue({});

    render(<UserManagement />);

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(screen.queryByText(/loading users/i)).not.toBeInTheDocument();
    });

    // Click the delete button for the user
    fireEvent.click(screen.getByLabelText('delete'));

    // Verify that the delete confirmation dialog appears
    expect(screen.getByText(/delete confirmation/i)).toBeInTheDocument();

    // Click the "Delete" button in the dialog
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    // Wait for the success message
    await waitFor(() => {
      expect(screen.getByText(/user deleted successfully/i)).toBeInTheDocument();
    });

    // Verify that the user has been removed from the table
    expect(screen.queryByText('Leanne')).not.toBeInTheDocument();
    expect(screen.queryByText('Graham')).not.toBeInTheDocument();

    // Ensure the API was called with the correct user ID
    expect(deleteUserAPI).toHaveBeenCalledWith(1);
  });
});