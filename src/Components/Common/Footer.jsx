import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, FileDown } from "lucide-react";

const Footer = () => {
  // Reusable section for grouped links (e.g. Quick Links, Categories, etc.)
  const renderLinkList = (title, links) => (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.path} className="hover:text-purple-600">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="w-full bg-gray-100 text-gray-700 pt-10 pb-4 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left: Navigation Sections */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {renderLinkList("Quick Links", [
            { path: "/", label: "Home" },
            { path: "/about", label: "About Us" },
            { path: "/contact", label: "Contact" },
            { path: "/faq", label: "FAQs" },
          ])}

          {renderLinkList("Categories", [
            { path: "/products?mainCategory=MEN", label: "Men" },
            { path: "/products?mainCategory=WOMEN", label: "Women" },
            { path: "/products?mainCategory=CHILD", label: "Child" },
            { path: "/products?mainCategory=ACCESSORIES", label: "Accessories" },
          ])}

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-purple-600">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-purple-600">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Developer Credit and Links */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Developer</h3>
            <p className="text-sm mb-3">Designed & built by:</p>
            <p className="font-medium text-gray-800 mb-4">Hari Krishnan Nagarajan</p>

            <div className="flex items-center gap-4 text-sm">
              <a
                href="https://www.linkedin.com/in/hari-krishnan-283360138/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-purple-600"
              >
                <Linkedin size={18} /> LinkedIn
              </a>
              <a
                href="https://github.com/Harikrish58"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-purple-600"
              >
                <Github size={18} /> GitHub
              </a>
              <a
                href="/Hari_Krishnan_Resume.pdf"
                download
                className="flex items-center gap-1 hover:text-purple-600"
              >
                <FileDown size={18} /> Resume
              </a>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-xs text-gray-500">
            © 2025 HaGyustic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
