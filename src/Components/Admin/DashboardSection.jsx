import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useFetchWithToken from "Hooks/useFetchWithToken";

/**
 * DashboardSection Component
 * Displays analytics summary and monthly sales chart for admin dashboard.
 */
const DashboardSection = () => {
  const { data: analytics, loading } = useFetchWithToken("/api/orders/analytics");

  if (loading) {
    return <div className="text-center py-10 text-sm text-gray-500">Loading dashboard data...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-10 text-gray-500">No analytics available</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics Overview</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Sales</h3>
          <p className="text-2xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
            €{analytics.totalSales?.toFixed(2) ?? "0.00"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Orders</h3>
          <p className="text-2xl font-semibold text-indigo-600">
            {analytics.totalOrders ?? 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Active Users</h3>
          <p className="text-2xl font-semibold text-indigo-600">
            {analytics.activeUsers ?? 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Low-Stock Products</h3>
          <p className="text-2xl font-semibold text-red-500">
            {analytics.lowStockProducts ?? 0}
          </p>
        </div>
      </div>

      {/* Monthly sales chart */}
      {analytics?.monthlySales?.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlySales}>
              <XAxis dataKey="month" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip contentStyle={{ fontSize: "14px" }} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="url(#salesGradient)" />
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DashboardSection;
