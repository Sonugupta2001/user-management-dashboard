# User Management React App Documentation

## Introduction

The **User Management React App** is a CRUD (Create, Read, Update, Delete) application that allows users to manage a list of users. It includes functionalities such as adding new users, editing existing users, and deleting users. The application leverages React for the frontend, Axios for API calls, Material-UI for styling, Formik and Yup for form handling and validation, and Jest with React Testing Library for unit testing.

---

## Project Overview

This application:

- Fetches users from a mock API (`https://jsonplaceholder.typicode.com/users`).
- Displays users in a paginated table.
- Provides a form to add new users.
- Allows editing and deleting existing users.
- Includes unit tests for critical components and API services.

**Note:** Since the API used is a mock API and does not persist data, the application manages state locally to simulate persistent behavior.

---

## Project Structure

```
src/
├── components/
│   ├── UserManagement.js
│   ├── UserForm.js
│   ├── UsersTable.js
├── services/
│   └── api.js
├── utils/
│   └── utils.js
├── __tests__/
│   ├── api.test.js
│   ├── UserForm.test.js
│   ├── UserManagement.test.js
│   └── UsersTable.test.js
```

- **components/**: Contains React components.
  - `UserManagement.js`: Main container component.
  - `UserForm.js`: Form component for adding/editing users.
  - `UsersTable.js`: Table component to display users.
- **services/**: Contains API call functions.
  - `api.js`: Functions to interact with the mock API.
- **utils/**: Contains utility functions.
  - `utils.js`: Helper functions for name manipulation and messaging.
- **__tests__/**: Contains unit tests for components and services.

---

## Getting Started

### Prerequisites

- **Node.js** (version 12 or higher)
- **npm** (version 6 or higher)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/user-management-app.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd user-management-app
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

---

## Available Scripts

In the project directory, you can run:

- **Start the app in development mode**

  ```bash
  npm start
  ```

  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- **Run unit tests**

  ```bash
  npm test
  ```

  Launches the test runner in interactive watch mode.

- **Build the app for production**

  ```bash
  npm run build
  ```

---

## Components Detail

### UserManagement Component

**File:** `src/components/UserManagement.js`

The `UserManagement` component is the main container that orchestrates the user management functionalities.

**Key Features:**

- **State Management:** Uses React hooks (`useState`, `useEffect`) to manage local state.
  - `users`: Array of user objects.
  - `loading`: Boolean indicating loading state.
  - `error`: String for error messages.
  - `editingUser`: User object being edited.
  - `successMessage`: String for success messages.
  - `openSnackbar`: Boolean to control Snackbar visibility.
  - `deleteDialog`: Object controlling the delete confirmation dialog.
  - `page`, `rowsPerPage`: Pagination controls.

- **Fetching Users:**

  - `useEffect` calls `fetchUsers` on component mount.
  - `fetchUsers` fetches users from the API and maps `company.name` to `department`.
  - Handles loading and error states.

- **Adding a User:**

  - `addUser` function handles adding a new user.
  - Uses `addUserAPI` to send data to the API.
  - Updates local `users` state to include the new user.
  - Shows success message upon completion.

- **Editing a User:**

  - `editUser` function sets the user to be edited.
  - Form pre-populates with the selected user's data.
  - `updateUser` function updates the user data via `updateUserAPI`.
  - Updates local `users` state with the modified user.
  - Shows success message and resets editing state.

- **Deleting a User:**

  - `handleOpenDeleteDialog` opens the confirmation dialog.
  - `deleteUser` function deletes the user via `deleteUserAPI`.
  - Updates local `users` state to remove the deleted user.
  - Shows success message upon completion.

- **Pagination:**

  - `handleChangePage` and `handleChangeRowsPerPage` manage table pagination.

- **Rendering:**

  - Conditionally renders loading state.
  - Renders `UserForm` for adding/editing users.
  - Renders error messages using `Alert`.
  - Renders `UsersTable` with user data.
  - Displays success messages using `Snackbar`.
  - Includes delete confirmation dialog (`Dialog` component).

**Code Snippet:** (Refer to the full code provided above)

---

### UserForm Component

**File:** `src/components/UserForm.js`

The `UserForm` component renders a form for adding or editing users.

**Key Features:**

- **Formik Integration:**

  - Uses `useFormik` hook for form state management.
  - `initialValues` are provided via props.
  - `validationSchema` defines field validations using Yup.

- **Form Fields:**

  - **First Name** (`firstName`): Required.
  - **Last Name** (`lastName`): Optional.
  - **Email** (`email`): Required, must be a valid email.
  - **Department** (`department`): Required, selected from a predefined list.

- **Validation:**

  - Real-time validation with error messages displayed beneath fields.
  - Uses Material-UI form components with validation props.

- **Submission:**

  - On form submission, calls `onSubmit` prop function.
  - Resets form fields after submission.

- **Editing State:**

  - Displays "Add New User" or "Edit User" based on `editingUser` prop.
  - Includes a "Cancel" button when editing to reset the form.

**Code Snippet:** (Refer to the full code provided above)

---

### UsersTable Component

**File:** `src/components/UsersTable.js`

The `UsersTable` component displays users in a paginated table with options to edit or delete.

**Key Features:**

- **Data Display:**

  - Displays user details: ID, First Name, Last Name, Email, Department.
  - Splits full name into `firstName` and `lastName` using `splitFullName` utility.

- **Actions:**

  - Includes "Edit" and "Delete" buttons for each user.
  - `editUser` and `handleOpenDeleteDialog` functions are triggered on button clicks.

- **Pagination:**

  - Uses `TablePagination` component for pagination controls.
  - Props `page`, `rowsPerPage`, `handleChangePage`, and `handleChangeRowsPerPage` manage pagination state.

- **Empty State:**

  - Displays a message when no users are available.

**Code Snippet:** (Refer to the full code provided above)

---

## Utilities

**File:** `src/utils/utils.js`

Utility functions used across the application.

### Functions:

- **splitFullName(fullName):**

  - Splits a full name into first name and last name.
  - Returns an object `{ firstName, lastName }`.

- **combineName(firstName, lastName):**

  - Combines first name and last name into a full name string.
  - Trims any extra spaces.

- **showSuccessMessage(setSuccessMessage, setOpenSnackbar, message):**

  - Sets the success message and opens the Snackbar.
  - Used to display success notifications.

---

## API Services

**File:** `src/services/api.js`

Functions to interact with the external API for user data.

### API URLs:

- **Base URL:** `https://jsonplaceholder.typicode.com/users`

### Functions:

- **fetchUsersAPI():**

  - Performs a GET request to fetch all users.
  - Returns a promise resolving to the response.

- **addUserAPI(user):**

  - Performs a POST request to add a new user.
  - `user` is an object containing user details.
  - Returns a promise resolving to the response.

- **updateUserAPI(id, user):**

  - Performs a PUT request to update an existing user.
  - `id` is the user ID.
  - `user` is an object with updated user details.
  - Returns a promise resolving to the response.

- **deleteUserAPI(id):**

  - Performs a DELETE request to remove a user.
  - `id` is the user ID.
  - Returns a promise resolving to the response.

**Note:** The API is a mock service and does not persist changes.

---

## Unit Tests

Unit tests are written using Jest and React Testing Library to ensure the components and services function correctly.

### Setup:

- **Mocks:**

  - `jest.mock()` is used to mock API calls and dependencies.
  - Mock implementations simulate API responses and errors.

- **Test Structure:**

  - Each component or service has its own test file under `src/__tests__/`.

---

### API Tests

**File:** `src/__tests__/api.test.js`

**Purpose:** Test the API service functions in `api.js`.

**Tests:**

- **fetchUsersAPI:**

  - **Success Case:**
    - Mocks a successful API response.
    - Asserts that the function returns the expected data.
    - Checks that `axios.get` is called with the correct URL.

  - **Error Case:**
    - Mocks a network error.
    - Asserts that the function throws an error.

**Example Test Code:**

```javascript
describe('fetchUsersAPI', () => {
  it('should fetch users successfully', async () => {
    const mockResponse = { data: [mockUser] };
    axios.get.mockResolvedValueOnce(mockResponse);

    const result = await fetchUsersAPI();
    expect(result).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
  });

  it('should handle fetch error', async () => {
    const error = new Error('Network error');
    axios.get.mockRejectedValueOnce(error);

    await expect(fetchUsersAPI()).rejects.toThrow('Network error');
  });
});
```

---

### UserForm Tests

**File:** `src/__tests__/UserForm.test.js`

**Purpose:** Ensure the `UserForm` component works correctly, including validation and form submission.

**Tests:**

- **Render Form:**

  - Checks that the form renders correctly with all fields.

- **Validation Errors:**

  - Submits the form with empty fields.
  - Asserts that validation error messages appear for required fields.

- **Successful Submission:**

  - Fills out the form with valid data.
  - Submits the form.
  - Asserts that `onSubmit` is called with the correct data.

**Example Test Code:**

```javascript
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
```

---

### UserManagement Tests

**File:** `src/__tests__/UserManagement.test.js`

**Purpose:** Test the main `UserManagement` component's functionalities, including fetching, adding, editing, and deleting users.

**Tests:**

- **Fetch and Display Users:**

  - Mocks API response with a user.
  - Renders the component.
  - Asserts that the user details are displayed in the table.

- **Add User:**

  - Mocks empty API response and successful `addUserAPI` call.
  - Fills out and submits the form.
  - Asserts that the new user appears in the table.
  - Checks that the success message is displayed.
  - Verifies `addUserAPI` is called with correct data.

- **Edit User:**

  - Mocks API response with a user and successful `updateUserAPI` call.
  - Initiates edit mode by clicking the edit button.
  - Modifies user data and submits the form.
  - Asserts that the updated data is displayed.
  - Checks that the success message is displayed.
  - Verifies `updateUserAPI` is called with correct data.

- **Delete User:**

  - Mocks API response with a user and successful `deleteUserAPI` call.
  - Initiates delete by clicking the delete button.
  - Confirms deletion in the dialog.
  - Asserts that the user is removed from the table.
  - Checks that the success message is displayed.
  - Verifies `deleteUserAPI` is called with the correct user ID.

**Example Test Code:**

```javascript
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
```

---

### UsersTable Tests

**File:** `src/__tests__/UsersTable.test.js`

**Purpose:** Test the `UsersTable` component's rendering and interactions.

**Tests:**

- **Render Table with Data:**

  - Verifies that the table displays user data correctly.

- **Edit Button Click:**

  - Simulates clicking the edit button.
  - Asserts that `editUser` prop function is called with the correct user.

- **Delete Button Click:**

  - Simulates clicking the delete button.
  - Asserts that `handleOpenDeleteDialog` prop function is called with the correct user ID.

- **Empty Users Array:**

  - Renders the component with an empty `users` array.
  - Asserts that the "No users found." message is displayed.

**Example Test Code:**

```javascript
it('handles edit button click', () => {
  render(<UsersTable {...mockProps} />);

  fireEvent.click(screen.getByLabelText('edit'));
  expect(mockProps.editUser).toHaveBeenCalledWith(mockUsers[0]);
});
```

---

## Running Tests

To run the unit tests, execute the following command in the project directory:

```bash
npm test
```

This command starts the Jest test runner and runs all tests located in the `__tests__` directory.

**Notes:**

- The tests use `@testing-library/react` for rendering components and simulating user interactions.
- API calls are mocked using `jest.mock()` to simulate responses and control test scenarios.
- Each test suite includes `beforeEach` to reset mocks and ensure test isolation.

---

**Key Features:**

- **React Hooks:** Utilized for state and effect management.
- **Form Handling with Formik and Yup:** Simplifies form state management and validation.
- **Material-UI Components:** Provides a rich set of UI components and styling.
- **API Integration with Axios:** Manages HTTP requests to external APIs.
- **State Management:** Local state is used to simulate API persistence.
- **Unit Testing with Jest and React Testing Library:**
  - Provides confidence in component functionality.
  - Tests cover various scenarios, including success and error cases.
  - Mocks external dependencies for isolated testing.


**Future improvements:**

- **Real Backend Integration**: Connect the app to a real backend service or database (e.g., Node.js with Express, MongoDB, PostgreSQL) to enable persistent data storage. This ensures that changes to user data are saved and remain consistent across sessions and devices.

- **Authentication and Authorization**: Implement user authentication using libraries like **Firebase Auth**, **OAuth2**, or **JWT**. This allows for secure access to the application and enables role-based access control (RBAC), where different users have varying levels of permissions.

- **Theme Customization**: Allow users to switch between different themes (e.g., light and dark modes) to enhance visual appeal and accessibility.

### Advanced Features

- **Search and Filter Functionality**: Implement search bars and filters to allow users to search for specific users by name, email, or department. Use debounced input to optimize performance.

- **Sorting and Column Customization**: Allow users to sort table data by different columns and customize displayed columns to personalize their view.

- **Import/Export Data**: Allow users to import user data from CSV or Excel files and export the current user list for reporting or backup purposes.

- **Customization and Settings**: Allow users to customize their experience, such as setting default views, customizing notifications, or adjusting privacy settings.


### Performance Optimization

- **Code Splitting and Lazy Loading**: Optimize the application by splitting code and lazily loading components only when needed, reducing initial load times.

- **Optimized Asset Delivery**: Use tools like **Webpack** to optimize and minify assets, improving performance.

- **Caching Mechanisms**: Implement caching strategies using **Service Workers** or libraries like **React Query** to cache API responses and reduce unnecessary network requests.

- **Continuous Integration/Continuous Deployment (CI/CD)**: Set up CI/CD pipelines using platforms like **Jenkins** to automate testing and deployment processes.

---