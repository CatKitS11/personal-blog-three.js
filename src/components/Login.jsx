import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
    <div className="min-h-screen bg-white">
      <main className="px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mt-10 md:mt-16 rounded-xl border border-gray-200 bg-[#eeebe6] p-6 md:p-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Log in</h1>

            <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-6 flex flex-col gap-2 text-left">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                  className="bg-white"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Password</label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={onChange}
                  className="bg-white"
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div className="flex justify-center">
                <Button type="submit" className="bg-gray-900 text-white px-6 rounded-full">
                  Log in
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have any account?{" "}
              <a href="/signup" className="underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;