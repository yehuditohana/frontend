import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "react-router-dom";
import { FiShoppingCart, FiSave } from "react-icons/fi";
import CartItem from "../components/CartItem";
import ItemModal from "../components/ItemModal"; // ✔ שונה כאן
import { useItems as useProducts } from "../context/ItemContext";
import { useUser } from "../context/UserContext";

const CartPage = () => {
  const {
    cartItems,
    clearCart,
    saveCart,
    getSupermarketTotals,
    activeCartId,
  } = useCart();
  const { products } = useProducts();
  const { currentUser } = useUser();

  const [searchParams] = useSearchParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [cartName, setCartName] = useState("");

  const productId = searchParams.get("id");
  const selectedProduct = productId
    ? products.find((p) => String(p.id) === productId)
    : null;

  const supermarketTotals = getSupermarketTotals();
  const [saveMessage, setSaveMessage] = useState("");

  const handleSaveCart = async () => {
    const savedCart = await saveCart(cartName);
    if (savedCart) {
      setSaveMessage("העגלה נשמרה בהצלחה! ✅");
      setTimeout(() => setSaveMessage(""), 3000);
    }
    setCartName("");
    setShowSaveModal(false);
  };

  return (
    <div dir="rtl" className="max-w-6xl mx-auto px-[5%] py-12 text-right">
      <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-10">
        עגלת הקניות שלך 🛒
      </h1>

      {saveMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md shadow-md text-center mb-4">
          {saveMessage}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="bg-white text-center p-10 rounded-2xl shadow-md text-gray-600">
          <FiShoppingCart className="mx-auto text-5xl mb-4 text-blue-500" />
          <p className="text-lg">
            העגלה שלך ריקה! ניתן להוסיף פריטים לבחירתך 🛍️
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-6 gap-4 flex-wrap">
            <div className="relative group">
              <button
                onClick={() => setShowSaveModal(true)}
                disabled={!currentUser || !activeCartId}
                className={`font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2
                  ${
                    currentUser && activeCartId
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                <FiSave />
                שמור עגלה
              </button>
              {!currentUser && (
                <div className="absolute bottom-full mb-2 right-0 bg-black text-white text-xs px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  על מנת לשמור עגלות עליך להתחבר
                </div>
              )}
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
            >
              נקה עגלה
            </button>
          </div>

          <div className="space-y-6">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-12 bg-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100">
            <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
              מחירים בסופרמרקטים 💰
            </h2>
            <div className="space-y-2">
              {Object.entries(supermarketTotals).map(([supermarket, total]) => (
                <div
                  key={supermarket}
                  className="flex justify-between items-center text-lg font-medium border-b border-blue-100 py-2 last:border-b-0"
                >
                  <span className="text-gray-700">{supermarket}</span>
                  <span className="text-gray-900 font-semibold">
                    ₪{total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ✔ שונה גם כאן לשם הנכון */}
          {selectedProduct && <ItemModal item={selectedProduct} />}
        </>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              האם את/ה בטוח/ה שברצונך לרוקן את כל העגלה?
            </h3>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  clearCart();
                  setShowConfirm(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                כן, נקה
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">שמור עגלה</h3>
            <input
              type="text"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              placeholder="הקלד שם לעגלה (אופציונלי)"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleSaveCart}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                שמור
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;