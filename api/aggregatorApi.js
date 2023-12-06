// aggregatorApi.js
import axios from 'axios';
import API_BASE_URL from '../config'; 

const registerAggregator = async (aggregatorData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/aggregator/register`, aggregatorData);

    if (response.status === 201) {
      return { success: true, data: response.data };
    }

    // Handle non-201 status codes
    return { success: false, error: response.data.error || 'Unexpected response from the server.' };
  } catch (error) {
    console.error('Error registering aggregator:', error.response || error);
    return { success: false, error: 'An error occurred while communicating with the server.' };
  }
};

const getAllAggregators = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/aggregator/all`);

    if (response.status === 200) {
      return { success: true, data: response.data };
    }

    // Handle non-200 status codes
    return { success: false, error: 'Failed to get aggregators. Please try again later.' };
  } catch (error) {
    console.error('Error getting aggregators:', error.response || error);
    return { success: false, error: 'An error occurred while communicating with the server.' };
  }
};

export { registerAggregator, getAllAggregators };
