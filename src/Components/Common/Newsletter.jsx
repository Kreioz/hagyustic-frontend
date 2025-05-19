import React, { useState } from "react";
import { toast } from "react-toastify";

// Newsletter Component
// Displays a form for users to subscribe to the newsletter with a confirmation toast.
const Newsletter = () => {
  // State for email input field
  const [email, setEmail] = useState("");

  // Handles form submission and shows a toast message
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you for subscribing!", { autoClose: 2000 });
    setEmail(""); // Clear input after submission
  };

  return (
    <section className="py-12 px-4">
      {/* Wrapper for centering content */}
      <div className="max-w-3xl mx-auto text-center">
        {/* Headline and subtext */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Stay in the Loop
        </h2>
        <h4 className="text-xl font-bold text-gray-800 mb-4">
          10% discount for subscribing to the Newsletter
        </h4>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter and never miss updates on the latest drops
          and exclusive offers!
        </p>

        {/* Email subscription form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-2/3 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
