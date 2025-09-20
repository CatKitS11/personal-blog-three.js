import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import HeroSection from "@/components/HeroSection";
import ArticleSection from "./components/ArticleSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </div>
  );
}

export default App;
