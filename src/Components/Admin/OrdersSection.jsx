import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import namer from "color-namer";
import useFetchWithToken from "Hooks/useFetchWithToken";

/**
 * OrdersSection (Admin)
 * Manages display, status updates, and bulk operations for all customer orders.
 */
const OrdersSection = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 10;

  const { data, loading, refetch } = useFetchWithToken("/api/orders/all");
  const orders = Array.isArray(data) ? data : [];

  const getColorName = (hex) => {
    try {
      return `${namer(hex).ntc[0].name} (${hex})`;
    } catch {
      return hex;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated", { autoClose: 1500 });
      refetch();
    } catch {
      toast.error("Failed to update", { autoClose: 1500 });
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus) return toast.error("Select a status");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/bulk-update`,
        { orderIds: selectedOrders, status: bulkStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Orders updated", { autoClose: 1500 });
      setSelectedOrders([]);
      setBulkStatus("");
      setShowBulkUpdateModal(false);
      refetch();
    } catch {
      toast.error("Failed to update", { autoClose: 1500 });
    }
  };

  const toggleSelect = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  const startIdx = (currentPage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = orders.slice(startIdx, startIdx + ORDERS_PER_PAGE);
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  return (
    <div>
      {selectedOrders.length > 0 && (
        <div className="mb-4 flex gap-4 items-center">
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="">Select Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => setShowBulkUpdateModal(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Update Selected ({selectedOrders.length})
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedOrders(
                          e.target.checked ? paginatedOrders.map((o) => o._id) : []
                        )
                      }
                      checked={
                        paginatedOrders.length > 0 &&
                        selectedOrders.length === paginatedOrders.length
                      }
                    />
                  </th>
                  <th className="p-3 text-left text-sm">Order ID</th>
                  <th className="p-3 text-left text-sm">User</th>
                  <th className="p-3 text-left text-sm">Products</th>
                  <th className="p-3 text-left text-sm">Total</th>
                  <th className="p-3 text-left text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => toggleSelect(order._id)}
                      />
                    </td>
                    <td className="p-3 text-sm">{order._id}</td>
                    <td className="p-3 text-sm">
                      {order.user ? (
                        <>
                          {order.user.name} ({order.user.email})
                          <br />
                          <span className="text-xs text-gray-600">
                            {order.user.phoneNumber || "No phone"}
                          </span>
                          <br />
                          <span className="text-xs text-gray-600">
                            {order.user.deliveryAddress || "No address"}
                          </span>
                        </>
                      ) : (
                        <span className="text-red-500">User Deleted</span>
                      )}
                    </td>
                    <td className="p-3 text-sm">
                      {order.items.map((item, i) => (
                        <div key={i} className="mb-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="inline w-10 h-10 object-cover rounded mr-2"
                          />
                          {item.name} (x{item.quantity})<br />
                          <span className="text-xs">
                            Size: {item.size}, Color: {getColorName(item.color)}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="p-3 text-sm">€{order.totalAmount.toFixed(2)}</td>
                    <td className="p-3 text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="border px-2 py-1 rounded text-sm"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Modal for bulk update confirmation */}
      {showBulkUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Bulk Update</h3>
            <p className="mb-6">
              Update {selectedOrders.length} orders to <strong>{bulkStatus}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBulkUpdateModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpdate}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
