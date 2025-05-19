import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// OrderDetails Component
// Displays full order details for the authenticated user, including product list and shipping info.
const OrderDetails = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackImage =
    "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/orders/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data.data);
      } catch (err) {
        const msg =
          err.response?.data?.message || "Failed to fetch order details";
        setError(msg);
        toast.error(msg, { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
        <p className="text-gray-600">{error || "Order not found"}</p>
        <Link
          to="/orders"
          className="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Order #{order._id?.slice(-6)}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-gray-600">
                <strong>Total:</strong> €{order.totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <strong>User:</strong> {order.user?.name || "N/A"} (
                {order.user?.email || "N/A"})
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong>{" "}
                {order.user?.phoneNumber || "Not provided"}
              </p>
              <p className="text-gray-600">
                <strong>Shipping Address:</strong>{" "}
                {order.user?.deliveryAddress || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 border rounded-md px-4 py-4 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <img
                  src={item.image || fallbackImage}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} | Size: {item.size} | Color:{" "}
                    <span
                      className="inline-block w-4 h-4 rounded-full border ml-1 align-middle"
                      style={{ backgroundColor: item.color }}
                    ></span>
                  </p>
                  <p className="text-indigo-600 font-medium">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/orders"
          className="inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails;
