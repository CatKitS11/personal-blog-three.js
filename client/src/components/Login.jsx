import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert } from "./ui/alert";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../contexts/authentication";

const Login = () => {
  const navigate = useNavigate();
  const { login, state } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: "error", message: "",content:"", }); // EDIT: เพิ่ม alert state

  // Auto-hide alert สำหรับ success // EDIT: เพิ่ม useEffect
  useEffect(() => {
    if (alert.show && alert.type === "success") {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.show, alert.type]);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // EDIT: clear field error
    if (alert.show) { // EDIT: ซ่อน alert เมื่อเริ่มพิมพ์
      setAlert({ ...alert, show: false });
    }
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
    e.preventDefault();
    if (!validate()) {
      setAlert({ // EDIT: แสดง alert สำหรับ validation error
        show: true,
        type: "error",
        message: "Please fill in all required fields correctly."
      });
      return;
    }

    // ซ่อน alert เดิม // EDIT
    setAlert({ show: false, type: "error", message: "" });

    try {
      const result = await login(form);
      if (result?.error) {
        setAlert({ // EDIT: ใช้ Alert แทน setErrors
          show: true,
          type: "error",
          message: result.error,
          content:"Please try another password or email",
        });
        setErrors({ submit: result.error }); // เก็บไว้สำหรับ backward compatibility
      } else {
        const role = result?.role || "";
        console.log(role);
        setAlert({
          show: true,
          type: "success",
          message: "Login successful!",
          content: "Redirecting to your dashboard..."
        });
        setTimeout(() => navigate(role === "admin" ? "/admin" : "/"), 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlert({ // EDIT: ใช้ Alert แทน setErrors
        show: true,
        type: "error",
        message: error.response?.data?.error || "An unexpected error occurred"
      });
      setErrors({ submit: "An unexpected error occurred" }); // เก็บไว้สำหรับ backward compatibility
    }
  };

  return (
    <div className="h-screen w-full bg-stone-100">
      {/* Alert Component */} {/* EDIT: เพิ่ม Alert */}
      {alert.show && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          content={alert.content}
          onClose={() => setAlert({ ...alert, show: false })} 
          variant="fixed" // หรือ "inline" ถ้าต้องการแสดงในหน้า
        />
      )}

      <div className="bg-[#EFEEEB] flex items-center justify-center py-[60px] px-[120px] mt-[140px] mx-[323px] rounded-xl sm:px-6 lg:px-8">
        <div className="max-w-sm w-full space-y-6">
          <div className="text-center">
            <h2 className="text-4xl font-semibold text-[#333333]">Log in</h2>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="flex flex-row pl-0.5 text-sm font-medium text-[#75716B]">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                className="py-3 border-gray-300 rounded-md bg-white"
                disabled={state.loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex flex-row pl-0.5 text-sm text-[#75716B] font-medium">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                className="py-3 border-gray-300 rounded-md bg-white"
                disabled={state.loading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* ลบ errors.submit ออกเพราะใช้ Alert แทนแล้ว */} {/* EDIT: comment out หรือลบออก */}
            {/* {errors.submit && (
              <p className="text-sm text-red-500">{errors.submit}</p>
            )} */}

            <Button
              type="submit"
              className=" py-[24px] px-12 bg-[#333333] text-white font-light hover:bg-[#2a2a2a] rounded-full"
              disabled={state.loading}
            >
              {state.loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Don't have any account?{" "}
            <a
              href="/signup"
              className="font-medium underline text-gray-800 hover:text-gray-700"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
