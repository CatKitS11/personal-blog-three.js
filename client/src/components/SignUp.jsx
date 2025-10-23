import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/authentication";
import { useSignUpValidation } from "../hooks/useValidation";
import { useAvailabilityCheck } from "../hooks/useAvailabilityCheck";

const SignUp = () => {
  const { register, state } = useAuth();
  const navigate = useNavigate();
  const { errors, validateForm, clearError } = useSignUpValidation();
  const { availabilityStatus, checkFieldAvailability, clearAvailabilityStatus } = useAvailabilityCheck();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    clearError(name);
    
    // Check availability for username and email
    if (name === 'username' || name === 'email') {
      checkFieldAvailability(name, value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Check if username and email are available before submitting
    if (availabilityStatus.username.available === false || availabilityStatus.email.available === false) {
      return;
    }
    
    if (!validateForm(form)) return;
    
    try {
      const result = await register({
        name: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password
      });

      if (result?.error) {
        console.error("Registration error:", result.error);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Helper function to get status icon and color
  const getStatusDisplay = (field) => {
    const status = availabilityStatus[field];
    
    if (status.status === 'checking') {
      return (
        <div className="flex items-center text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 my-3 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm">{status.message}</span>
        </div>
      );
    }
    
    if (status.status === 'success') {
      return (
        <div className="flex items-center text-green-600">
          <svg className="w-4 h-4 mr-2 my-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">{status.message}</span>
        </div>
      );
    }
    
    if (status.status === 'error') {
      return (
        <div className="flex items-center text-red-600">
          <svg className="w-4 h-4 mr-2 my-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-sm">{status.message}</span>
        </div>
      );
    }
    
    // Show idle message (requirements not met)
    if (status.status === 'idle' && status.message) {
      return (
        <div className="flex items-center text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{status.message}</span>
        </div>
      );
    }
    
    return null;
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
                  disabled={state.loading}
                />
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Username
                </label>
                <Input
                  name="username"
                  placeholder="Username (more than 6 characters)"
                  value={form.username}
                  onChange={onChange}
                  className={`bg-white ${
                    availabilityStatus.username.status === 'error' ? 'border-red-500' : 
                    availabilityStatus.username.status === 'success' ? 'border-green-500' : ''
                  }`}
                  disabled={state.loading}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                )}
                {getStatusDisplay('username')}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email (must contain @ and .)"
                  value={form.email}
                  onChange={onChange}
                  className={`bg-white ${
                    availabilityStatus.email.status === 'error' ? 'border-red-500' : 
                    availabilityStatus.email.status === 'success' ? 'border-green-500' : ''
                  }`}
                  disabled={state.loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
                {getStatusDisplay('email')}
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
                  disabled={state.loading}
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
                  disabled={state.loading || 
                    availabilityStatus.username.available === false || 
                    availabilityStatus.email.available === false ||
                    availabilityStatus.username.status === 'checking' ||
                    availabilityStatus.email.status === 'checking'
                  }
                >
                  {state.loading ? "Signing up..." : "Sign up"}
                </Button>
              </div>
            </form>

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