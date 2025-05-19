import React, { useEffect, useState } from "react";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/Slice/CartSlice";
import { addToWishlist } from "../../Redux/Slice/WishlistSlice";
import { toast } from "react-toastify";
import axios from "axios";

// ProductDetail Component
// Displays detailed information about a product, allows selection of size/color, and adds to cart or wishlist.
const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackImage =
    "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) throw new Error("Product ID is missing");
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`
        );
        const productData = response.data.data;
        if (!productData) throw new Error("Product not found");

        setProduct(productData);
        setSelectedSize(productData.availableSizes?.[0] || "");
        setSelectedColor(productData.availableColors?.[0] || "");
        setSelectedImageIndex(0);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch product");
        toast.dismiss();
        toast.error(
          error.response?.data?.message || "Failed to fetch product",
          { autoClose: 2000 }
        );
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.dismiss();
      toast.error("Please select size and color.", { autoClose: 2000 });
      return;
    }
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0] || fallbackImage,
        size: selectedSize,
        color: selectedColor,
      })
    );
    toast.dismiss();
    toast.success("Added to cart", { autoClose: 2000 });
  };

  const handleAddToWishlist = () => {
    if (!selectedSize || !selectedColor) {
      toast.dismiss();
      toast.error("Please select size and color.", { autoClose: 2000 });
      return;
    }
    dispatch(
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || fallbackImage,
        size: selectedSize,
        color: selectedColor,
      })
    );
    toast.dismiss();
    toast.success("Added to wishlist", { autoClose: 2000 });
  };

  const handleImageChange = (index) => setSelectedImageIndex(index);
  const handlePrevImage = () =>
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  const handleNextImage = () =>
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );

  const renderSelector = (type, items, selectedValue, setSelected) => (
    <div className="flex gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => setSelected(item)}
          className={
            type === "size"
              ? `w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition ${
                  selectedValue === item
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
                }`
              : `w-6 h-6 rounded-full border-2 transition ${
                  selectedValue === item
                    ? "border-indigo-600 scale-110 shadow"
                    : "border-gray-200 hover:border-indigo-400"
                }`
          }
          style={type === "color" ? { backgroundColor: item } : null}
          title={type === "color" ? item : undefined}
        >
          {type === "size" ? item : ""}
        </button>
      ))}
    </div>
  );

  const renderQuantityControls = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleQuantityChange(-1)}
        className="w-8 h-8 bg-gray-200 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
      >
        -
      </button>
      <span className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-sm font-medium">
        {quantity}
      </span>
      <button
        onClick={() => handleQuantityChange(1)}
        className="w-8 h-8 bg-gray-200 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
      >
        +
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Product Not Found
        </h2>
        <Link
          to="/products"
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={`${img || fallbackImage}?w=100&h=160&dpr=auto&f=auto&q=80`}
                alt={`${product.name} view ${index + 1}`}
                className={`w-20 h-20 md:h-[160px] object-cover rounded-md cursor-pointer border-2 ${
                  selectedImageIndex === index
                    ? "border-indigo-600"
                    : "border-gray-200"
                } hover:border-indigo-400 transition`}
                onClick={() => handleImageChange(index)}
                onError={(e) => (e.target.src = fallbackImage)}
              />
            ))}
          </div>

          <div className="relative w-full">
            <img
              src={`${
                product.images[selectedImageIndex] || fallbackImage
              }?w=600&h=700&dpr=auto&f=auto&q=80`}
              alt={product.name}
              className="w-full h-[400px] md:h-[700px] object-cover rounded-lg shadow-md"
              onError={(e) => (e.target.src = fallbackImage)}
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
            >
              <ChevronLeft className="text-gray-800" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
            >
              <ChevronRight className="text-gray-800" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <div className="flex items-center gap-2 text-yellow-500 text-sm">
            ★★★★☆ <span className="text-gray-500">(120 reviews)</span>
          </div>
          <p className="text-purple-600 text-3xl font-bold">
            €{product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 text-sm">{product.description}</p>

          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">Size</h3>
            {renderSelector(
              "size",
              product.availableSizes,
              selectedSize,
              setSelectedSize
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Color
            </h3>
            {renderSelector(
              "color",
              product.availableColors,
              selectedColor,
              setSelectedColor
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Quantity
            </h3>
            {renderQuantityControls()}
          </div>

          {/* Product Highlights (conditional) */}
          <div className="pt-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Why you'll love it
            </h3>

            {product.mainCategory === "ACCESSORIES" ? (
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Stylish and functional design</li>
                <li>Durable material with long-lasting quality</li>
                <li>Perfect for gifting or everyday use</li>
              </ul>
            ) : (
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Soft premium cotton blend for all-day comfort</li>
                <li>Machine washable & easy to maintain</li>
                <li>Available in vibrant colors</li>
                <li>Perfect fit for casual and semi-formal wear</li>
              </ul>
            )}
          </div>

          {/* Delivery & Returns */}
          <div className="pt-4 border-t text-sm text-gray-700">
            <p>
              <strong>Delivery:</strong> 3–7 business days across Europe
            </p>
            <p>
              <strong>Returns:</strong> 30-day hassle-free return policy
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition text-sm"
            >
              <ShoppingBag size={16} /> Add to Bag
            </button>
            <button
              onClick={handleAddToWishlist}
              className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition text-sm"
            >
              <Heart size={16} /> Add to Wishlist
            </button>
          </div>

          <Link
            to="/products"
            className="text-indigo-600 hover:underline text-sm block pt-2"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
