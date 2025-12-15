import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import SignUpSuccessPage from "@/pages/auth/SignUpSuccessPage";
import LoginPage from "@/pages/auth/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AdminLayoutPage from "@/pages/admin/AdminLayoutPage";
import ArticleManagementPage from "@/pages/admin/ArticleManagementPage";
import CategoryManagementPage from "@/pages/admin/CategoryManagementPage";
import CreateArticlePage from "@/pages/admin/CreateArticlePage";
import EditArticlePage from "@/pages/admin/EditArticlePage";
import CreateCategoryPage from "@/pages/admin/CreateCategoryPage";
import EditCategoryPage from "@/pages/admin/EditCategoryPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
import NotificationPage from "@/pages/admin/NotificationPage";
import AdminResetPasswordPage from "@/pages/admin/AdminResetPasswordPage";

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
    <div className="min-h-screen bg-stone-100">
      {!hideNavbar && <NavBar />}

      <Routes>
        {/* 🌟 หน้าแรก - ไม่ต้อง protect */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* 📖 Blog Detail - ไม่ต้อง protect */}
        <Route path="/post/:postId" element={<BlogDetailPage />} />

        {/* 🔐 Login/Signup - ใช้ AuthenticationRoute (ถ้า login แล้วจะ redirect ตาม role) */}
        <Route
          path="/signup"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <SignUpPage />
            </AuthenticationRoute>
          }
        />

        <Route path="/sign-up/success" element={<SignUpSuccessPage />} />

        <Route
          path="/login"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <LoginPage />
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
              <ProfilePage />
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
              <ResetPasswordPage />
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
              <AdminLayoutPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ArticleManagementPage />} />
          <Route path="article-management" element={<ArticleManagementPage />} />
          <Route path="article-management/create" element={<CreateArticlePage />} />
          <Route
            path="article-management/edit/:postId"
            element={<EditArticlePage />}
          />
          <Route path="category-management" element={<CategoryManagementPage />} />
          <Route
            path="category-management/create"
            element={<CreateCategoryPage />}
          />
          <Route
            path="category-management/edit/:categoryId"
            element={<EditCategoryPage />}
          />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="reset-password" element={<AdminResetPasswordPage />} />
        </Route>
      </Routes>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
