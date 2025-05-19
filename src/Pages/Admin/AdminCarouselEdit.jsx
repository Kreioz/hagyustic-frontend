import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// AdminCarouselEdit
// Allows admin to edit an existing carousel slide
const AdminCarouselEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  const [slide, setSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fallbackImage =
    "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

  // Block access if not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      toast.error("Admin access required", { autoClose: 2000 });
      navigate("/signin");
      return;
    }

    const fetchSlide = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found");

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/carousel`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const found = res.data.data.find((s) => s._id === id);
        if (!found) throw new Error("Slide not found");

        setSlide(found);
        setImagePreviews(found.images || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch slide", { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };

    fetchSlide();
  }, [id, isAuthenticated, user, navigate]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    subtitle: Yup.string().required("Subtitle is required"),
    category: Yup.string().required("Category is required"),
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length !== 3) {
      toast.error("Please upload exactly 3 images", { autoClose: 2000 });
      return;
    }
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("subtitle", values.subtitle);
      formData.append("category", values.category);

      // Only include images if updating them
      if (images.length === 3) {
        images.forEach((file) => formData.append("images", file));
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/carousel/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Carousel slide updated", { autoClose: 2000 });
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update slide", { autoClose: 2000 });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;

  if (!slide)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Slide Not Found</h2>
        <Link to="/admin/dashboard" className="text-indigo-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Carousel Slide</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Formik
          initialValues={{
            title: slide.title || "",
            subtitle: slide.subtitle || "",
            category: slide.category || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <FieldBlock name="title" label="Title" placeholder="Enter slide title" />
              <FieldBlock name="subtitle" label="Subtitle" placeholder="Enter slide subtitle" />
              <FieldBlock name="category" label="Category" placeholder="Enter category (e.g., MEN)" />

              {/* Show current images */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Images</label>
                <div className="flex gap-2 mt-2">
                  {imagePreviews.length > 0 ? (
                    imagePreviews.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Preview ${idx}`}
                        className="w-16 h-16 object-cover rounded-md border"
                        onError={(e) => (e.target.src = fallbackImage)}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No images available</p>
                  )}
                </div>
              </div>

              {/* Image upload (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload New Images (exactly 3 if updating)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  onChange={handleImageChange}
                  className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Slide"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// Reusable input field block
const FieldBlock = ({ name, label, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <Field
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
  </div>
);

export default AdminCarouselEdit;
