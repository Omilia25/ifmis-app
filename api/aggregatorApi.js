import axios from 'axios';
import API_BASE_URL from '../config';

const registerAggregator = async (aggregatorData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/aggregator/register`, aggregatorData);

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    console.error('Error registering aggregator:', error);
    return { success: false, error: 'An error occurred while communicating with the server.' };
  }
};

const getAllAggregators = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/aggregator/all`);

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'Failed to get aggregators.' };
    }
  } catch (error) {
    console.error('Error getting aggregators:', error);
    return { success: false, error: 'An error occurred while communicating with the server.' };
  }
};

export { registerAggregator, getAllAggregators };





// // aggregatorApi.js
// import API_BASE_URL from '../config';

// const registerAggregator = async (aggregatorData) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/aggregator/register`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(aggregatorData),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       return { success: true, data };
//     } else {
//       return { success: false, error: data.error };
//     }
//   } catch (error) {
//     console.error('Error registering aggregator:', error);
//     return { success: false, error: 'An error occurred while communicating with the server.' };
//   }
// };

// const getAllAggregators = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/aggregator/all`);

//     const data = await response.json();

//     if (response.ok) {
//       return { success: true, data };
//     } else {
//       return { success: false, error: 'Failed to get aggregators.' };
//     }
//   } catch (error) {
//     console.error('Error getting aggregators:', error);
//     return { success: false, error: 'An error occurred while communicating with the server.' };
//   }
// };

// export { registerAggregator, getAllAggregators };
