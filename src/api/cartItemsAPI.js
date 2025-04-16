const BASE_URL = "http://localhost:8080/cart-items";

export const addItemToCart = async (cartId, itemId, quantity) => {
  const url = `${BASE_URL}/${cartId}/items/${itemId}?quantity=${quantity}`;
  const response = await fetch(url, { method: "POST" });
  if (!response.ok) throw new Error("Failed to add item to cart");
  return await response.json();
};

export const removeItemFromCart = async (cartId, itemId, quantity) => {
  const url = `${BASE_URL}/${cartId}/items/${itemId}?quantity=${quantity}`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to remove item from cart");
};