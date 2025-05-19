import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../Redux/Slice/WishlistSlice";
import { addToCart } from "../../Redux/Slice/CartSlice";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

// Wishlist Component
// Displays saved products with the ability to move them to cart or remove
const Wishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist || { items: [] });

  const fallbackImage = "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

  const handleRemoveItem = (id, size, color) => {
    dispatch(removeFromWishlist({ id, size, color }));
  };

  const handleAddToCart = (item) => {
    const { id, name, size, color, price, image } = item;
    const cartItem = { id, name, size, color, price, image, quantity: 1 };
    dispatch(addToCart(cartItem));
    dispatch(removeFromWishlist({ id, size, color }));
  };

  const renderWishlistItem = (item) => (
    <div
      key={`${item.id}-${item.size}-${item.color}`}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg border border-gray-100 flex flex-col"
    >
      <div className="relative">
        <img
          src={item.image || fallbackImage}
          alt={item.name}
          className="w-full h-60 object-cover"
          onError={(e) => (e.target.src = fallbackImage)}
        />
        <button
          onClick={() => handleRemoveItem(item.id, item.size, item.color)}
          className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
          aria-label="Remove from Wishlist"
        >
          <FaTrash />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
        <div className="text-sm text-gray-600">
          Size: <span className="font-medium">{item.size}</span> | Color:{" "}
          <span
            className="inline-block w-4 h-4 rounded-full border ml-1 align-middle"
            style={{ backgroundColor: item.color }}
          ></span>
        </div>
        <p className="text-lg font-bold text-purple-600">
          €{item.price.toFixed(2)}
        </p>
        <button
          onClick={() => handleAddToCart(item)}
          className="mt-auto flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition text-sm"
        >
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Your Wishlist is Empty
        </h1>
        <Link
          to="/products"
          className="inline-block mt-4 text-white bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-md transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(renderWishlistItem)}
      </div>
    </div>
  );
};

export default Wishlist;
