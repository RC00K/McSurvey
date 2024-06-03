import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const getSurveys = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/surveys`);
        console.log('Fetched surveys', response.data);
        return response.data;
    } catch (error) {
        console.error('Error occurred while fetching surveys', error);
        throw error;
    }
};