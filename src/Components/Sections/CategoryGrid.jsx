import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// Fallback image in case category image fails to load
const fallbackImage =
  "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

/**
 * CategoryGrid Component
 * Displays category cards with animated entrance and fallback for images.
 */
const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        setCategories(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center text-gray-600">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
        Shop by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={`${cat.name}-${index}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="group cursor-pointer"
          >
            <Link
              to={`/products?mainCategory=${encodeURIComponent(cat.name)}`}
              className="block w-full aspect-[3/4] overflow-hidden rounded-xl relative bg-gray-100"
            >
              <img
                src={cat.image}
                alt={cat.name}
                onError={(e) => (e.target.src = fallbackImage)}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <h3 className="text-center mt-2 text-lg font-semibold text-gray-800">
              {cat.name}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
