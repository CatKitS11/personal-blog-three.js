import "./App.css";
import NavBar from "./components/NavBar";
import HeroSection from "@/components/HeroSection";
import ArticleSection from "./components/ArticleSection";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from 'react-router-dom';
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
import CreateArticle from "@/components/pages/admin/CreateArticle";

import { useAuth } from "./contexts/authentication";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthenticationRoute from "./components/auth/AuthenticationRoute";

function App() {
  const location = useLocation();
  const { isAuthenticated, state } = useAuth();
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideFooter = location.pathname === "/signup" || isAdminRoute;
  const hideNavbar = isAdminRoute;

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <NavBar />}
      
      <Routes>
        {/* 🌟 หน้าแรก - ไม่ต้อง protect */}
        <Route path="/" element={
          <div>
            <HeroSection />
            <ArticleSection />
          </div>
        } />
        
        {/* 📖 Blog Detail - ไม่ต้อง protect */}
        <Route path="/post/:postId" element={<BlogDetail />} />
        
        {/* 🔐 Login/Signup - ใช้ AuthenticationRoute (ถ้า login แล้วจะ redirect ไป home) */}
        <Route 
          path="/signup" 
          element={
            <AuthenticationRoute 
              isLoading={state.getUserLoading} 
              isAuthenticated={isAuthenticated}
            >
              <SignUp />
            </AuthenticationRoute>
          } 
        />
        
        <Route 
          path="/login" 
          element={
            <AuthenticationRoute 
              isLoading={state.getUserLoading} 
              isAuthenticated={isAuthenticated}
            >
              <Login />
            </AuthenticationRoute>
          } 
        />
        
        {/* 🔐 Admin Login - ไม่ต้อง protect (หน้า login ของ admin) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* 👨‍💼 Admin Routes - ใช้ ProtectedRoute (ต้อง login + role = admin) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ArticleManagement />} />
          <Route path="article-management" element={<ArticleManagement />} />
          <Route path="article-management/create" element={<CreateArticle />} />
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