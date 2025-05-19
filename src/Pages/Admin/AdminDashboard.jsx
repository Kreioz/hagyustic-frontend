import React, { useState } from "react";
import DashboardSection from "../../Components/Admin/DashboardSection";
import ProductsSection from "../../Components/Admin/ProductsSection";
import UsersSection from "../../Components/Admin/UsersSection";
import OrdersSection from "../../Components/Admin/OrdersSection";
import CarouselSection from "../../Components/Admin/CarouselSection";
import {
  LayoutDashboard,
  Boxes,
  Users,
  ListOrdered,
  Image as ImageIcon,
} from "lucide-react";

// AdminDashboard Page
// Renders sidebar navigation and conditionally shows each admin section
const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");

  // Sidebar navigation items
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Products", icon: <Boxes size={18} /> },
    { name: "Users", icon: <Users size={18} /> },
    { name: "Orders", icon: <ListOrdered size={18} /> },
    { name: "Carousel", icon: <ImageIcon size={18} /> },
  ];

  // Render the selected section component
  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard":
        return <DashboardSection />;
      case "Products":
        return <ProductsSection />;
      case "Users":
        return <UsersSection />;
      case "Orders":
        return <OrdersSection />;
      case "Carousel":
        return <CarouselSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white p-6 overflow-y-auto h-screen">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav>
          <ul>
            {navItems.map(({ name, icon }) => (
              <li key={name}>
                <button
                  onClick={() => setActiveSection(name)}
                  className={`w-full flex items-center gap-2 text-left py-2 px-4 rounded-md mb-2 transition ${
                    activeSection === name
                      ? "bg-purple-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {icon}
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{activeSection}</h2>
        </div>
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;
