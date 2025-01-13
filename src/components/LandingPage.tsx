import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#070808]">
      {/* Background Video with Overlay */}
      <div className="relative w-full h-screen">
        <video
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/your-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* Blur Effect */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-black blur-[400px]"></div>

        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          <HeroSection />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
