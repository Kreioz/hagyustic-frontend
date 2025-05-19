import React from "react";
import { Link } from "react-router-dom";

// NotFound Component
// Displays a 404 error message with a link to navigate back to the homepage.
const NotFound = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-xl md:text-2xl text-gray-700 mb-3">
        Oops! Page not found.
      </h2>
      <p className="text-gray-600 mb-6">
        The page you’re trying to reach doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
