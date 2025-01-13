import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="px-4 md:px-16 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-gray-100 text-2xl font-bold">
          BASED
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-100 hover:text-green-400">
            Home
          </Link>
          <Link to="/about" className="text-gray-100 hover:text-green-400">
            About
          </Link>
          <Link to="/services" className="text-gray-100 hover:text-green-400">
            Services
          </Link>
          <Link
            to="/get-started"
            className="bg-[#00FF03] px-6 py-2 rounded-lg text-black font-medium"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-100">
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#070808] border-t border-gray-800">
          <div className="flex flex-col space-y-4 px-4 py-6">
            <Link to="/" className="text-gray-100 hover:text-green-400">
              Home
            </Link>
            <Link to="/about" className="text-gray-100 hover:text-green-400">
              About
            </Link>
            <Link to="/services" className="text-gray-100 hover:text-green-400">
              Services
            </Link>
            <Link
              to="/get-started"
              className="bg-[#00FF03] px-6 py-2 rounded-lg text-black font-medium w-full text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
