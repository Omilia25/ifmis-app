// FarmerGroupApi.js
import axios from 'axios';
import API_BASE_URL from '../config'; // Fix the space after '../config'

export const createFarmerGroup = async (data) => {
  try {
    console.log('Request Payload:', data); // Log the payload before making the request

    const response = await axios.post(`${API_BASE_URL}/farmer-group/create`, data);

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating farmer group:', error);
    return { success: false, error: error.message || 'Failed to register farmer group.' };
  }
};
