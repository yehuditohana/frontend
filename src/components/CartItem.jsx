import React from "react";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

/**
 * CartItem component displays an individual item in the user's shopping cart
 * and provides functionalities to update quantity and remove the item.
 *
 * @param {Object} props - Component props
 * @param {Object} props.item - Item object to be displayed in the cart
 * @param {string} props.item.id - Unique identifier for the cart item
 * @param {string} props.item.name - Name of the cart item
 * @param {string} props.item.category - Category of the cart item
 * @param {number} props.item.quantity - Quantity of the item in the cart
 * @returns {JSX.Element} CartItem component displaying item details and actions
 */
const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const openModal = () => {
    navigate(`/cart?id=${item.id}`, { replace: false });
  };

  return (
    <div
      dir="rtl"
      className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all text-right"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2
            onClick={openModal}
            className="text-xl font-semibold text-blue-700 cursor-pointer hover:underline"
          >
            {item.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">קטגוריה: {item.category}</p>
        </div>

        <div className="flex flex-col items-center gap-2 md:items-end">
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-200 disabled:opacity-50"
            >
              <FiMinus />
            </button>
            <span className="text-lg font-semibold text-gray-800">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition"
            >
              <FiPlus />
            </button>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="mt-2 bg-red-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-red-600 transition-all"
            title="הסר מהעגלה"
          >
            <FiTrash2 className="text-sm" />
            <span className="text-sm">הסר</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;