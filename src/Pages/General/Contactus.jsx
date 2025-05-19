import React from "react";

// Contact Page
// Displays contact information with a friendly support message.
const Contact = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>

    {/* Email support info */}
    <p className="text-gray-600 mb-2">Email: support@hagyustic.com</p>

    {/* Phone support info */}
    <p className="text-gray-600 mb-2">Phone: +48 123 456 789</p>

    {/* Response time note */}
    <p className="text-gray-600">
      We typically respond within 24 hours during business days.
    </p>
  </div>
);

export default Contact;
