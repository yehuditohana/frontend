const BASE_URL = "http://localhost:8080/api/shopping-carts";

export const createCart = async (user) => {
  const response = await fetch(`${BASE_URL}/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error("Failed to create cart");
  return await response.json();
};

export const archiveCart = async (cartId) => {
  const response = await fetch(`${BASE_URL}/${cartId}/archive`, { method: "PUT" });
  if (!response.ok) throw new Error("Failed to archive cart");
  return await response.json();
};

export const activateCart = async (cartId) => {
  const response = await fetch(`${BASE_URL}/${cartId}/activate`, { method: "PUT" });
  if (!response.ok) throw new Error("Failed to activate cart");
  return await response.json();
};

export const deleteCart = async (cartId) => {
  const response = await fetch(`${BASE_URL}/${cartId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete cart");
};

export const getCartHistory = async (userId) => {
  const response = await fetch(`${BASE_URL}/history/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch cart history");
  return await response.json();
};