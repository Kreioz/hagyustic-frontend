import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import ProductSelectionSidebar from "../Common/ProductSelectionSidebar";
import axios from "axios";
import { toast } from "react-toastify";

// FeaturedProducts Component
// Displays one random product from each category: MEN, WOMEN, CHILD, ACCESSORIES
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState("");

  const fallbackImage = "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

  // Fetch and filter products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        const allProducts = response.data.data || [];

        // Pick one random product from each desired category
        const categories = ["MEN", "WOMEN", "CHILD", "ACCESSORIES"];
        const picked = [];

        categories.forEach((category) => {
          const group = allProducts.filter((p) => p.mainCategory === category);
          if (group.length > 0) {
            const randomIndex = Math.floor(Math.random() * group.length);
            picked.push(group[randomIndex]);
          }
        });

        setProducts(picked);
      } catch (error) {
        toast.error("Failed to fetch products", { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Trigger sidebar with selected product
  const handleOpenSidebar = (product, type) => {
    setSelectedProduct(product);
    setActionType(type);
    setIsSidebarOpen(true);
  };

  // Close product option sidebar
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedProduct(null);
    setActionType("");
  };

  // Render individual product card with animations and action buttons
  const renderProductCard = (product, index) => (
    <motion.div
      key={product._id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <Link to={`/product/${product._id}`}>
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
      </Link>

      <div className="flex justify-between p-4">
        <button
          onClick={() => handleOpenSidebar(product, "wishlist")}
          className="p-2 bg-yellow-100 rounded-full hover:bg-yellow-200 transition"
        >
          <Heart className="text-yellow-600" size={18} />
        </button>
        <button
          onClick={() => handleOpenSidebar(product, "cart")}
          className="p-2 bg-yellow-100 rounded-full hover:bg-yellow-200 transition"
        >
          <ShoppingBag className="text-yellow-600" size={18} />
        </button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-14 text-center">Loading...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      {/* Section heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-800">
        Handpicked Highlights for You
      </h2>

      {/* Product grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => renderProductCard(product, index))}
      </div>

      {/* Slide-in sidebar for wishlist/cart selection */}
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

export default FeaturedProducts;
