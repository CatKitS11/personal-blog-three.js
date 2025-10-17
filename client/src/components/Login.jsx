import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
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
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Login:", form);
    // TODO: call login API
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Log in to hh.
          </h2>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-center py-3">
            <FcGoogle className="mr-3 h-5 w-5" />
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full justify-center py-3">
            <FaFacebook className="mr-3 h-5 w-5 text-blue-600" />
            Continue with Facebook
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
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="py-3"
          />

          <div className="text-right text-sm">
            <a href="#" className="font-medium text-gray-600 hover:text-gray-500">
              Forgot password?
            </a>
          </div>

          <Button type="submit" className="w-full justify-center py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800">
            Log in
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="font-medium text-gray-800 hover:text-gray-700">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;