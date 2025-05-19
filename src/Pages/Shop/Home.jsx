import React from "react";
import HeroCarousel from "../../Components/Sections/HeroCarousel";
import CategoryGrid from "../../Components/Sections/CategoryGrid";
import ProductGrid from "../../Components/Sections/ProductGrid";
import FeaturedProducts from "../../Components/Products/FeaturedProducts";
import Newsletter from "../../Components/Common/Newsletter";


// Home Component
// Renders the homepage with a carousel, category grid, featured products, product grid, newsletter, and footer.
const Home = () => {
  return (
    <div className="w-full mx-auto">
      {/* Hero section with rotating banners */}
      <HeroCarousel />
      {/* Grid of product categories */}
      <CategoryGrid />
      {/* Highlighted featured products */}
      <FeaturedProducts />
      {/* Grid of additional products */}
      <ProductGrid />
      {/* Newsletter subscription form */}
      <Newsletter />
    </div>
  );
};

export default Home;