import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/Slice/CartSlice";
import { addToWishlist } from "../../Redux/Slice/WishlistSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// ProductSelectionSidebar Component
// Shows a side panel for selecting size & color before adding product to cart or wishlist
const ProductSelectionSidebar = ({ product, actionType, onClose }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Default fallback image if product image is missing
  const fallbackImage =
    "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

  // Pre-select first available size and color on load
  useEffect(() => {
    setSelectedSize(product?.availableSizes?.[0] || "");
    setSelectedColor(product?.availableColors?.[0] || "");
  }, [product]);

  // Add item to cart or wishlist
  const handleConfirm = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color.", { autoClose: 2000 });
      return;
    }

    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || fallbackImage,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    };

    if (actionType === "cart") {
      dispatch(addToCart(item));
      toast.success("Added to cart", { autoClose: 2000 });
    } else if (actionType === "wishlist") {
      dispatch(addToWishlist(item));
      toast.success("Added to wishlist", { autoClose: 2000 });
    }

    onClose();
  };

  // Render size or color options as buttons
  const renderOptionButton = (value, isColor = false, selectedValue) => (
    <button
      onClick={() =>
        isColor ? setSelectedColor(value) : setSelectedSize(value)
      }
      className={
        isColor
          ? `w-8 h-8 rounded-full border-2 transition ${
              selectedValue === value
                ? "border-indigo-600 scale-110 shadow"
                : "border-gray-200 hover:border-indigo-400"
            }`
          : `px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedValue === value
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
            }`
      }
      style={isColor ? { backgroundColor: value } : null}
      title={isColor ? value : null}
    >
      {isColor ? "" : value}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-lg p-6 overflow-y-auto animate-slide-in-left">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Select Options</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Product preview */}
        <div className="mb-6">
          <img
            src={`${product.images?.[0] || product.image || fallbackImage}?w=400&h=320&dpr=auto&f=auto&q=80`}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-lg mb-4"
            onError={(e) => (e.target.src = fallbackImage)}
            loading="lazy"
          />
          <h4 className="text-lg font-medium text-gray-800">{product.name}</h4>
          <p className="text-indigo-600 font-medium">
            €{product.price?.toFixed(2)}
          </p>
          <Link
            to={`/product/${product._id}`}
            onClick={onClose}
            className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
          >
            View Product Details
          </Link>
        </div>

        {/* Size selection */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Size</h4>
          <div className="flex gap-2 flex-wrap">
            {product.availableSizes?.map((size) => (
              <React.Fragment key={size}>
                {renderOptionButton(size, false, selectedSize)}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Color selection */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Color</h4>
          <div className="flex gap-3 flex-wrap">
            {product.availableColors?.map((color) => (
              <React.Fragment key={color}>
                {renderOptionButton(color, true, selectedColor)}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Final CTA button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
        >
          {actionType === "cart" ? "Add to Cart" : "Add to Wishlist"}
        </button>
      </div>
    </div>
  );
};

export default ProductSelectionSidebar;
