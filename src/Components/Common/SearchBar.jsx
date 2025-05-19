import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useDebounce from "../../Hooks/useDebounce";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const inputRef = useRef(null);
  const mobileRef = useRef(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300); // Delay API calls for better performance

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setIsMobileExpanded(false);
      }
    };
    if (isMobileExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileExpanded]);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products?name=${debouncedQuery}`
        );
        setSuggestions(data.data.slice(0, 5)); // Limit to 5 suggestions
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Navigate to search results
  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSuggestions([]);
      setIsMobileExpanded(false);
    }
  };

  // When clicking on a suggestion
  const handleSuggestionClick = (name) => {
    setQuery(name);
    navigate(`/search?query=${encodeURIComponent(name)}`);
    setSuggestions([]);
    setIsMobileExpanded(false);
  };

  // Search form rendering
  const renderSearchForm = (isMobile = false) => (
    <div className={isMobile ? "w-full" : "relative w-full"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className={
          isMobile
            ? "flex items-center gap-2"
            : "flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2"
        }
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className={
            isMobile
              ? "flex-1 px-4 py-2 text-sm border border-gray-300 rounded-md outline-none"
              : "w-full px-4 py-2 text-sm outline-none"
          }
          ref={inputRef}
        />
        <button
          type="submit"
          className={
            isMobile
              ? "bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition"
              : "bg-purple-600 px-4 py-2 hover:bg-purple-700 transition rounded-2xl mr-1.5 text-white"
          }
        >
          <Search size={18} />
        </button>
        {isMobile && (
          <button
            type="button"
            onClick={() => setIsMobileExpanded(false)}
            className="text-gray-500 hover:text-red-500"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        )}
      </form>

      {/* Suggestions dropdown (desktop only) */}
      {!isMobile && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-md shadow z-50">
          {suggestions.map((product) => (
            <li
              key={product._id}
              onClick={() => handleSuggestionClick(product.name)}
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="relative w-full max-w-md">
      {/* Desktop view */}
      <div className="hidden md:block">{renderSearchForm()}</div>

      {/* Mobile search icon (collapsed state) */}
      {!isMobileExpanded && (
        <div className="md:hidden flex justify-end pr-2">
          <button
            onClick={() => setIsMobileExpanded(true)}
            className="text-gray-700"
            aria-label="Open search"
          >
            <Search size={20} />
          </button>
        </div>
      )}

      {/* Mobile expanded view */}
      {isMobileExpanded && (
        <div
          ref={mobileRef}
          className="fixed inset-0 bg-white z-50 flex flex-col p-4"
        >
          {renderSearchForm(true)}

          {/* Mobile suggestion state */}
          {loading && (
            <p className="text-sm text-gray-500 mt-2">Loading...</p>
          )}

          {!loading && suggestions.length > 0 && (
            <ul className="mt-2 bg-white border rounded shadow">
              {suggestions.map((product) => (
                <li
                  key={product._id}
                  onClick={() => handleSuggestionClick(product.name)}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
