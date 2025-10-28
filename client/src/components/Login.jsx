import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await login(form);
      if (result?.error) {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "An unexpected error occurred" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
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

            {errors.submit && (
              <p className="text-sm text-red-500">{errors.submit}</p>
            )}

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
