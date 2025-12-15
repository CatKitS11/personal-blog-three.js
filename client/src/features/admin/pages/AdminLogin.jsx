import React, { useEffect, useState } from "react"; // EDIT: add useEffect for auto-hide success alert
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authentication";
import { useNavigate } from "react-router-dom";
import { Alert } from "@/components/ui/alert"; // EDIT: use shared Alert like Login page

const AdminLogin = () => {
  const { login, state } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({ // EDIT: add alert state (Login-like)
    show: false,
    type: "error",
    message: "",
    content: "",
  });

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (alert.show) setAlert((prev) => ({ ...prev, show: false })); // EDIT: hide alert when typing
  };

  useEffect(() => { // EDIT: auto-hide success alert
    if (alert.show && alert.type === "success") {
      const t = setTimeout(() => setAlert((p) => ({ ...p, show: false })), 3000);
      return () => clearTimeout(t);
    }
  }, [alert.show, alert.type]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, type: "error", message: "", content: "" }); // EDIT: reset previous alert
    const result = await login({
      email: form.email,
      password: form.password,
    });

    if (result?.error) { // EDIT: show error via Alert (consistent UX)
      setAlert({
        show: true,
        type: "error",
        message: "Login failed",
        content: result.error,
      });
      return;
    }

    setAlert({ // EDIT: show success and redirect
      show: true,
      type: "success",
      message: "Login successful!",
      content: "Redirecting to admin dashboard...",
    });
    setTimeout(() => navigate("/admin"), 1500); // EDIT
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {alert.show && ( // EDIT: render shared Alert
        <Alert
          type={alert.type}
          message={alert.message}
          content={alert.content}
          onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          variant="fixed"
        />
      )}
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Admin Panel Log in
          </h2>
          <p className="mt-2 text-sm text-gray-600">Log in to manage your blog</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {/* state.error is now surfaced via Alert for consistent UX */} {/* EDIT */}

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


