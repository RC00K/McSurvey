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

export const getStoreNumbers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/storenumbs`);
        console.log('Fetched store numbers', response.data);
        return response.data;
    } catch (error) {
        console.error('Error occurred while fetching store numbers', error);
        throw error;
    }
};

// export const getAccManager = async (storeNumber: string) => {
//     try {
//         const response = await axios.get(`${BASE_URL}/api/accmgr/${storeNumber}`);
//         console.log('Fetched account managers', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error occurred while fetching account managers', error);
//         throw error;
//     }
// };