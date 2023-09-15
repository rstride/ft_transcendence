import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:3001', // Backend server URL
});
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
};
