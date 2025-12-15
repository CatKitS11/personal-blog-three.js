import { useEffect, useState } from "react"; // EDIT: add useEffect for auto-hide success alert
import { useAuth } from "@/contexts/authentication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Alert } from "@/components/ui/alert"; // EDIT: use shared Alert like Login page

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AdminResetPassword = () => {
  const { state } = useAuth();
  const { user } = state;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ // EDIT: unified alert state
    show: false,
    type: "info",
    message: "",
    content: "",
  });

  useEffect(() => { // EDIT: auto-hide success alerts
    if (alert.show && alert.type === "success") {
      const t = setTimeout(() => setAlert((p) => ({ ...p, show: false })), 3000);
      return () => clearTimeout(t);
    }
  }, [alert.show, alert.type]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
    if (alert.show) setAlert((p) => ({ ...p, show: false })); // EDIT: hide alert on edit
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) { // EDIT: surface validation via Alert
      setAlert({
        show: true,
        type: "error",
        message: "Please check your input",
        content: "Fix the highlighted fields and try again.",
      });
      return;
    }

    setLoading(true);
    setAlert({ show: false, type: "info", message: "", content: "" }); // EDIT: reset previous alert

    try {
      const response = await axios.put(
        `${apiBaseUrl}/auth/reset-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        setAlert({ // EDIT: success alert instead of inline banner
          show: true,
          type: "success",
          message: "Password updated",
          content: "Your password has been reset successfully.",
        });
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to reset password";
      setErrors({ submit: errorMsg });
      setAlert({ // EDIT: error alert
        show: true,
        type: "error",
        message: "Failed to reset password",
        content: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {alert.show && ( // EDIT: render shared Alert
        <Alert
          type={alert.type}
          message={alert.message}
          content={alert.content}
          onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          variant="fixed"
        />
      )}
      <div className="flex justify-between items-center pb-8 mb-4 mt-4 border-b">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="px-10 py-3 bg-[#333333] text-white rounded-full hover:bg-[#2a2a2a] transition-colors"
        >
          {loading ? "Resetting..." : "Reset password"}
        </Button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl">
        {/* success/errors are now surfaced via shared Alert for consistent UX */} {/* EDIT */}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="currentPassword"
              className="flex pl-0.5 text-sm font-medium text-[#75716B] mb-2"
            >
              Current password
            </label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Current password"
              value={formData.currentPassword}
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              className="w-full"
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-500 mt-2">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="flex pl-0.5 text-sm font-medium text-[#75716B] mb-2"
            >
              New password
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder="New password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className="w-full"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-2">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="flex pl-0.5 text-sm font-medium text-[#75716B] mb-2"
            >
              Confirm new password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className="w-full"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-2">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;


