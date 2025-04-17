import React, { useState, useEffect } from "react";
import { useItems } from "../context/ItemContext";
import { useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import ItemModal from "../components/ItemModal";
import { FiSearch } from "react-icons/fi";
import CategorySidebar from "../components/CategorySidebar"; // קומפוננטת הקטגוריות

const ItemsPage = () => {
  const { items, searchItems, fetchItemsByCategory } = useItems();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [searching, setSearching] = useState(false);
  const [visibleItems, setVisibleItems] = useState(30);

  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("id");
  const selectedItem = itemId ? items.find((item) => String(item.id) === itemId) : null;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 700);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const applyFilters = async () => {
      setSearching(true);
      try {
        let results = [];

        if (debouncedSearchQuery.trim()) {
          results = await searchItems(debouncedSearchQuery);
        } else if (selectedCategory) {
          results = await fetchItemsByCategory(selectedCategory);
        } else {
          results = items;
        }

        setFilteredItems(results);
      } catch (error) {
        console.error("Error applying filters:", error);
        setFilteredItems([]);
      } finally {
        setSearching(false);
      }
    };

    applyFilters();
  }, [
    debouncedSearchQuery,
    selectedCategory,
    items,
    searchItems,
    fetchItemsByCategory,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight;
      if (bottom) {
        setVisibleItems((prev) => prev + 30);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredItems, visibleItems]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  return (
    <div dir="rtl" className="px-[5%] text-right">
      <h1 className="text-3xl font-bold mb-6">מוצרים</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar – קטגוריות */}
        <CategorySidebar onSelectCategory={(category) => {
          setSelectedCategory(category);
          setSearchQuery(""); // איפוס חיפוש כשבוחרים קטגוריה
        }} />

        {/* תוכן ראשי */}
        <div className="flex-1">
          {/* חיפוש */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full max-w-md mb-6">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="חיפוש לפי שם מוצר או ברקוד"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* מוצרים */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredItems.slice(0, visibleItems).map((item) => (
                <ItemCard
                  key={item.id || `item-${Math.random()}`}
                  item={item}
                />
              ))}
            </div>
          ) : (
            !searching && (
              <p className="text-gray-500 italic text-center py-10">
                לא נמצאו פריטים שתואמים את החיפוש
              </p>
            )
          )}
        </div>
      </div>

      {/* מודאל של פריט */}
      {selectedItem && <ItemModal item={selectedItem} />}
    </div>
  );
};

export default ItemsPage;