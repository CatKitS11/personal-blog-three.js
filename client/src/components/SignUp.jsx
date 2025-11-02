import React, { useState, useEffect } from "react"; // EDIT: เพิ่ม useEffect
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert } from "./ui/alert";
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

  const [alert, setAlert] = useState({ show: false, type: "error", message: "" });

  // Auto-hide alert หลัง 5 วินาที // EDIT: เพิ่ม useEffect
  useEffect(() => { // EDIT
    if (alert.show && alert.type === "success") { // EDIT: auto-hide เฉพาะ success
      const timer = setTimeout(() => { // EDIT
        setAlert({ ...alert, show: false }); // EDIT
      }, 3000); // EDIT: 3 วินาทีสำหรับ success
      return () => clearTimeout(timer); // EDIT
    } // EDIT
  }, [alert.show, alert.type]); // EDIT

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    clearError(name);
    
    // ซ่อน alert เมื่อผู้ใช้เริ่มพิมพ์ // EDIT
    if (alert.show) { // EDIT
      setAlert({ ...alert, show: false }); // EDIT
    } // EDIT
    
    // Check availability for username and email
    if (name === 'username' || name === 'email') {
      checkFieldAvailability(name, value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // ซ่อน alert เดิม
    setAlert({ show: false, type: "error", message: "" });
    
    // Check if username and email are available before submitting
    if (availabilityStatus.username.available === false || availabilityStatus.email.available === false) {
      setAlert({ 
        show: true, 
        type: "error", 
        message: "Please fix the errors before submitting. Username or email may already be taken." 
      });
      return;
    }
    
    if (!validateForm(form)) {
      setAlert({ 
        show: true, 
        type: "error", 
        message: "Please fill in all required fields correctly." 
      });
      return;
    }
    
    try {
      const result = await register({
        name: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password
      });

      if (result?.error) {
        console.error("Registration error:", result.error);
        setAlert({ 
          show: true, 
          type: "error", 
          message: result.error 
        });
      } else {
        // Success - แสดง alert แล้ว redirect
        setAlert({ 
          show: true, 
          type: "success", 
          message: "Account created successfully! Redirecting to success page..." 
        });
        // context จะ redirect ไป /sign-up/success อัตโนมัติ
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAlert({ 
        show: true, 
        type: "error", 
        message: error.response?.data?.error || error.message || "An error occurred during registration" 
      });
    }
  };

  // Helper function to get status icon and color
  const getStatusDisplay = (field) => {
    const status = availabilityStatus[field];
    
    if (!status || status.status === undefined) return null; // EDIT: เพิ่ม null check
    
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
      <main className="px-4 py-8"> {/* EDIT: เพิ่ม py-8 */}
        <div className="max-w-3xl mx-auto">
          {/* Alert Component - แสดงด้านบนสุด */} {/* EDIT */}
          {alert.show && ( // EDIT
            <Alert 
              type={alert.type} 
              message={alert.message} 
              onClose={() => setAlert({ ...alert, show: false })} 
              className="mb-4" // EDIT: เพิ่ม margin-bottom
            />
          )} {/* EDIT */}
          
          <div className="mt-10 md:mt-16 rounded-xl border border-gray-200 bg-[#EFEEEB] p-6 md:p-10">
            <h1 className="text-4xl font-semibold text-center text-[#333333] mb-8">Sign up</h1>
            <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-6 flex flex-col gap-2 text-left">
              <div>
                <label htmlFor="fullName" className="block text-sm text-gray-600 mb-2"> {/* EDIT: เพิ่ม htmlFor */}
                  Name
                </label>
                <Input
                  id="fullName" // EDIT: เพิ่ม id
                  name="fullName"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={onChange}
                  className="bg-white"
                  disabled={state.loading}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 mt-1" role="alert">{errors.fullName}</p> // EDIT: เพิ่ม role
                )}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm text-gray-600 mb-2"> {/* EDIT: เพิ่ม htmlFor */}
                  Username
                </label>
                <Input
                  id="username" // EDIT: เพิ่ม id
                  name="username"
                  placeholder="Username (more than 6 characters)"
                  value={form.username}
                  onChange={onChange}
                  className={`bg-white ${
                    availabilityStatus.username?.status === 'error' ? 'border-red-500' : 
                    availabilityStatus.username?.status === 'success' ? 'border-green-500' : ''
                  }`} // EDIT: เพิ่ม optional chaining
                  disabled={state.loading}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1" role="alert">{errors.username}</p> // EDIT: เพิ่ม role
                )}
                {getStatusDisplay('username')}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-2"> {/* EDIT: เพิ่ม htmlFor */}
                  Email
                </label>
                <Input
                  id="email" // EDIT: เพิ่ม id
                  name="email"
                  type="email"
                  placeholder="Email (must contain @ and .)"
                  value={form.email}
                  onChange={onChange}
                  className={`bg-white ${
                    availabilityStatus.email?.status === 'error' ? 'border-red-500' : 
                    availabilityStatus.email?.status === 'success' ? 'border-green-500' : ''
                  }`} // EDIT: เพิ่ม optional chaining
                  disabled={state.loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1" role="alert">{errors.email}</p> // EDIT: เพิ่ม role
                )}
                {getStatusDisplay('email')}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-600 mb-2"> {/* EDIT: เพิ่ม htmlFor */}
                  Password
                </label>
                <Input
                  id="password" // EDIT: เพิ่ม id
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={onChange}
                  className="bg-white"
                  disabled={state.loading}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1" role="alert">{errors.password}</p> // EDIT: เพิ่ม role
                )}
              </div>

              {errors.submit && ( // EDIT: เพิ่ม conditional check
                <p className="text-sm text-red-500 text-center" role="alert">{errors.submit}</p> // EDIT: เพิ่ม role
              )}

              <div className="flex justify-center pt-4"> {/* EDIT: เพิ่ม pt-4 */}
                <Button 
                  type="submit" 
                  className="py-[24px] px-12 bg-gray-900 text-white font-light rounded-full hover:bg-gray-800 transition-colors" // EDIT: เพิ่ม hover และ transition
                  disabled={state.loading || 
                    availabilityStatus.username?.available === false || 
                    availabilityStatus.email?.available === false ||
                    availabilityStatus.username?.status === 'checking' ||
                    availabilityStatus.email?.status === 'checking'
                  } // EDIT: เพิ่ม optional chaining
                >
                  {state.loading ? (
                    <span className="flex items-center gap-2"> {/* EDIT: ปรับปรุง loading state */}
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Signing up...
                    </span>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="underline font-semibold hover:text-gray-800 transition-colors" // EDIT: เพิ่ม transition
              >
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