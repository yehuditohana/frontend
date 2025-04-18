import React, { useEffect, useState } from "react";
import { fetchCategories } from "../api/categoryAPI";

const CategorySidebar = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [selectedGeneral, setSelectedGeneral] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await fetchCategories();
        console.log("📦 קטגוריות שהתקבלו מה־API:", data); 
        setCategories(data);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      }
    };
   
    fetchAll();
  }, []);

  useEffect(() => {
    fetchCategories().then((data) => {
      const map = {};
      data.forEach((item) => {
        const { generalCategory, subCategory, specificCategory } = item;
  
        if (!map[generalCategory]) map[generalCategory] = {};
        if (!map[generalCategory][subCategory]) map[generalCategory][subCategory] = [];
  
        if (!map[generalCategory][subCategory].includes(specificCategory)) {
          map[generalCategory][subCategory].push(specificCategory);
        }
      });
      setCategoriesMap(map);
    });
  }, []);
  

  const goBackToGeneral = () => {
    setSelectedGeneral(null);
    setSelectedSub(null);
  };

  const goBackToSub = () => {
    setSelectedSub(null);
  };

  return (
    <div className="w-full md:w-1/4 p-4 border rounded-lg bg-white shadow-md text-right">
      {!selectedGeneral && (
        <>
          <h2 className="text-xl font-bold mb-4">קטגוריות</h2>
          <ul className="space-y-2">
            {categories.map((cat, index) => (
              <li
                key={`${cat.generalCategory}-${index}`}
                className="cursor-pointer hover:underline text-blue-800 font-medium"
                onClick={() => setSelectedGeneral(cat)}
              >
                {cat.generalCategory}
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedGeneral && !selectedSub && (
        <>
          <button
            className="text-sm text-gray-600 underline mb-2"
            onClick={goBackToGeneral}
          >
            ← חזרה לקטגוריות כלליות
          </button>
          <h3 className="text-lg font-semibold mb-3">
            {selectedGeneral.generalCategory}
          </h3>
          <ul className="space-y-1">
            {selectedGeneral.subCategories.map((sub, index) => (
              <li
                key={`${sub.subCategory}-${index}`}
                className="cursor-pointer text-blue-700 hover:underline"
                onClick={() => setSelectedSub(sub)}
              >
                {sub.subCategory}
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedGeneral && selectedSub && (
        <>
          <button
            className="text-sm text-gray-600 underline mb-2"
            onClick={goBackToSub}
          >
            ← חזרה לתתי קטגוריות
          </button>
          <h4 className="text-md font-semibold mb-2">
            {selectedSub.subCategory}
          </h4>
          <ul className="space-y-1 pl-2 border-l">
            {selectedSub.specificCategories.map((spec, index) => (
              <li
                key={`${spec}-${index}`}
                className="cursor-pointer text-blue-600 hover:underline"
                //onClick={() => onSelectCategory(spec)}
                onClick={() => onSelectCategory({
                  generalCategory: selectedGeneral.generalCategory,
                  subCategory: selectedSub.subCategory,
                  specificCategory: spec
                })}
                
              >
                {spec}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default CategorySidebar;



