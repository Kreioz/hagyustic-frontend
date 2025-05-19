import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// AdminProductCreate Page
// Allows admin users to create a new product listing with multiple image uploads
const AdminProductCreate = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fallbackImage =
    "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

  // Redirect non-admins away from this page
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      toast.error("Admin access required", { autoClose: 2000 });
      navigate("/signin");
    }
  }, [isAuthenticated, user, navigate]);

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    price: Yup.number().required("Price is required").min(0),
    description: Yup.string().required("Description is required"),
    color: Yup.string().required("Color is required"),
    size: Yup.string().required("Size is required"),
    category: Yup.string().required("Category is required"),
    mainCategory: Yup.string().required("Main category is required"),
    availableSizes: Yup.string().required("Available sizes are required"),
    availableColors: Yup.string().required("Available colors are required"),
  });

  // Handle image file selection and preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("You can upload up to 5 images", { autoClose: 2000 });
      return;
    }
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // Submit form and image data to backend
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (imageFiles.length === 0) {
        toast.error("Upload at least one image", { autoClose: 2000 });
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      imageFiles.forEach((file) => formData.append("images", file));

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product created", { autoClose: 2000 });
      resetForm();
      setImageFiles([]);
      setImagePreviews([]);
      setTimeout(() => navigate("/products"), 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Product creation failed",
        { autoClose: 2000 }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create New Product
      </h2>

      <Formik
        initialValues={{
          name: "",
          price: "",
          description: "",
          color: "",
          size: "",
          category: "",
          mainCategory: "",
          availableSizes: "",
          availableColors: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5 bg-white p-6 rounded-lg shadow-md">
            {/* Image Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Images (up to 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,image/avif"
                onChange={handleImageChange}
                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
              />
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {imagePreviews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Preview ${index}`}
                      onError={(e) => (e.target.src = fallbackImage)}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Text Fields */}
            <FieldBlock name="name" label="Product Name" placeholder="e.g. Black Hoodie" />
            <FieldBlock name="price" label="Price (€)" type="number" placeholder="e.g. 49.99" />
            <FieldBlock name="description" label="Description" as="textarea" placeholder="Product description..." />
            <FieldBlock name="color" label="Color" placeholder="e.g. #000000" />
            <FieldBlock name="size" label="Size" placeholder="e.g. M" />
            <FieldBlock name="category" label="Category" placeholder="e.g. Shirts" />
            <FieldBlock name="mainCategory" label="Main Category" placeholder="e.g. MEN" />
            <FieldBlock name="availableSizes" label="Available Sizes" placeholder="e.g. S,M,L,XL" />
            <FieldBlock name="availableColors" label="Available Colors" placeholder="e.g. #ffffff,#000000,#f87171" />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Creating Product..." : "Create Product"}
            </button>

            {/* Navigation Link */}
            <Link
              to="/products"
              className="text-indigo-600 hover:underline text-sm block mt-2"
            >
              Back to Products
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};

// Reusable form input block
const FieldBlock = ({ name, label, placeholder, type = "text", as = "input" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <Field
      name={name}
      as={as}
      type={type}
      placeholder={placeholder}
      className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500"
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
  </div>
);

export default AdminProductCreate;
