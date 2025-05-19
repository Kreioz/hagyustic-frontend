import React, { useState } from "react";
import { Sparkles, Shirt, Flame, X } from "lucide-react";

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true); // controls visibility of the bar

  if (!isVisible) return null; // don't render if hidden

  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-gray-900 text-white text-xs md:text-sm px-4 h-[64px] md:h-auto py-2">
      {/* Main container for the announcement content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1 sm:gap-2">
        {/* Branding message */}
        <p className="flex items-center gap-2">
          <Sparkles className="text-yellow-400" />
          <span>Let your clothing tell your story</span>
          <Shirt className="text-yellow-400" />
        </p>

        {/* Promotional offer */}
        <p className="flex items-center gap-2 text-yellow-400 font-semibold">
          <Flame />
          <span>20% OFF on your first order - Limited Time Deal!</span>
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)} // hide bar on click
        className="absolute top-1/2 -translate-y-1/2 right-4 text-white hover:text-red-400"
        aria-label="Close announcement"
      >
        <X />
      </button>
    </div>
  );
};

export default AnnouncementBar;
