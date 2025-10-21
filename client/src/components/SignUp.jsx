import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/authentication";

const SignUp = () => {
  const { register, state } = useAuth();  // EDIT: เพิ่ม state เพื่อเช็ค loading
  const navigate = useNavigate(); 

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    console.log("Submitting form:", form);
    
    try {
      const result = await register({
        name: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password
      });
  
      console.log("Register result:", result);
  
      if (result?.error) {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "An unexpected error occurred" });
    }
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
                  disabled={state.loading}  // EDIT: disable ระหว่าง loading
                />
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Username
                </label>
                <Input
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={onChange}
                  className="bg-white"
                  disabled={state.loading}  // EDIT: disable ระหว่าง loading
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                  className="bg-white"
                  disabled={state.loading}  // EDIT: disable ระหว่าง loading
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Password
                </label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={onChange}
                  className="bg-white"
                  disabled={state.loading}  // EDIT: disable ระหว่าง loading
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}

              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  className="bg-gray-900 text-white px-6 rounded-full"
                  disabled={state.loading}  // EDIT: disable ระหว่าง loading
                >
                  {state.loading ? "Signing up..." : "Sign up"}  {/* EDIT: แสดงสถานะ */}
                </Button>
              </div>
            </form>

            {/* EDIT: เพิ่มส่วนนี้ - Link ไปหน้า Login */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <a href="/login" className="underline hover:text-gray-800">
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