// Function to split full name into firstName and lastName
export const splitFullName = (fullName) => {
    const [firstName, ...lastNameParts] = fullName.trim().split(' ');
    const lastName = lastNameParts.join(' ');
    return { firstName, lastName };
  };
  
  // Function to combine firstName and lastName into full name
  export const combineName = (firstName, lastName) => {
    return `${firstName} ${lastName}`.trim();
  };
  
  // Function to handle success messages
  export const showSuccessMessage = (setSuccessMessage, setOpenSnackbar, message) => {
    setSuccessMessage(message);
    setOpenSnackbar(true);
};