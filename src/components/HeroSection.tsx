import React from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

const HeroSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-16 py-20">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-[#00FF03] mb-8">
          Medium length hero headline goes here
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique. Duis cursus, mi quis viverra
          ornare.
        </p>

        <Link
          to="/get-started"
          className="bg-[#00FF03] px-8 py-3 rounded-lg text-black font-medium flex items-center space-x-2 hover:bg-opacity-90 transition-all"
        >
          <span>Get Started</span>
          <HiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
