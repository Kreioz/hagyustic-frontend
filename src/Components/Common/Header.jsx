import React from "react";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";

// Header Component
// Combines the top announcement bar and main navigation menu
const Header = () => {
  return (
    <div>
      {/* Top bar showing promotional message or offers */}
      <AnnouncementBar />

      {/* Main site navigation: logo, search, cart, user */}
      <Navbar />
    </div>
  );
};

export default Header;
