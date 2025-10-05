import "./App.css";
import NavBar from "./components/NavBar";
import HeroSection from "@/components/HeroSection";
import ArticleSection from "./components/ArticleSection";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BlogDetail from './components/BlogDetail';
import SignUp from './components/SignUp';

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

function AppInner() {
  const location = useLocation();
  const hideFooter = location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Routes>
        <Route path="/" element={
          <div>
            <HeroSection />
            <ArticleSection />
          </div>
        } />
        <Route path="/post/:postId" element={<BlogDetail />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
