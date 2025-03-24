// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Backend URL

export const processTextAndFiles = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/process-all`, formData, { // New endpoint: /process-all
            headers: {
                'Content-Type': 'multipart/form-data', // Important for sending files
            },
        });
        return response.data;
    } catch (error) {
        console.error("API Error processing text and files:", error);
        throw error;
    }
};


export const askQuestion = async (summary, question) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/ask`, { summary, question });
        return response.data;
    } catch (error) {
        console.error("API Error asking question:", error);
        throw error;
    }
};