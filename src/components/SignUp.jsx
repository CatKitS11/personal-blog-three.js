import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SignUp = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email";
    if (form.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Sign up:", form);
    // TODO: call API here
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mt-10 md:mt-16 rounded-xl border border-gray-200 bg-[#eeebe6] p-6 md:p-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign up</h1>
            <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-6 flex flex-col gap-2 text-left">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Name</label>
                <Input
                  name="fullName"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={onChange}
                  className="bg-white"
                />
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Username</label>
                <Input
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={onChange}
                  className="bg-white"
                />
                {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
              </div>

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
                  Sign up
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <a href="/login" className="underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;