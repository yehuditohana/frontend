import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";
import {
  createCart,
  deleteCart,
  activateCart,
  getCartHistory,
} from "../api/cartAPI";
import {
  addItemToCart,
  removeItemFromCart,
} from "../api/cartItemsAPI";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [activeCartId, setActiveCartId] = useState(null);
  const [savedCarts, setSavedCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchCartHistory();
    }
  }, [currentUser]);

  const fetchCartHistory = async () => {
    try {
      setLoading(true);
      const carts = await getCartHistory(currentUser.id);
      setSavedCarts(carts);
    } catch (err) {
      setError("שגיאה בטעינת היסטוריית עגלות");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startNewCart = async () => {
    try {
      setLoading(true);
      const cart = await createCart(currentUser);
      setActiveCartId(cart.id);
      setCartItems([]);
    } catch (err) {
      setError("שגיאה ביצירת עגלה חדשה");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item, _, quantity = 1) => {
    if (!activeCartId) return;
    try {
      const updatedItem = await addItemToCart(activeCartId, item.id, quantity);
      const existingIndex = cartItems.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        const updated = [...cartItems];
        updated[existingIndex].quantity += quantity;
        setCartItems(updated);
      } else {
        setCartItems([...cartItems, { ...item, quantity }]);
      }
    } catch (err) {
      setError("שגיאה בהוספת מוצר לעגלה");
    }
  };

  const removeFromCart = async (itemId, quantity = 1) => {
    if (!activeCartId) return;
    try {
      await removeItemFromCart(activeCartId, itemId, quantity);
      const updated = cartItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - quantity }
          : item
      ).filter((item) => item.quantity > 0);
      setCartItems(updated);
    } catch (err) {
      setError("שגיאה בהסרת מוצר מהעגלה");
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;
    if (newQuantity > item.quantity) {
      addToCart(item, null, newQuantity - item.quantity);
    } else {
      removeFromCart(itemId, item.quantity - newQuantity);
    }
  };

  const clearCart = async () => {
    if (!activeCartId) return;
    try {
      await deleteCart(activeCartId);
      setCartItems([]);
      setActiveCartId(null);
    } catch (err) {
      setError("שגיאה בניקוי העגלה");
    }
  };

  const loadSavedCart = async (cartId) => {
    try {
      await activateCart(cartId);
      setActiveCartId(cartId);
      // NOTE: ייתכן שתצטרכי להביא את הפריטים מחדש כאן - תלוי בבאקאנד שלך
    } catch (err) {
      setError("שגיאה בטעינת עגלה שמורה");
    }
  };

  const getSupermarketTotals = () => {
    const totals = {};
    cartItems.forEach((item) => {
      Object.entries(item.prices).forEach(([market, price]) => {
        if (!totals[market]) totals[market] = 0;
        totals[market] += price * item.quantity;
      });
    });
    return totals;
  };

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        savedCarts,
        activeCartId,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        startNewCart,
        loadSavedCart,
        getSupermarketTotals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);