import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// AdminProductEdit
// Admin-only page to edit product details and manage product images
const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fallbackImage =
    "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      toast.error("Admin access required", { autoClose: 2000 });
      navigate("/signin");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token missing");
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProduct(data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch product", {
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle new image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // Upload new images
  const handleAddImages = async () => {
    if (newImages.length === 0 || newImages.length > 5) {
      toast.error("Upload 1–5 images", { autoClose: 2000 });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      newImages.forEach((file) => formData.append("images", file));
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProduct(data.data);
      setNewImages([]);
      setImagePreviews([]);
      toast.success("Images uploaded", { autoClose: 2000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed", {
        autoClose: 2000,
      });
    }
  };

  // Delete an image
  const handleDeleteImage = async (imageUrl) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/images`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { id, imageUrl },
        }
      );
      setProduct(data.data);
      toast.success("Image deleted", { autoClose: 2000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed", {
        autoClose: 2000,
      });
    }
  };

  // Update product info
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProduct(data.data);
      toast.success("Product updated", { autoClose: 2000 });
      setTimeout(() => navigate("/products"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed", {
        autoClose: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product)
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Not Found</h2>
        <Link
          to="/products"
          className="inline-block bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          Back to Products
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h2>

      {/* Current images with delete buttons */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt={`Product Image ${i + 1}`}
                onError={(e) => (e.target.src = fallbackImage)}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                onClick={() => handleDeleteImage(img)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Upload new images */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Add New Images (max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-3">
              {imagePreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Preview ${i}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ))}
            </div>
          )}
          {newImages.length > 0 && (
            <button
              type="button"
              onClick={handleAddImages}
              className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Upload Images
            </button>
          )}
        </div>
      </div>

      {/* Edit product form */}
      <Formik
        initialValues={{
          name: product.name,
          price: product.price,
          description: product.description,
          color: product.color,
          size: product.size,
          category: product.category,
          mainCategory: product.mainCategory,
          availableSizes: product.availableSizes.join(","),
          availableColors: product.availableColors.join(","),
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("Required"),
          price: Yup.number().required("Required").min(0),
          description: Yup.string().required("Required"),
          color: Yup.string().required("Required"),
          size: Yup.string().required("Required"),
          category: Yup.string().required("Required"),
          mainCategory: Yup.string().required("Required"),
          availableSizes: Yup.string().required("Required"),
          availableColors: Yup.string().required("Required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5 bg-white p-6 rounded-lg shadow-md">
            <FieldBlock name="name" label="Product Name" placeholder="e.g. Black Hoodie" />
            <FieldBlock name="price" label="Price (€)" type="number" placeholder="e.g. 49.99" />
            <FieldBlock name="description" label="Description" as="textarea" placeholder="Brief description..." />
            <FieldBlock name="color" label="Color" placeholder="e.g. #000000" />
            <FieldBlock name="size" label="Size" placeholder="e.g. M" />
            <FieldBlock name="category" label="Category" placeholder="e.g. Shirts" />
            <FieldBlock name="mainCategory" label="Main Category" placeholder="e.g. MEN" />
            <FieldBlock name="availableSizes" label="Available Sizes" placeholder="e.g. S,M,L" />
            <FieldBlock name="availableColors" label="Available Colors" placeholder="e.g. #000000,#ffffff" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Updating Product..." : "Update Product"}
            </button>

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

// Reusable Field component block
const FieldBlock = ({ name, label, placeholder, type = "text", as = "input" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <Field
      name={name}
      type={type}
      as={as}
      placeholder={placeholder}
      className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
  </div>
);

export default AdminProductEdit;
