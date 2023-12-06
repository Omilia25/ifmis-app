// trainingApi.js
import axios from 'axios';
import API_BASE_URL from '../config'; // Adjust the path accordingly

const saveTrainingSession = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/training`, data);

    // You can handle the response as needed
    return response.data;
  } catch (error) {
    console.error('Error saving training session:', error);
    throw error;
  }
};

export { saveTrainingSession };
