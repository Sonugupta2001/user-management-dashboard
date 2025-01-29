import axios from 'axios';
import { fetchUsersAPI, addUserAPI, updateUserAPI, deleteUserAPI } from '../services/api';

jest.mock('axios');

describe('API Services', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    company: { name: 'Test Corp' }
  };

  beforeEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
    axios.put.mockReset();
    axios.delete.mockReset();
  });

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
});