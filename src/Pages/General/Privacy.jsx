import React from "react";

// Privacy Component
// Displays the privacy policy for users; demo disclaimer is also included.
const Privacy = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 text-gray-700">
    <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>

    <p className="mb-4">
      We value your privacy. This website only collects personal data that is necessary
      for account registration, order processing, and basic analytics. All data is stored securely
      and is never sold or shared with third parties.
    </p>

    <p className="mb-4">
      Any usage of cookies or tracking technologies is minimal and used only to enhance user experience.
    </p>

    <p className="text-sm italic text-gray-500 mt-8">
      Note: This project is a demo portfolio build. No actual transactions or user data are processed.
    </p>
  </div>
);

export default Privacy;
