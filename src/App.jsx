import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <HeroSection />
    </div>
  );
}

export default App;
