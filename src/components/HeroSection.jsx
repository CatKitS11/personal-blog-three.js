import React from 'react';
import heroImage from '../assets/14d0ff1ec045ed1d618b25c84aa4327331ecdaaf.jpg';

const HeroSection = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
        {/* Left: Headline */}
        <div className="order-2 lg:order-1 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
          <h1 className="text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-800 leading-tight mb-6">
            Stay<br />
            Informed,<br />
            Stay Inspired
          </h1>
          <p className="text-base lg:text-base xl:text-lg text-gray-600 leading-relaxed">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
          </p>
        </div>

        {/* Center: Image */}
        <div className="order-1 lg:order-2 flex justify-center">
          <div className="w-full max-w-sm lg:max-w-xs xl:max-w-sm aspect-[4/5] rounded-lg overflow-hidden">
            <img
              src={heroImage}
              alt="Person with cat in autumn forest"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Author */}
        <div className="order-3 lg:order-3 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
          <span className="text-sm text-gray-500 uppercase tracking-wide">-Author</span>
          <h2 className="text-xl lg:text-xl xl:text-2xl font-bold text-gray-800 mt-2 mb-4">
            Thompson P.
          </h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed text-sm lg:text-sm xl:text-base">
              I am a pet enthusiast and freelance writer who specializes in animal behavior and care.
              With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
            </p>
            <p className="leading-relaxed text-sm lg:text-sm xl:text-base">
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