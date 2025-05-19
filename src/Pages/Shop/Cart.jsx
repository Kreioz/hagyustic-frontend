import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaHeart } from "react-icons/fa";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../../Redux/Slice/CartSlice";
import { addToWishlist } from "../../Redux/Slice/WishlistSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Cart Component
// Allows users to adjust quantity, remove items, save to wishlist, or proceed to checkout
const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );

  const fallbackImage =
    "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

  const handleQuantityChange = (id, size, color, change) => {
    const item = items.find(
      (i) => i.id === id && i.size === size && i.color === color
    );
    const newQty = item.quantity + change;

    if (newQty >= 1) {
      dispatch(updateQuantity([id, size, color, newQty]));
    }
  };

  const handleRemoveItem = (id, size, color) => {
    dispatch(removeFromCart([id, size, color]));
  };

  const handleAddToWishlist = (item) => {
    dispatch(addToWishlist(item));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared", { autoClose: 2000 });
  };

  const renderQuantityControls = (item) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleQuantityChange(item.id, item.size, item.color, -1)}
        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
        disabled={item.quantity === 1}
      >
        -
      </button>
      <span className="w-8 h-8 flex items-center justify-center text-sm font-medium bg-gray-100 rounded">
        {item.quantity}
      </span>
      <button
        onClick={() => handleQuantityChange(item.id, item.size, item.color, 1)}
        className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );

  const renderCartItem = (item, index) => (
    <div
      key={`${item.id}-${item.size}-${item.color}`}
      className={`flex items-center gap-4 px-4 py-4 ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } rounded`}
    >
      <img
        src={item.image || fallbackImage}
        alt={item.name}
        className="w-20 h-20 object-contain rounded-md"
        onError={(e) => (e.target.src = fallbackImage)}
      />

      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600">
          Size: {item.size}, Color:
          <span
            className="inline-block w-4 h-4 ml-1 rounded-full border align-middle"
            style={{ backgroundColor: item.color }}
          ></span>
        </p>
        <p className="text-indigo-600 font-medium mt-1">
          €{(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {renderQuantityControls(item)}

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleAddToWishlist(item)}
          className="text-yellow-600 hover:text-yellow-700"
          title="Move to Wishlist"
        >
          <FaHeart size={18} />
        </button>
        <button
          onClick={() => handleRemoveItem(item.id, item.size, item.color)}
          className="text-red-500 hover:text-red-700"
          title="Remove"
        >
          <FaTrash size={18} />
        </button>
      </div>
    </div>
  );

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Your Cart is Empty
        </h1>
        <Link
          to="/products"
          className="inline-block mt-4 bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      <div className="space-y-4 rounded-md overflow-hidden">
        {items.map((item, index) => renderCartItem(item, index))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-lg font-semibold text-gray-800">
            Total Items: {totalQuantity}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Total Price: €{totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/checkout"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            Proceed to Checkout
          </Link>
          <button
            onClick={handleClearCart}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
