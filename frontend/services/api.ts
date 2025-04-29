// /services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-api-url.com', // replace with your backend API
});

export const getBugs = async () => {
  try {
    const response = await api.get('/bugs');
    return response.data;
  } catch (error) {
    console.error('Error fetching bugs:', error);
    throw error;
  }
};

export const createBug = async (bugData: any) => {
  try {
    const response = await api.post('/bugs', bugData);
    return response.data;
  } catch (error) {
    console.error('Error creating bug:', error);
    throw error;
  }
};
