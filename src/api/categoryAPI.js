const BASE_URL = "http://localhost:8080/categories";

export const getGeneralCategories = async () => {
  const response = await fetch(`${BASE_URL}/general`);
  if (!response.ok) throw new Error("Failed to fetch general categories");
  return await response.json();
};

export const getSubCategories = async (general) => {
  const url = `${BASE_URL}/sub?general=${encodeURIComponent(general)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch subcategories");
  return await response.json();
};

export const getSpecificCategories = async (general, sub) => {
  const url = `${BASE_URL}/specific?general=${encodeURIComponent(general)}&sub=${encodeURIComponent(sub)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch specific categories");
  return await response.json();
};