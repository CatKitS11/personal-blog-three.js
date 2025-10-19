import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaUserShield } from "react-icons/fa";
import { useAuth } from "../contexts/authentication";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    // EDIT: เปลี่ยนเป็น async function
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await login(form); // EDIT: เรียก login จาก useAuth
      if (result?.error) {
        // จัดการกับ error จาก login
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "An unexpected error occurred" });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Log in to hh.</h2>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-center py-3">
            <FcGoogle className="mr-3 h-5 w-5" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full justify-center py-3"
            onClick={() => navigate("/admin")}
          >
            <FaUserShield className="mr-3 h-5 w-5 text-gray-600" />
            Log in as Admin (Temporary)
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            className="py-3"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}

          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="py-3"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}

          {/* EDIT: เพิ่มการแสดง error จาก server */}
          {errors.submit && (
            <p className="text-sm text-red-500">{errors.submit}</p>
          )}

          <div className="text-right text-sm">
            <a
              href="#"
              className="font-medium text-gray-600 hover:text-gray-500"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full justify-center py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800"
          >
            Log in
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-gray-800 hover:text-gray-700"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
