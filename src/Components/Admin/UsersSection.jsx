import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useFetchWithToken from "Hooks/useFetchWithToken";
import axios from "axios";

/**
 * UsersSection (Admin)
 * Lists registered users with their contact details and order history.
 */
const UsersSection = () => {
  const { data: users, loading, error } = useFetchWithToken("/api/user/users");
  const [userOrders, setUserOrders] = useState({});

  useEffect(() => {
    const fetchOrdersForUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/orders/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const orders = res.data.data || [];
        const mapped = {};

        orders.forEach((order) => {
          const userId = order.user?._id?.toString();
          if (userId) {
            if (!mapped[userId]) mapped[userId] = [];
            mapped[userId].push(order);
          }
        });

        setUserOrders(mapped);
      } catch {
        toast.error("Failed to fetch orders", { autoClose: 1500 });
      }
    };

    if (users?.length) fetchOrdersForUsers();
  }, [users]);

  if (loading)
    return (
      <div className="text-center py-20 text-sm text-gray-500">
        Loading users...
      </div>
    );

  if (error || !users?.length)
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          No Users Available
        </h3>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-sm">
            <th className="p-4 text-left font-medium text-gray-700">Name</th>
            <th className="p-4 text-left font-medium text-gray-700">Email</th>
            <th className="p-4 text-left font-medium text-gray-700">Phone</th>
            <th className="p-4 text-left font-medium text-gray-700">Address</th>
            <th className="p-4 text-left font-medium text-gray-700">Orders</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 transition">
              <td className="p-4 text-sm text-gray-800">{user.name}</td>
              <td className="p-4 text-sm text-gray-800">{user.email}</td>
              <td className="p-4 text-sm text-gray-800">
                {user.phoneNumber || "Not provided"}
              </td>
              <td className="p-4 text-sm text-gray-800">
                {user.deliveryAddress || "Not provided"}
              </td>
              <td className="p-4 text-sm text-gray-800">
                {(userOrders[user._id?.toString()] || []).length} orders
                {userOrders[user._id?.toString()]?.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-600">
                    {userOrders[user._id.toString()].map((order) => (
                      <li key={order._id}>
                        #{order._id.slice(-6)} – {order.items.length} item(s), €
                        {order.totalAmount.toFixed(2)}, {order.status}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersSection;
