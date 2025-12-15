import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authentication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import axios from "axios";
import { useImageUpload } from "@/hooks/uploadProfilePic";
import { Alert } from "@/components/ui/alert"; // EDIT: use shared Alert (Login-like UX)

const AdminProfile = () => {
  const { state, fetchUser } = useAuth();
  const { user } = state;
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ // EDIT: unified alert state
    show: false,
    type: "info",
    message: "",
    content: "",
  });
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    profilePicture: null,
    currentFilename: null,
  });

  const {
    uploadProfilePicture,
    deleteImage,
    uploading: imageUploading,
    error: uploadError,
    setError: setUploadError,
  } = useImageUpload();

  useEffect(() => { // EDIT: auto-hide success alerts
    if (alert.show && alert.type === "success") {
      const t = setTimeout(() => setAlert((p) => ({ ...p, show: false })), 3000);
      return () => clearTimeout(t);
    }
  }, [alert.show, alert.type]);

  useEffect(() => { // EDIT: surface upload errors via Alert
    if (uploadError) {
      setAlert({
        show: true,
        type: "error",
        message: "Action failed",
        content: uploadError,
      });
    }
  }, [uploadError]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        profilePicture: user.profile_picture_url || null,
        currentFilename: user.profile_picture_url
          ? extractFilenameFromUrl(user.profile_picture_url)
          : null,
      });
    }
  }, [user]);

  const extractFilenameFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "bio" && value.length > 120) return;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (alert.show) setAlert((p) => ({ ...p, show: false })); // EDIT: hide alert on edit
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setProfileData((prev) => ({
        ...prev,
        profilePicture: evt.target.result,
      }));
    };
    reader.readAsDataURL(file);

    if (profileData.currentFilename) {
      await deleteImage(profileData.currentFilename);
    }

    const result = await uploadProfilePicture(file);
    if (result) {
      setProfileData((prev) => ({
        ...prev,
        profilePicture: result.imageUrl,
        currentFilename: result.filename,
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setAlert({ show: false, type: "info", message: "", content: "" }); // EDIT: reset alert
    setUploadError("");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        {
          name: profileData.name,
          username: profileData.username,
          bio: profileData.bio,
          profile_picture: profileData.profilePicture,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        await fetchUser();
        setAlert({ // EDIT: success alert instead of custom banner
          show: true,
          type: "success",
          message: "Saved profile",
          content: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setUploadError("Failed to update profile. Please try again."); // EDIT: will be surfaced via Alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {alert.show && ( // EDIT: render shared Alert
        <Alert
          type={alert.type}
          message={alert.message}
          content={alert.content}
          onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          variant="fixed"
        />
      )}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Profile</h1>
        <Button
          onClick={handleSave}
          disabled={loading || imageUploading}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full px-8 py-2.5 font-medium"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
      {/* uploadError is now surfaced via shared Alert for consistent UX */} {/* EDIT */}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-8">
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="relative">
              <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-gray-100">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              {imageUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="text-white text-xs font-medium">
                    Uploading...
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center pt-5 justify-center">
              <label
                htmlFor="admin-profile-picture"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {imageUploading ? "Uploading..." : "Upload profile picture"}
              </label>
              <input
                id="admin-profile-picture"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={imageUploading}
              />
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG or GIF. Max size 5MB
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex pl-0.5 text-sm font-medium text-[#75716B] mb-2">
                Name
              </label>
              <Input
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="w-full bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="flex pl-0.5 text-sm font-medium text-[#75716B] mb-2">
                Username
              </label>
              <Input
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                className="w-full bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="flex pl-0.5 text-sm font-medium text-[#75716B] mb-2">
                Email
              </label>
              <div className="flex px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm">
                {profileData.email}
              </div>
              <p className="pl-0.5 pt-2 text-left text-xs text-red-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="flex pl-0.5 text-sm font-medium text-[#75716B] mb-2">
                Bio{" "}
                <span className="pl-1 text-gray-400 font-normal">
                  (max 120 letters)
                </span>
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-sm leading-relaxed"
                rows="4"
                maxLength="120"
                placeholder="Tell us about yourself"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="pl-0.75 text-xs text-gray-500">
                  Tell us about yourself
                </p>
                <div className="text-xs font-medium text-gray-600">
                  <span
                    className={
                      profileData.bio.length >= 120 ? "text-red-600" : ""
                    }
                  >
                    {profileData.bio.length}
                  </span>
                  <span className="text-gray-400">/120</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* success is now surfaced via shared Alert for consistent UX */} {/* EDIT */}
    </div>
  );
};

export default AdminProfile;


