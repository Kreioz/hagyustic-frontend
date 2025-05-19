import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import ProductSelectionSidebar from "../Components/Common/ProductSelectionSidebar";

const fallbackImage =
  "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

// SearchResults Component
// Displays products that match the search query with clickable cards and action buttons
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState("");

  // Fetch products based on query
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products?name=${query}`
        );
        setResults(data.data || []);
      } catch {
        toast.error("Failed to fetch search results", { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const handleOpenSidebar = (product, type) => {
    setSelectedProduct(product);
    setActionType(type);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSelectedProduct(null);
    setActionType("");
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-14 text-center">Loading...</div>
    );
  }

  if (!results.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-14 text-center">
        <h2 className="text-xl font-semibold text-gray-700">No results found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Search Results for "{query}"
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div
              onClick={() => navigate(`/product/${product._id}`)}
              className="cursor-pointer block"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img
                  src={`${product.images[0]}?w=600&h=800&f=auto&q=80`}
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => (e.target.src = fallbackImage)}
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded shadow">
                  {product.mainCategory}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-yellow-600 font-medium mt-1">
                  €{product.price}
                </p>
              </div>
            </div>

            <div className="flex justify-between p-4">
              <button
                onClick={() => handleOpenSidebar(product, "wishlist")}
                className="p-2 bg-yellow-100 rounded-full hover:bg-yellow-200 transition"
              >
                <FaHeart className="text-yellow-600" size={18} />
              </button>
              <button
                onClick={() => handleOpenSidebar(product, "cart")}
                className="p-2 bg-yellow-100 rounded-full hover:bg-yellow-200 transition"
              >
                <FaShoppingBag className="text-yellow-600" size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isSidebarOpen && selectedProduct && (
        <ProductSelectionSidebar
          product={selectedProduct}
          actionType={actionType}
          onClose={handleCloseSidebar}
        />
      )}
    </div>
  );
};

export default SearchResults;
