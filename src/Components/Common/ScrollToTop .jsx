import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Automatically scrolls to top whenever the route changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation(); // Get current route path

  useEffect(() => {
    // Scroll to top on pathname change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // No visual output
};

export default ScrollToTop;
