import axios from 'axios';


const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchUsersAPI = async () => {
  return await axios.get(API_URL);
};

export const addUserAPI = async (user) => {
  return await axios.post(API_URL, user);
};

export const updateUserAPI = async (id, user) => {
  return await axios.put(`${API_URL}/${id}`, user);
};

export const deleteUserAPI = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};