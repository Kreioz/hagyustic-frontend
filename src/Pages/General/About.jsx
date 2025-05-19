import React from "react";

// About Page
// Describes the HaGyustic project and highlights tech stack used.
const About = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">About HaGyustic</h1>
    
    {/* Project summary */}
    <p className="text-gray-600 text-base leading-relaxed">
      HaGyustic is a modern eCommerce platform developed to demonstrate real-world full-stack skills. 
      It includes features like product filtering, dynamic search, secure authentication, shopping cart, Stripe and PayPal payments, and a fully functional admin dashboard.
    </p>
    
    {/* Tech stack */}
    <p className="text-gray-600 text-base mt-4">
      Built using the MERN stack — React, TailwindCSS, Redux, Node.js, Express, and MongoDB — with Stripe and Cloudinary integrations.
    </p>
  </div>
);

export default About;
