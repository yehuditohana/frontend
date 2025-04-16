import React, { useEffect, useState } from "react";
import { FiArchive, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { getCartHistory, deleteCart } from "../api/cartAPI";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const SavedCartsPage = () => {
  const [saved, setSaved] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const { loadCart } = useCart();
  const { currentUser, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedCarts = async () => {
      try {
        const carts = await getCartHistory(currentUser.id);
        carts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSaved(carts);
      } catch (err) {
        console.error("Error loading saved carts:", err);
      }
    };

    if (!loading && !currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser) {
      fetchSavedCarts();
    }
  }, [currentUser, loading, navigate]);

  const confirmDelete = (cart) => {
    setSelectedCart(cart);
    setShowDeleteConfirm(true);
  };

  const confirmLoad = (cart) => {
    setSelectedCart(cart);
    setShowLoadConfirm(true);
  };

  const removeCart = async () => {
    try {
      await deleteCart(selectedCart.id);
      const updatedCarts = await getCartHistory(currentUser.id);
      setSaved(updatedCarts);
      setDeleteSuccess(true);
    } catch (err) {
      console.error("Error deleting cart:", err);
      setDeleteSuccess(false);
    } finally {
      setShowDeleteConfirm(false);
      setSelectedCart(null);
    }
  };

  const loadSelectedCart = () => {
    loadCart(selectedCart.items);
    setShowLoadConfirm(false);
    navigate("/cart");
  };

  if (loading || !currentUser) return null;

  return (
    <div dir="rtl" className="max-w-6xl mx-auto px-[5%] py-12 text-right">
      <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-10 flex items-center justify-center gap-2">
        עגלות שמורות
        <FiArchive className="text-blue-600" />
      </h1>

      {deleteSuccess && (
        <div className="bg-green-100 p-4 rounded-lg text-center mb-4">
          <p className="text-green-600">העגלה נמחקה בהצלחה!</p>
        </div>
      )}

      {saved.length === 0 ? (
        <div className="bg-white text-center p-10 rounded-2xl shadow-md text-gray-600">
          <FiShoppingCart className="mx-auto text-5xl mb-4 text-blue-500" />
          <p className="text-lg">לא נשמרו עגלות עד כה</p>
        </div>
      ) : (
        <div className="space-y-6">
          {saved.map((cart) => (
            <div key={cart.id} className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-blue-700">{cart.name}</h3>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-500">
                    {new Date(cart.createdAt).toLocaleString("he-IL")}
                  </p>
                  <button
                    onClick={() => confirmDelete(cart)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="מחק עגלה"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="bg-gray-100 p-3 rounded-md shadow">
                      <p className="text-md font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">× {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => confirmLoad(cart)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition w-full"
              >
                טען עגלה
              </button>
            </div>
          ))}
        </div>
      )}

      {showDeleteConfirm && selectedCart && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              האם את/ה בטוח/ה שברצונך למחוק את "{selectedCart.name}"?
            </h3>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={removeCart}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                כן, מחק
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedCart(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoadConfirm && selectedCart && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              טעינת העגלה תחליף את כל המוצרים שנמצאים כעת בעגלה, האם לטעון את "{selectedCart.name}"?
            </h3>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={loadSelectedCart}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                כן, טען
              </button>
              <button
                onClick={() => {
                  setShowLoadConfirm(false);
                  setSelectedCart(null);
                }}
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

export default SavedCartsPage;