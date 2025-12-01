import React from "react";
import heroImage from "../assets/P_Image.jpg";

const HeroSection = () => {
  return (
    <div className="mx-auto max-w-7xl my-36 px-6 py-8 bg-stone-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
        {/* Left: Headline */}
        <div className="order-2 lg:order-1 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
          <div className="flex flex-col items-end text-4xl font-bold text-gray-800 leading-tight mb-6 mx-6">
            <span>Web</span>
            <span>Design,</span>
            <span>and AI Innovation</span>
          </div>
          <div className="flex flex-col justify-end items-end text-base lg:text-base xl:text-lg text-gray-600 leading-relaxed">
          Exploring design, code, and AI.
          Occasionally questioning life choices and GPU prices along the way.
          </div>
        </div>

        {/* Center: Image */}
        <div className="order-1 lg:order-2 flex justify-center">
          <div className="w-full max-w-sm lg:max-w-xs xl:max-w-sm aspect-[4/5] rounded-lg overflow-hidden">
            <img
              src={heroImage}
              alt="Person with cat in autumn forest"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(1.2) contrast(0.95)" }}
            />
          </div>
        </div>

        {/* Right: Author */}
        <div className="order-3 lg:order-3 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
          <span className="text-sm text-gray-500 uppercase tracking-wide">
            -Author
          </span>
          <h2 className="text-xl lg:text-xl xl:text-2xl font-bold text-gray-800 mt-2 mb-4">
            Patchara L.
          </h2>
          <div className="space-y-4 text-gray-600">
            <p className="leading-relaxed text-sm lg:text-sm xl:text-base">
              I am a full-stack developer and 3D visual artist who combines
              design, engineering logic, and AI-driven tools to build intuitive
              and visually engaging digital experiences.
            </p>
            <p className="leading-relaxed text-sm lg:text-sm xl:text-base">
              With roots in engineering and architectural visualization, I value
              clean systems, I enjoy exploring how AI can enhance
              creativity,  and open new possibilities for
              interactive web experiences.
            </p>
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
          <div className="order-2 lg:order-1 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="flex flex-col items-end text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-800 leading-tight mb-6 mx-6">
              <span>Stay</span>
              <span>Informed,</span>
              <span>Stay Inspired</span>
            </h1>
            <div className="flex flex-col justify-end items-end text-base lg:text-base xl:text-lg text-gray-600 leading-relaxed">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="w-full max-w-sm lg:max-w-xs xl:max-w-sm aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src={heroImage}
                alt="Person with cat in autumn forest"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

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
        </div> */}
    </div>
  );
};

export default HeroSection;
