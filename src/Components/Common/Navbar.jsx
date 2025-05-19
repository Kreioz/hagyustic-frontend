import React, { useState } from "react";
import {
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import SearchBar from "./SearchBar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/Slice/UserSlice";
import { toast } from "react-toastify";

// Category structure for dropdown menus
const categories = [
  { name: "MEN", items: ["T-Shirts", "Jeans", "Shorts", "Sweaters", "Jackets", "Pants", "Hoodies"] },
  { name: "WOMEN", items: ["T-Shirts", "Jeans", "Shorts", "Sweaters", "Jackets", "Pants", "Hoodies"] },
  { name: "CHILD", items: ["T-Shirts", "Jeans", "Shorts", "Sweaters", "Jackets", "Pants", "Hoodies"] },
  { name: "ACCESSORIES", items: ["Shoes", "Sunglasses", "Bags"] },
];

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Redux state
  const { totalQuantity } = useSelector((state) => state.cart);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Toggle category dropdown
  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleMouseLeave = () => {
    setTimeout(() => setActiveDropdown(null), 100);
  };

  // Show/hide user menu
  const handleUserDropdownMouseLeave = () => {
    setTimeout(() => setIsUserDropdownOpen(false), 200);
  };

  const handleUserDropdownMouseEnter = () => {
    setIsUserDropdownOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/signin");
    toast.success("Logged out successfully", { autoClose: 2000 });
  };

  // Reusable icon button with optional badge and tooltip
  const renderIconLink = (to, IconComponent, label, count) => (
    <Link to={to} className="relative">
      <button className="group hover:text-purple-600 transition relative flex flex-col items-center">
        <IconComponent size={22} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {count}
          </span>
        )}
        <span className="text-xs text-gray-600 group-hover:text-purple-600 hidden md:block mt-1">
          {label}
        </span>
        <span className="absolute top-8 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-50">
          {label}
        </span>
      </button>
    </Link>
  );

  // Render all category dropdowns (desktop and mobile mode)
  const renderCategoryList = (isMobile = false) => (
    <>
      {categories.map((category) => (
        <div
          key={category.name}
          className={`relative ${isMobile ? "mb-2" : "group cursor-pointer"}`}
          onMouseEnter={!isMobile ? () => setActiveDropdown(category.name) : null}
          onClick={isMobile ? () => toggleDropdown(category.name) : null}
        >
          <span
            className={`${
              isMobile
                ? "font-medium text-gray-800"
                : "text-gray-800 font-medium text-sm hover:text-purple-800 transition"
            }`}
          >
            {category.name}
          </span>
          <div
            className={`${
              isMobile
                ? "ml-3 mt-1"
                : `absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg transition-all duration-200 ease-out transform z-50
                ${
                  activeDropdown === category.name
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`
            }`}
          >
            {category.items.map((item, idx) => (
              <div
                key={idx}
                className={`text-sm py-2 px-3 text-gray-700 hover:bg-gray-100 rounded cursor-pointer transition ${
                  isMobile ? "hover:text-purple-600" : ""
                }`}
                onClick={() => {
                  navigate(
                    `/products?mainCategory=${encodeURIComponent(
                      category.name
                    )}&category=${encodeURIComponent(item)}`
                  );
                  if (isMobile) setIsMobileMenuOpen(false);
                  setActiveDropdown(null);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <>
      {/* Main top navbar */}
      <div className="fixed top-[64px] md:top-[40px] left-0 w-full z-40 ">
        <div className="bg-white shadow-sm py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div onClick={() => navigate("/")} className="cursor-pointer flex items-center">
              <div className="text-4xl md:text-4xl logo-font font-bold uppercase tracking-tighter">
                HaGyustic
              </div>
            </div>

            {/* Search bar center */}
            <div className="flex-1 flex items-center justify-center mx-4">
              <SearchBar />
            </div>

            {/* User / Wishlist / Cart icons */}
            <div className="flex items-center gap-4 text-gray-700">
              {isAuthenticated ? (
                <div
                  className="relative"
                  onMouseLeave={handleUserDropdownMouseLeave}
                  onMouseEnter={handleUserDropdownMouseEnter}
                >
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-1 text-gray-700 hover:text-purple-600 focus:outline-none"
                  >
                    <User size={22} />
                    <span className="text-xs hidden md:block">{user?.name}</span>
                    <span className="hidden md:block">
                      {isUserDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </button>

                  {/* Dropdown with links */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-0 w-48 bg-white border rounded-md shadow-lg z-50">
                      {user?.role === "admin" ? (
                        <>
                          <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsUserDropdownOpen(false)}>Admin Dashboard</Link>
                          <Link to="/admin/product/create" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsUserDropdownOpen(false)}>Add Product</Link>
                        </>
                      ) : (
                        <>
                          <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsUserDropdownOpen(false)}>My Orders</Link>
                          <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsUserDropdownOpen(false)}>My Details</Link>
                        </>
                      )}
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                renderIconLink("/signin", User, "Account", 0)
              )}

              {/* Wishlist & Cart icons */}
              {renderIconLink("/wishlist", Heart, "Wishlist", wishlistItems.length)}
              {renderIconLink("/cart", ShoppingBag, "Shopping Bag", totalQuantity)}

              {/* Mobile menu toggle */}
              <button className="md:hidden flex items-center" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop category nav */}
        <div className="w-full bg-gray-100 py-2 px-4 hidden md:block z-40" onMouseLeave={handleMouseLeave}>
          <div className="max-w-7xl mx-auto flex justify-center gap-6">
            {renderCategoryList()}
          </div>
        </div>
      </div>

      {/* Push content below fixed navbar */}
      <div className="h-[100px] md:h-[120px]"></div>

      {/* Mobile sidebar menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-64 bg-white h-full shadow-lg p-4 z-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={20} /></button>
            </div>
            {renderCategoryList(true)}
            {isAuthenticated ? (
              <>
                <div className="font-medium text-gray-800 py-1 flex items-center gap-2">
                  <User size={20} />
                  {user?.name}
                </div>
                {user?.role === "admin" ? (
                  <>
                    <Link to="/admin/dashboard" className="block text-gray-700 py-1 hover:text-purple-600" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                    <Link to="/admin/product/create" className="block text-gray-700 py-1 hover:text-purple-600" onClick={() => setIsMobileMenuOpen(false)}>Add Product</Link>
                  </>
                ) : (
                  <>
                    <Link to="/orders" className="block text-gray-700 py-1 hover:text-purple-600" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
                    <Link to="/profile" className="block text-gray-700 py-1 hover:text-purple-600" onClick={() => setIsMobileMenuOpen(false)}>My Details</Link>
                  </>
                )}
                <button onClick={handleLogout} className="text-gray-700 py-1 hover:text-purple-600">Logout</button>
              </>
            ) : (
              <Link to="/signin" className="text-gray-700 py-1 hover:text-purple-600 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <User size={20} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
