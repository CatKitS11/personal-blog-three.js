import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authentication";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { login, state } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await login({
      email: form.email,
      password: form.password,
    });

    if (!result?.error) {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Admin Panel Log in
          </h2>
          <p className="mt-2 text-sm text-gray-600">Log in to manage your blog</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {state.error && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
              {state.error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Input
                name="email"
                type="email"
                required
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                className="py-3"
                disabled={state.loading}
              />
            </div>
            <div>
              <Input
                name="password"
                type="password"
                required
                placeholder="Password"
                value={form.password}
                onChange={onChange}
                className="py-3"
                disabled={state.loading}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full justify-center py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800"
              disabled={state.loading}
            >
              {state.loading ? "Logging in..." : "Log in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;


