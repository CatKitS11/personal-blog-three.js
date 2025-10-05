import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import HeroSection from "@/components/HeroSection";
import ArticleSection from "./components/ArticleSection";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogDetail from './components/BlogDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 px-2">
        <NavBar />
        <Routes>
          <Route path="/" element={
            <div>
              <HeroSection />
              <ArticleSection />
            </div>
          } />
          <Route path="/post/:postId" element={<BlogDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
