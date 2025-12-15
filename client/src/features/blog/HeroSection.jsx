import React from "react";
import heroImage from "@/assets/P_Image.jpg";

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
            Exploring design, code, and AI. Occasionally questioning life
            choices and GPU prices along the way.
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
              With roots in engineering and architectural visualization, I
              value clean systems, I enjoy exploring how AI can enhance
              creativity, and open new possibilities for interactive web
              experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;


