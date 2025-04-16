import React, { useState, useEffect } from "react";
import { useItems } from "../context/ItemContext";
import { useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import ItemModal from "../components/ItemModal";
import { FiSearch } from "react-icons/fi";

/**
 * ItemsPage component displays a list of items with filtering and searching options.
 * It allows users to:
 * - Search for items by name or barcode.
 * - Filter items by category.
 * - View detailed item information in a modal when an item is selected.
 * - Load more items as the user scrolls down (infinite scroll).
 *
 * @returns {JSX.Element} The ItemsPage component displaying items, filters, search input, and modals.
 */
const ItemsPage = () => {
  const { items, categories, searchItems, fetchItemsByCategory } = useItems(); // Access item data and functions from ItemContext
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected item category filter
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [filteredItems, setFilteredItems] = useState([]); // State for filtered items based on search or category
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery); // State for debounced search query

  const [searching, setSearching] = useState(false); // State for managing the loading state during search
  const [visibleItems, setVisibleItems] = useState(30); // State to track the number of visible items

  const [searchParams] = useSearchParams(); // Hook for accessing search parameters in the URL
  const itemId = searchParams.get("id"); // Extract item ID from URL
  const selectedItem = itemId
    ? items.find((item) => String(item.id) === itemId) // Find the selected item based on the item ID
    : null;

  // Debounced search query state update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 700); // Apply debounce of 700ms

    return () => {
      clearTimeout(timeoutId); // Cleanup previous timeout on every change to search query
    };
  }, [searchQuery]);

  // Effect to apply filters (search query or category)
  useEffect(() => {
    const applyFilters = async () => {
      setSearching(true); // Set loading state during search
      try {
        let results = [];

        // Apply search query filter if present
        if (debouncedSearchQuery.trim()) {
          results = await searchItems(debouncedSearchQuery);
        }
        // Apply category filter if selected
        else if (selectedCategory) {
          results = await fetchItemsByCategory(selectedCategory);
        }
        // If no filter is applied, show all items
        else {
          results = items;
        }

        setFilteredItems(results); // Update the filtered items state
      } catch (error) {
        console.error("Error applying filters:", error);
        setFilteredItems([]); // Handle error by clearing the filtered items list
      } finally {
        setSearching(false); // Stop loading state after applying filters
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

  // Handle loading more items on scroll
  const loadMoreItems = () => {
    if (visibleItems < filteredItems.length) {
      setVisibleItems((prev) => prev + 30); // Load 30 more items
    }
  };

  // Effect to handle infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight;
      if (bottom) {
        loadMoreItems(); // Load more items when scrolled to the bottom
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredItems, visibleItems]);

  /**
   * Handles changes to the search input.
   *
   * @param {Event} e - The event object triggered by the user input.
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value); // Update search query state
  };

  return (
    <div dir="rtl" className="px-[5%] text-right">
      <h1 className="text-3xl font-bold mb-6">מוצרים</h1>
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {/* Category Filter */}
        <div>
          <label className="mr-2 font-medium">קטגוריה: </label>
          <select
            onChange={(e) => {
              setSelectedCategory(e.target.value || null);
              setSearchQuery(""); // Clear search query when changing category
            }}
            className="p-2 border rounded-md"
          >
            <option value="">הכל</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full max-w-md">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="חיפוש לפי שם מוצר או ברקוד"
            value={searchQuery}
            onChange={handleSearchChange} // Update search query on input change
            className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>
      {/* Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredItems.slice(0, visibleItems).map((item) => (
            <ItemCard
              key={item.id || `item-${Math.random()}`}
              item={item} // Display each item using the ItemCard component
            />
          ))}
        </div>
      ) : (
        !searching && (
          <p className="text-gray-500 italic text-center py-10">
            לא נמצאו פריטים שתואמים את החיפוש
          </p>
        ) // Display message if no items match the search or category
      )}
      {/* Modal (if ID is in URL) */}
      {selectedItem && <ItemModal item={selectedItem} />}{" "}
      {/* Show item modal if selected */}
    </div>
  );
};

export default ItemsPage;