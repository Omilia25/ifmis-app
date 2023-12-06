// farmerApi.js
import axios from 'axios';
import API_BASE_URL from '../config'; // Adjust the path based on your project structure

export const registerFarmer = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/farmers/register`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error registering farmer:', error);
    return { success: false, error: error.message || 'Failed to register farmer.' };
  }
};
