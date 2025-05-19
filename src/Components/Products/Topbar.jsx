import React from "react";
import { FaThLarge, FaThList } from "react-icons/fa";

// Sort options used in dropdown
const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "lowToHigh", label: "Price: Low to High" },
  { value: "highToLow", label: "Price: High to Low" },
];

const Topbar = ({
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  productCount = 0,
}) => {
  // Render toggle button for switching between grid and list views
  const renderViewButton = (mode, icon) => {
    const isActive = viewMode === mode;
    return (
      <button
        onClick={() => setViewMode(mode)}
        className={`p-2 rounded-md border text-sm transition ${
          isActive
            ? "bg-indigo-600 text-white border-indigo-600 shadow"
            : "border-gray-300 text-gray-600 hover:bg-gray-100"
        }`}
        aria-label={`Switch to ${mode} view`}
      >
        {icon}
      </button>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 mt-2">
      {/* Product count display */}
      <p className="text-sm text-gray-600">
        Showing 1–12 of {productCount} products
      </p>

      {/* Sort and view controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Sorting dropdown */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="text-sm border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* View toggle buttons */}
        <div className="flex gap-2">
          {renderViewButton("grid", <FaThLarge size={16} />)}
          {renderViewButton("list", <FaThList size={16} />)}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
