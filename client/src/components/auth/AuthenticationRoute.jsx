// /* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";

function AuthenticationRoute({ isLoading, isAuthenticated, children }) {
  if (isLoading === null || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // EDIT: เช็ค role และ redirect ตาม role
    const userRole = localStorage.getItem('userRole'); // เก็บ role ใน localStorage
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default AuthenticationRoute;
