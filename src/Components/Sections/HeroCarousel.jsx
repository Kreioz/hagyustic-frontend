import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";

// Fallback image in case of missing image URLs
const fallbackImage =
  "https://res.cloudinary.com/dmupw3asw/image/upload/v1746989551/imagenotavailable_hbyyve.webp";

/**
 * HeroCarousel
 * Displays an animated hero slider with 3-column layout on desktop
 * and single-image swipeable layout on mobile.
 */
const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Monitor screen resize to toggle layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch carousel data from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/carousel`);
        setSlides(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch carousel slides:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Overlay CTA block for each slide
  const Overlay = ({ category }) => (
    <div className="absolute inset-0 bg-black/30 z-10 flex items-center px-6 md:px-20">
      <div className="text-white max-w-xl">
        <motion.h2
          className="text-2xl md:text-4xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.heading}
        </motion.h2>
        <motion.p
          className="text-sm md:text-lg mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {category.subheading}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to={`/products?mainCategory=${category.name}`}>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm">
              Shop {category.name}
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="w-full h-[70vh] md:h-[85vh] bg-gray-200 animate-pulse"></div>;
  }

  return (
    <div className="w-full h-[70vh] md:h-[85vh] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 5000 }}
        loop={slides.length >= 3}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-full"
      >
        {/* Mobile: 1 image per slide */}
        {isMobile
          ? slides.flatMap((slide, slideIndex) =>
              slide.images.map((img, i) => (
                <SwiperSlide key={`${slideIndex}-${i}`} className="relative w-full h-full">
                  <Link to={`/products?mainCategory=${slide.category}`} className="w-full h-full">
                    <img
                      src={img}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = fallbackImage)}
                      loading="lazy"
                    />
                  </Link>
                  <Overlay
                    category={{
                      name: slide.category,
                      heading: slide.title,
                      subheading: slide.subtitle,
                    }}
                  />
                </SwiperSlide>
              ))
            )
          : slides.map((slide, index) => (
              <SwiperSlide key={index} className="relative w-full h-full">
                <div className="flex w-full h-full">
                  {slide.images.map((img, i) => (
                    <Link
                      key={i}
                      to={`/products?mainCategory=${slide.category}`}
                      className="w-1/3 h-full"
                    >
                      <img
                        src={img}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = fallbackImage)}
                        loading="lazy"
                      />
                    </Link>
                  ))}
                  <Overlay
                    category={{
                      name: slide.category,
                      heading: slide.title,
                      subheading: slide.subtitle,
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;
