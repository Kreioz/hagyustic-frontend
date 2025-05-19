import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import ProductSelectionSidebar from "../Common/ProductSelectionSidebar";

// Default fallback image if product has no image
const fallbackImage =
  "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

// ProductList Component
// Displays products in grid or list layout, with quick-add support for cart/wishlist
const ProductList = ({ products = [], viewMode = "grid" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState("");

  // Open sidebar with selected product and action type (cart/wishlist)
  const handleOpenSidebar = (product, type) => {
    setSelectedProduct(product);
    setActionType(type);
    setIsSidebarOpen(true);
  };

  // Close sidebar
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedProduct(null);
    setActionType("");
  };

  // Render a single product item (card or row)
  const renderProductItem = (product) => (
    <div
      key={product._id || product.id}
      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden ${
        viewMode === "grid"
          ? "flex flex-col"
          : "flex items-center justify-between p-4 gap-4"
      }`}
    >
      {/* Wishlist button (top-right) for grid view */}
      {viewMode === "grid" && (
        <button
          onClick={() => handleOpenSidebar(product, "wishlist")}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100 z-10"
          title="Add to Wishlist"
          aria-label={`Add ${product.name} to wishlist`}
        >
          <Heart className="text-black" size={20} />
        </button>
      )}

      {/* Product image */}
      <Link to={`/product/${product._id}`} className="flex-shrink-0">
        <img
          src={product.images?.[0] || product.image || fallbackImage}
          alt={product.name}
          onError={(e) => (e.target.src = fallbackImage)}
          className={`object-cover rounded-md ${
            viewMode === "grid"
              ? "w-full h-[400px]"
              : "w-24 h-24 sm:w-28 sm:h-28"
          }`}
          loading="lazy"
        />
      </Link>

      {/* Product info block */}
      <div className="flex-1 min-w-0 px-2">
        <h3 className="font-medium text-gray-800 text-base truncate mb-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-1 group-hover:line-clamp-none transition-all duration-200 ease-in-out mb-2">
          {product.description}
        </p>

        {/* Price and cart icon for grid view */}
        {viewMode === "grid" ? (
          <div className="flex items-center justify-between">
            <p className="font-bold text-indigo-600 text-base">
              €{product.price.toFixed(2)}
            </p>
            <button
              onClick={() => handleOpenSidebar(product, "cart")}
              className="text-indigo-600 hover:text-indigo-800 transition"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag size={20} />
            </button>
          </div>
        ) : (
          // Price only in list view (buttons come separately)
          <p className="font-bold text-indigo-600 text-lg">
            €{product.price.toFixed(2)}
          </p>
        )}
      </div>

      {/* List view: separate buttons under product info */}
      {viewMode === "list" && (
        <div className="flex flex-col items-end gap-2 min-w-[130px]">
          <button
            onClick={() => handleOpenSidebar(product, "cart")}
            className="w-full min-w-[130px] bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
          >
            Add to Cart
          </button>
          <button
            onClick={() => handleOpenSidebar(product, "wishlist")}
            className="w-full min-w-[130px] border border-gray-300 px-3 py-1 rounded hover:border-indigo-600 text-sm"
          >
            Add to Wishlist
          </button>
        </div>
      )}
    </div>
  );

  // Empty state message
  if (!products.length) {
    return (
      <div className="text-center text-gray-500 py-16 border border-dashed rounded-md">
        No products found with selected filters.
      </div>
    );
  }

  return (
    <>
      {/* Grid or list wrapper */}
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            : "flex flex-col gap-2"
        }`}
      >
        {products.map((product) => renderProductItem(product))}
      </div>

      {/* Slide-out sidebar for selecting size/color */}
      {isSidebarOpen && selectedProduct && (
        <ProductSelectionSidebar
          product={selectedProduct}
          actionType={actionType}
          onClose={handleCloseSidebar}
        />
      )}
    </>
  );
};

export default ProductList;
