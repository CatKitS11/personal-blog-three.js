import React from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import VectorIcon from "@/assets/Vector.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authentication";
import { Bell, User, LogOut, Settings, Key } from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const { state, logout, isAuthenticated } = useAuth();
  const { user } = state;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Logo */}
      <a
        href="/"
        className="text-4xl font-semibold text-[#333333] mx-16 max-md:mx-2"
      >
        hh
        <span className="text-2xl font-bold text-[#059729]">.</span>
      </a>

      {/* Navigation Buttons */}
      <div className="flex max-xs:hidden items-center gap-4 mx-16">
        {!isAuthenticated ? (
          // Guest user buttons
          <>
            <Link to="/login">
              <Button
                variant="outline"
                className="py-5 px-8 font-medium text-gray-700 border-gray-800 hover:bg-gray-50 rounded-full"
              >
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="py-5 px-8 font-medium bg-gray-800 text-white hover:bg-gray-700 rounded-full">
                Sign up
              </Button>
            </Link>
          </>
        ) : (
          // Authenticated user section
          <div className="flex items-center gap-4">
            {/* Notifications */}
            {/* <div className="relative">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div> */}

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 p-2 focus:outline-none">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <span className="text-gray-700 font-medium">
                  {user?.name || user?.email || "User"}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (user?.role === "admin") {
                      navigate("/admin/reset-password");
                    } else {
                      navigate("/reset-password");
                    }
                  }}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Reset Password
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="hidden max-xs:block">
        <Select
          onValueChange={(v) => {
            if (v === "signup") navigate("/signup");
            if (v === "login") navigate("/login");
            if (v === "profile") navigate("/profile");
            if (v === "reset-password") navigate("/reset-password");
            if (v === "logout") handleLogout();
            if (v === "admin" && user?.role === "admin") navigate("/admin");
          }}
        >
          <SelectTrigger className="w-[40px] [&>svg]:hidden border-none">
            <SelectValue
              placeholder={
                <img src={VectorIcon} alt="Menu" className="w-6 h-3" />
              }
            />
          </SelectTrigger>
          <SelectContent className="flex flex-col gap-6 bg-white w-80 border-none shadow-none">
            {!isAuthenticated ? (
              <>
                <SelectItem value="login" className="justify-center">
                  Log in
                </SelectItem>
                <SelectItem value="signup" className="justify-center">
                  Sign up
                </SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="profile" className="justify-center">
                  Profile
                </SelectItem>
                <SelectItem value="reset-password" className="justify-center">
                  Reset Password
                </SelectItem>
                {user?.role === "admin" && (
                  <SelectItem value="admin" className="justify-center">
                    Admin Panel
                  </SelectItem>
                )}
                <SelectItem value="logout" className="justify-center">
                  Logout
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
};

export default NavBar;
