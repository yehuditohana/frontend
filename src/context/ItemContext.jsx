import React, { createContext, useContext, useState, useEffect } from "react";
import { getItemsByCategory, searchItemsByName } from "../api/itemAPI";
import { getGeneralCategories } from "../api/categoryAPI";
const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // נטען קטגוריות בהתחלה
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result = await getGeneralCategories();
      setCategories(result);
    } catch (err) {
      setError("נכשל בטעינת קטגוריות");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsByCategory = async (generalCategory, subCategory) => {
    try {
      setLoading(true);
      const results = await getItemsByCategory(generalCategory, subCategory);
      setItems(results);
      return results;
    } catch (err) {
      setError("נכשל בטעינת פריטים לפי קטגוריה");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async (query) => {
    try {
      setLoading(true);
      const results = await searchItemsByName(query);
      setItems(results);
      return results;
    } catch (err) {
      setError("שגיאה בעת החיפוש");
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

export const useItems = () => useContext(ItemContext);