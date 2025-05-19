import React from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import ScrollToTop from "../Common/ScrollToTop ";


/**
 * MainLayout Component
 * Wraps the page with global structure: Header at the top, Footer at the bottom,
 * and scroll-to-top logic on route change. The `children` prop fills the content area.
 */
const MainLayout = ({ children }) => {
  return (
    <>
      {/* Automatically scroll to top on route change */}
      <ScrollToTop />

      {/* Top section: includes AnnouncementBar and Navbar */}
      <Header />

      {/* Main page content */}
      <main className="min-h-[calc(100vh-200px)] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {children}
      </main>

      {/* Bottom section: global footer */}
      <Footer />
    </>
  );
};

export default MainLayout;
