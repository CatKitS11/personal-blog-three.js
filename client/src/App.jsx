import "./App.css";
import NavBar from "./components/NavBar";
import HeroSection from "@/components/HeroSection";
import ArticleSection from "./components/ArticleSection";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import BlogDetail from "./components/BlogDetail";
import SignUp from "./components/SignUp";
import SignUpSuccess from "./components/SignUpSuccess";
import Login from "./components/Login";
import AdminLayout from "@/components/pages/admin/AdminLayout";
import ArticleManagement from "@/components/pages/admin/ArticleManagement";
import CategoryManagement from "@/components/pages/admin/CategoryManagement";
import AdminProfile from "@/components/pages/admin/AdminProfile";
import Notification from "@/components/pages/admin/Notification";
import CreateArticle from "@/components/pages/admin/CreateArticle";
import EditArticle from "@/components/pages/admin/EditArticle";
import CreateCategory from "@/components/pages/admin/CreateCategory";
import EditCategory from "@/components/pages/admin/EditCategory";
import AdminResetPassword from "@/components/pages/admin/AdminResetPassword";
import Profile from "@/components/pages/Profile";
import ResetPassword from "@/components/pages/ResetPassword";

import { useAuth } from "./contexts/authentication";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthenticationRoute from "./components/auth/AuthenticationRoute";

function App() {
  const location = useLocation();
  const { isAuthenticated, state } = useAuth();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const hideFooter =
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/sign-up/success" ||
    isAdminRoute;
  const hideNavbar = isAdminRoute;

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <NavBar />}

      <Routes>
        {/* 🌟 หน้าแรก - ไม่ต้อง protect */}
        <Route
          path="/"
          element={
            <div>
              <HeroSection />
              <ArticleSection />
            </div>
          }
        />

        {/* 📖 Blog Detail - ไม่ต้อง protect */}
        <Route path="/post/:postId" element={<BlogDetail />} />

        {/* 🔐 Login/Signup - ใช้ AuthenticationRoute (ถ้า login แล้วจะ redirect ตาม role) */}
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
          path="/sign-up/success"
          element={<SignUpSuccess />}
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

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="user"
            >
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="user"
            >
              <ResetPassword />
            </ProtectedRoute>
          }
        />

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
          <Route
            path="article-management/edit/:postId"
            element={<EditArticle />}
          />
          <Route path="category-management" element={<CategoryManagement />} />
          <Route
            path="category-management/create"
            element={<CreateCategory />}
          />
          <Route
            path="category-management/edit/:categoryId"
            element={<EditCategory />}
          />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="notification" element={<Notification />} />
          <Route path="reset-password" element={<AdminResetPassword />} />
        </Route>
      </Routes>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
