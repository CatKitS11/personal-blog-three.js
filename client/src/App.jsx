import "./App.css";
import NavBar from "./components/NavBar";
import HeroSection from "@/components/HeroSection";
import ArticleSection from "./components/ArticleSection";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BlogDetail from './components/BlogDetail';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AdminLogin from "@/components/pages/admin/AdminLogin";
import AdminLayout from "@/components/pages/admin/AdminLayout";
import ArticleManagement from "@/components/pages/admin/ArticleManagement";
import CategoryManagement from "@/components/pages/admin/CategoryManagement";
import Profile from "@/components/pages/admin/Profile";
import Notification from "@/components/pages/admin/Notification";
import ResetPassword from "@/components/pages/admin/ResetPassword";

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

function AppInner() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideFooter = location.pathname === "/signup" || isAdminRoute;
  const hideNavbar = isAdminRoute;

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <NavBar />}
      <Routes>
        <Route path="/" element={
          <div>
            <HeroSection />
            <ArticleSection />
          </div>
        } />
        <Route path="/post/:postId" element={<BlogDetail />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ArticleManagement />} />
          <Route path="article-management" element={<ArticleManagement />} />
          <Route path="category-management" element={<CategoryManagement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notification" element={<Notification />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
