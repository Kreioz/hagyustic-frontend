import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import ProductSelectionSidebar from "../Common/ProductSelectionSidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// Categories to filter products
const categories = ["WOMEN", "MEN", "CHILD", "ACCESSORIES"];

const fallbackImage =
  "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

/**
 * ProductGrid
 * Carousel section showing featured products by category with swipe support
 */
const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("WOMEN");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState("");
  const swiperRef = useRef(null);

  // Fetch all products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products`
        );
        setProducts(response.data.data || []);
      } catch {
        toast.error("Failed to load products", { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by selected category
  const filteredProducts = products.filter(
    (p) => p.mainCategory === activeTab
  );

  // Reset swiper to first slide when tab changes
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
    }
  }, [activeTab]);

  const handleOpenSidebar = (product, type) => {
    setSelectedProduct(product);
    setActionType(type);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedProduct(null);
    setActionType("");
  };

  if (loading) {
    return <div className="w-full py-12 text-center">Loading...</div>;
  }

  return (
    <div className="w-full py-12 bg-gradient-to-b from-yellow-100 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          You can't miss it
        </h2>

        {/* Category Tabs */}
        <div className="flex justify-center gap-3 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                activeTab === cat
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-yellow-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="pb-10"
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product._id}>
                <div className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="relative">
                      <img
                        src={`${product.images[0]}?w=400&h=400&f=auto&q=80`}
                        alt={product.name}
                        className="w-full aspect-[4/5] object-cover transition duration-300 group-hover:opacity-80"
                        onError={(e) => (e.target.src = fallbackImage)}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <p className="text-yellow-600 font-medium">
                        €{product.price}
                      </p>
                    </div>
                  </Link>

                  <div className="flex justify-between px-4 pb-4 -mt-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenSidebar(product, "wishlist");
                      }}
                      className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition-colors"
                    >
                      <Heart className="text-yellow-600" size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenSidebar(product, "cart");
                      }}
                      className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition-colors"
                    >
                      <ShoppingBag className="text-yellow-600" size={18} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {/* Navigation Arrows */}
            <div className="swiper-button-prev w-8 h-8 absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-yellow-100">
              <svg
                className="w-3 h-3 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="swiper-button-next w-8 h-8 absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-yellow-100">
              <svg
                className="w-3 h-3 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Swiper>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-6">
          <Link
            to={`/products?mainCategory=${activeTab}`}
            className="inline-block px-5 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
          >
            View All {activeTab}
          </Link>
        </div>
      </div>

      {/* Product selection sidebar (Add to cart/wishlist) */}
      {isSidebarOpen && selectedProduct && (
        <ProductSelectionSidebar
          product={selectedProduct}
          actionType={actionType}
          onClose={handleCloseSidebar}
        />
      )}
    </div>
  );
};

export default ProductGrid;
