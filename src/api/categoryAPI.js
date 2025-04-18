// src/api/categoryAPI.js

import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/categories";

/**
 * Fetches all categories from the backend.
 * @returns {Promise<Array>} Array of GeneralCategoryDTO
 */
export const fetchCategories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch categories:', error);
    throw error;
  }
};  

