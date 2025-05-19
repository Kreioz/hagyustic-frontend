// ProductsSection.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import namer from "color-namer";
import useFetchWithToken from "Hooks/useFetchWithToken";
import axios from "axios";

// ProductsSection (Admin) with custom modal for delete confirmation
const ProductsSection = () => {
  const { data, loading, error, refetch } = useFetchWithToken("/api/products");
  const products = Array.isArray(data) ? data : [];

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [isBulk, setIsBulk] = useState(false);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter((p) =>
      [p.name, p.category, p.mainCategory].filter(Boolean).some((val) =>
        val.toLowerCase().includes(query)
      )
    );
  }, [products, search]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const getColorName = (hex) => {
    try {
      return `${namer(hex).ntc[0].name} (${hex})`;
    } catch {
      return hex;
    }
  };

  useEffect(() => {
    if (error) toast.error("Failed to load products", { autoClose: 1500 });
  }, [error]);

  const confirmDelete = (id = null) => {
    setTargetId(id);
    setIsBulk(!id);
    setShowModal(true);
  };
  

 const handleDelete = async () => {
  try {
    const token = localStorage.getItem("token");
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    if (isBulk) {
      // Bulk delete
      await axios.delete(`${baseURL}/api/products/bulk`, {
        data: { ids: selected },
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // Validate single ID
      if (!targetId || targetId.length !== 24) {
        toast.error("Invalid Product ID", { autoClose: 1500 });
        return;
      }

      await axios.delete(`${baseURL}/api/products/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    toast.success("Deleted successfully", { autoClose: 1500 });
    setSelected([]);
    refetch();
  } catch (err) {
    toast.error("Failed to delete", { autoClose: 2000 });
  } finally {
    setShowModal(false);
    setTargetId(null);
  }
};



  return (
    <div>
      {/* Search bar and delete selected */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {selected.length > 0 && (
          <button
            onClick={() => confirmDelete(null)}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            Delete Selected ({selected.length})
          </button>
        )}
      </div>

      {/* Product Table */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            No Products Found
          </h3>
          <Link
            to="/admin/product/create"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            Add New Product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? filtered.map((p) => p._id) : []
                      )
                    }
                    checked={
                      selected.length === filtered.length && filtered.length > 0
                    }
                  />
                </th>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Size</th>
                <th className="p-4">Color</th>
                <th className="p-4">Category</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(p._id)}
                      onChange={() => toggleSelect(p._id)}
                    />
                  </td>
                  <td className="p-4">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 text-sm">{p.name}</td>
                  <td className="p-4 text-sm">€{p.price?.toFixed(2)}</td>
                  <td className="p-4 text-sm">{p.size}</td>
                  <td className="p-4 text-sm">{getColorName(p.color)}</td>
                  <td className="p-4 text-sm">
                    {p.mainCategory} - {p.category}
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/product/edit/${p._id}`}
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-3 py-1 rounded hover:opacity-90"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => confirmDelete(p._id)}
                        className="bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1 rounded hover:opacity-90"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete {isBulk ? "these" : "this"} product
              {isBulk && selected.length > 1 ? "s" : ""}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;
