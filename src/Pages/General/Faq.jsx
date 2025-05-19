import React from "react";

// FAQ Page
// Displays frequently asked questions about shipping, returns, and payments.
const Faq = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
      Frequently Asked Questions
    </h1>

    {/* Question and answer list */}
    <div className="space-y-6 text-gray-700">
      <div>
        <h3 className="font-semibold text-lg">How long does delivery take?</h3>
        <p>We typically deliver within 3–7 business days across Europe.</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">Can I return an item?</h3>
        <p>Yes, we offer a 30-day hassle-free return policy on all eligible items.</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg">What payment methods do you accept?</h3>
        <p>We accept Visa, MasterCard, PayPal, and Stripe.</p>
      </div>
    </div>
  </div>
);

export default Faq;
