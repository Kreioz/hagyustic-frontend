import React from "react";

// Terms Component
// Displays the terms of service and demo disclaimer for the HaGyustic project.
const Terms = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 text-gray-700">
    <h1 className="text-3xl font-bold text-center mb-6">Terms of Service</h1>

    <p className="mb-4">
      All content, products, and features displayed on this website are part of a
      demo project created for educational and portfolio purposes only.
      No actual sales, payments, or personal data processing take place.
    </p>

    <p className="mb-4">
      Users are advised not to enter any real personal, financial, or sensitive information.
      Any data entered is treated as mock content.
    </p>

    <p className="text-sm italic text-gray-500 mt-8">
      By using this site, you acknowledge that it is a demonstration project built by
      Hari Krishnan Nagarajan to showcase full-stack development skills.
    </p>
  </div>
);

export default Terms;
