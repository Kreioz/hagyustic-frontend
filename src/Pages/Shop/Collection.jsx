import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Topbar from "../../Components/Products/Topbar";
import ProductList from "../../Components/Products/ProductList";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useDebounce from "../../Hooks/useDebounce";

const sidebarFilters = {
  clothes: [
    "T-Shirts",
    "Jeans",
    "Shorts",
    "Sweaters",
    "Jackets",
    "Pants",
    "Hoodies",
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
};

const Collection = () => {
  const location = useLocation();
  const categoryParam = new URLSearchParams(location.search).get("category");
  const mainCategoryParam = new URLSearchParams(location.search).get("mainCategory");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({ clothes: [], sizes: [], colors: [] });
  const [openSections, setOpenSections] = useState({ clothes: true, sizes: true, colors: true });
  const [availableColors, setAvailableColors] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 800);

  useEffect(() => {
    if (
      categoryParam &&
      sidebarFilters.clothes.includes(categoryParam) &&
      !selectedFilters.clothes.includes(categoryParam)
    ) {
      setSelectedFilters((prev) => ({
        ...prev,
        clothes: [...prev.clothes, categoryParam],
      }));
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        if (selectedFilters.clothes.length > 0) {
          queryParams.append("category", selectedFilters.clothes.join(","));
        } else if (categoryParam) {
          queryParams.append("category", categoryParam);
        }

        if (mainCategoryParam) {
          queryParams.append("mainCategory", mainCategoryParam);
        }

        if (selectedFilters.sizes.length > 0) {
          queryParams.append("size", selectedFilters.sizes.join(","));
        }
        if (selectedFilters.colors.length > 0) {
          queryParams.append("color", selectedFilters.colors.join(","));
        }
        if (debouncedSearchQuery) {
          queryParams.append("name", debouncedSearchQuery);
        }
        if (sortOption) {
          queryParams.append("sort", sortOption);
        }

        const filteredRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?${queryParams.toString()}`);
        setProducts(filteredRes.data.data);

        const allRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?mainCategory=${mainCategoryParam}`);
        const allColors = [
          ...new Set(allRes.data.data.flatMap((p) => p.availableColors || [])),
        ];
        setAvailableColors(allColors);

        // Scroll to top after filter/search change
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch products", { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, selectedFilters, sortOption, debouncedSearchQuery, mainCategoryParam]);

  const handleToggleFilter = (type, value) => {
    setSelectedFilters((prev) => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({ clothes: [], sizes: [], colors: [] });
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const renderFilterItem = (type, item) => {
    const isSelected = selectedFilters[type].includes(item);
    if (type === "clothes") {
      return (
        <li key={item}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggleFilter("clothes", item)}
              className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 transition"
            />
            <span className="text-gray-700 hover:text-indigo-600">{item}</span>
          </label>
        </li>
      );
    } else if (type === "sizes") {
      return (
        <button
          key={item}
          onClick={() => handleToggleFilter("sizes", item)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            isSelected
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
          }`}
        >
          {item}
        </button>
      );
    } else if (type === "colors") {
      return (
        <button
          key={item}
          onClick={() => handleToggleFilter("colors", item)}
          className={`relative w-8 h-8 rounded-full border-2 transition ${
            isSelected
              ? "border-indigo-600 scale-110 shadow"
              : "border-gray-200 hover:border-indigo-400"
          }`}
          style={{ backgroundColor: item }}
          title={item}
          aria-label={`Color ${item}`}
        >
          {isSelected && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-3 h-3 bg-white rounded-full border border-indigo-600" />
            </span>
          )}
        </button>
      );
    }
  };

  const renderFilterSection = (type, title, items) => (
    <div className="mb-6">
      <button
        className="flex justify-between items-center w-full text-lg font-semibold text-gray-800 mb-3"
        onClick={() => toggleSection(type)}
        aria-expanded={openSections[type]}
      >
        {title} {openSections[type] ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {openSections[type] && (
        <div
          className={
            type === "clothes" ? "space-y-2 list-none" : "flex gap-3 flex-wrap"
          }
        >
          {items.map((item) => renderFilterItem(type, item))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="w-full text-center py-20">
        <span className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" />
        <p className="mt-2 text-sm text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
        <aside
          className={`bg-white p-4 rounded-lg shadow-md border border-gray-100 transition-all duration-300 ${
            isSidebarOpen ? "block" : "hidden"
          } md:block md:sticky top-0 md:h-screen md:overflow-y-auto`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Filters</h3>
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-sm text-gray-600 md:hidden"
              >
                Close
              </button>
            </div>
          </div>
          {renderFilterSection("clothes", "Clothes", sidebarFilters.clothes)}
          {renderFilterSection("sizes", "Sizes", sidebarFilters.sizes)}
          {renderFilterSection("colors", "Colors", availableColors)}
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex justify-between items-center w-full sm:w-auto">
              <Topbar
                sortOption={sortOption}
                setSortOption={setSortOption}
                productCount={products.length}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
              <button
                className="md:hidden px-4 py-2 bg-indigo-600 text-white rounded-md"
                onClick={() => setIsSidebarOpen(true)}
              >
                Filters
              </button>
            </div>
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-1/2 max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              aria-label="Search products"
            />
          </div>
          <ProductList products={products} viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
};

export default Collection;
