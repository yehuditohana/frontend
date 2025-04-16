import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const increaseQty = () => setQuantity((q) => Math.min(q + 1, 99));
  const decreaseQty = () => setQuantity((q) => Math.max(q - 1, 1));
  const openModal = () => navigate(`/items?id=${item.id}`, { replace: false });

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(item, null, quantity);
      setQuantity(1);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!item || !item.prices) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 text-right">
        <p className="text-gray-500">מידע על הפריט אינו זמין</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all duration-300 border border-gray-100 text-right">
      <h2 onClick={openModal} className="text-2xl font-bold text-blue-700 mb-1 cursor-pointer hover:underline">
        {item.name}
      </h2>
      <p className="text-sm text-gray-500 mb-4">{item.category}</p>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">מחירים בסופרמרקטים:</h3>
        <div className="space-y-1">
          {Object.entries(item.prices).map(([market, price]) => (
            <div key={market} className="flex justify-between text-gray-700 text-sm bg-gray-50 px-3 py-1 rounded-md border">
              <span>{market}</span>
              <span className="font-medium">₪{price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`${isAdding ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold px-4 py-2 rounded-lg shadow-md transition`}
        >
          {isAdding ? "מוסיף..." : "הוסף לעגלה"}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={decreaseQty}
            disabled={quantity <= 1 || isAdding}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full disabled:opacity-50 transition"
          >
            –
          </button>
          <input
            type="number"
            value={quantity}
            min="1"
            max="99"
            disabled={isAdding}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 1 && val <= 99) setQuantity(val);
            }}
            className="w-12 text-center border border-gray-300 rounded-md py-1 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={increaseQty}
            disabled={isAdding}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full transition disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;