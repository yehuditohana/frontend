import React, { createContext, useContext, useState, useEffect } from "react";
import { getItemsByCategory, searchItemsByName } from "../api/itemAPI";
import { fetchCategories as fetchCategoriesAPI } from "../api/categoryAPI";

const ItemContext = createContext();

/**
 * ItemProvider manages the state and data operations related to items and categories.
 * It provides context for item list, loading state, errors, and category filtering.
 */
export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * Loads category hierarchy from the backend.
   */
  const loadCategories = async () => {
    try {
      setLoading(true);
      const result = await fetchCategoriesAPI();
      setCategories(result);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch items by general and sub category.
   *
   * @param {string} generalCategory - The general category name.
   * @param {string} subCategory - The sub category name.
   * @returns {Promise<Array>} List of items.
   */
  const fetchItemsByCategory = async (generalCategory, subCategory) => {
    try {
      setLoading(true);
      const results = await getItemsByCategory(generalCategory, subCategory);
      setItems(results);
      return results;
    } catch (err) {
      setError("Failed to fetch items by category");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search items by query string.
   *
   * @param {string} query - Search input string.
   * @returns {Promise<Array>} List of matching items.
   */
  const searchItems = async (query) => {
    try {
      setLoading(true);
      const results = await searchItemsByName(query);
      setItems(results);
      return results;
    } catch (err) {
      setError("Search error");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <ItemContext.Provider
      value={{
        items,
        categories,
        loading,
        error,
        fetchItemsByCategory,
        searchItems,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

/**
 * Custom hook to access item context.
 */
export const useItems = () => useContext(ItemContext);