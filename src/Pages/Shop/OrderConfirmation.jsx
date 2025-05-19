import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// OrderConfirmation Component
// Displays a thank-you message for a successful order with a link to continue shopping.
const OrderConfirmation = () => {
  // Show success toast on component mount
  useEffect(() => {
    toast.dismiss(); // Prevent duplicate toasts
    toast.success("Your order has been placed successfully!", { autoClose: 2000 });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      {/* Confirmation heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Thank You for Your Order!
      </h1>
      {/* Confirmation message */}
      <p className="text-gray-600 mb-6">
        Your order has been placed successfully. You’ll receive a confirmation
        email shortly.
      </p>
      {/* Link to continue shopping */}
      <Link
        to="/products"
        className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;
