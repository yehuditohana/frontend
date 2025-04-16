const BASE_URL = "http://localhost:8080/item";

/**
 * Search items by name
 * @param {string} name
 * @returns {Promise<Array>}
 */
export const searchItemsByName = async (name) => {
  const response = await fetch(`${BASE_URL}/search/by-name?name=${encodeURIComponent(name)}`);
  if (!response.ok) {
    throw new Error("Failed to search items by name");
  }
  return await response.json();
};

/**
 * Get item by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const getItemById = async (id) => {
  const response = await fetch(`${BASE_URL}/search/by-id/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch item by ID");
  }
  return await response.json();
};

/**
 * Get items by general & subcategory with pagination
 * @param {string} general
 * @param {string} sub
 * @param {number} page
 * @param {number} size
 * @returns {Promise<Array>}
 */
export const getItemsByCategory = async (general, sub, page = 0, size = 10) => {
    const url = `${BASE_URL}?generalCategory=${encodeURIComponent(general)}&subCategory=${encodeURIComponent(sub)}&page=${page}&size=${size}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch items by category");
    return await response.json();
  };