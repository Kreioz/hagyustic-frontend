import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// Admin-only page to create a new carousel slide
const AdminCarouselCreate = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Only allow admins
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      toast.error("Admin access required", { autoClose: 2000 });
      navigate("/signin");
    }
  }, [isAuthenticated, user, navigate]);

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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (images.length !== 3) {
      toast.error("Exactly 3 images are required", { autoClose: 2000 });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("subtitle", values.subtitle);
      formData.append("category", values.category);
      images.forEach((img) => formData.append("images", img));

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/carousel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Carousel slide created", { autoClose: 2000 });
      resetForm();
      setImages([]);
      setImagePreviews([]);
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create slide";
      toast.error(message, { autoClose: 2000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Carousel Slide</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Formik
          initialValues={{ title: "", subtitle: "", category: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <FieldBlock name="title" label="Title" placeholder="Enter slide title" />
              <FieldBlock name="subtitle" label="Subtitle" placeholder="Enter slide subtitle" />
              <FieldBlock name="category" label="Category" placeholder="Enter category (e.g., MEN)" />

              <div>
                <label className="block text-sm font-medium text-gray-700">Upload 3 Images</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  onChange={handleImageChange}
                  className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
                />
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {imagePreviews.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`preview-${idx}`}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Slide"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// Reusable input block with validation
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

export default AdminCarouselCreate;
