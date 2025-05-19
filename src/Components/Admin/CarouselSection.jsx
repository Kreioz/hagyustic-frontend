import { useState } from "react";
import { Link } from "react-router-dom";
import useFetchWithToken from "Hooks/useFetchWithToken";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * Admin CarouselSection
 * Displays existing carousel slides with options to edit or delete.
 */
const CarouselSection = () => {
  const { data: slides = [], loading, error, refetch } = useFetchWithToken("/api/carousel");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/carousel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Slide deleted", { autoClose: 1500 });
      refetch();
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete", { autoClose: 1500 });
    }
  };

  if (loading) return <p className="text-center py-20">Loading carousel...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load carousel</p>;

  if (!Array.isArray(slides) || slides.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">No Slides Found</h3>
        <Link
          to="/admin/carousel/create"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          Add New Slide
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left text-sm font-semibold">Image</th>
            <th className="p-4 text-sm">Title</th>
            <th className="p-4 text-sm">Subtitle</th>
            <th className="p-4 text-sm">Category</th>
            <th className="p-4 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {slides.map((slide) => (
            <tr key={slide._id} className="hover:bg-gray-50">
              <td className="p-4">
                <div className="flex gap-2">
                  {slide.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Slide ${i}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              </td>
              <td className="p-4 text-sm">{slide.title}</td>
              <td className="p-4 text-sm">{slide.subtitle}</td>
              <td className="p-4 text-sm">{slide.category}</td>
              <td className="p-4 text-sm">
                <div className="flex gap-2">
                  <Link
                    to={`/admin/carousel/edit/${slide._id}`}
                    className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-3 py-1 rounded hover:opacity-90"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(slide._id)}
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

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Delete Slide</h3>
            <p className="mb-6">Are you sure you want to delete this carousel slide?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselSection;
