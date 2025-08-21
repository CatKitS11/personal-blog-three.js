import React from 'react';
import heroImage from '../assets/14d0ff1ec045ed1d618b25c84aa4327331ecdaaf.jpg';

const HeroSection = () => {
  return (
    <div className="flex items-center justify-between min-h-screen px-6 py-8 bg-white">
      {/* Left Section - Headline and Description */}
      <div className="flex-1 max-w-md">
        <h1 className="text-5xl font-bold text-gray-800 leading-tight mb-6">
          Stay<br />
          Informed,<br />
          Stay Inspired
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
        </p>
      </div>

      {/* Center Section - Image */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-80 h-96 rounded-lg shadow-lg overflow-hidden">
          <img 
            src={heroImage} 
            alt="Person with cat in autumn forest" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Section - Author Information */}
      <div className="flex-1 max-w-md">
        <div className="text-left">
          <span className="text-sm text-gray-500 uppercase tracking-wide">-Author</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2 mb-4">
            Thompson P.
          </h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed">
              I am a pet enthusiast and freelance writer who specializes in animal behavior and care. 
              With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
            </p>
            <p className="leading-relaxed">
              When I'm not writing, I spends time volunteering at my local animal shelter, 
              helping cats find loving homes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 