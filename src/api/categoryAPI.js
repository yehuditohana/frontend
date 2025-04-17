import axios from 'axios';
const BASE_URL = "http://localhost:8080/api/categories";



export const fetchCategories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; //Array of GeneralCategoryDTO
  } catch (error) {
    console.error('❌ Failed to fetch categories:', error);
    throw error;
  }
};