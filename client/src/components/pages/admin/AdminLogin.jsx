import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminLogin = () => {
  const [form, setForm] = useState({
    adminId: "",
    password: "",
  });

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd navigate to the admin panel on success
    console.log("Admin Login:", form);
    // window.location.href = '/admin'; // Example of redirection
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Admin Panel Log in
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Log in to hh. admin panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                name="adminId"
                type="text"
                required
                placeholder="Admin ID"
                value={form.adminId}
                onChange={onChange}
                className="py-3"
              />
            </div>
            <div className="pt-2">
              <Input
                name="password"
                type="password"
                required
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                className="py-3"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full justify-center py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800">
              Log in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;