import React, { useEffect, useState } from "react";
import { propertySaveAPI } from "../../services/api";
import SavedPropertiesPage from "../PropertiesSave/Table";
import { Mail, X } from "lucide-react";
import { authAPI } from "../../services/api";
import DealsPage from "../Deals/DealsPage";

const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Investor",
  phone: "+1 234 567 890",
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [savedProperty, setSavedProperty] = useState();

  // Get user details from localStorage
  let userDetails = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      userDetails = JSON.parse(userStr);
    }
  } catch (e) {
    userDetails = null;
  }

  // Fallback to mockUser if no localStorage data
  const user = userDetails
    ? {
        name: `${userDetails.first_name || ""} ${
          userDetails.last_name || ""
        }`.trim(),
        email: userDetails.email || "",
        role: userDetails.role || "",
        phone: userDetails.phone || "",
      }
    : mockUser;

  // Fetch saved properties
  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const response = await propertySaveAPI.getPropertySave({
          per_page: 100,
        }); // adjust per_page as needed
        if (response.data.status === "success") {
          setSavedProperty(response.data.data.data);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchSavedProperties();
  }, []);

  // Back navigation handler
  const handleBackNavigation = () => {
    // Option 1: Use browser history
    window.history.back();

    // Option 2: Navigate to specific route (uncomment and modify as needed)
    // window.location.href = "/dashboard"; // or your desired route

    // Option 3: If using React Router, you can use navigate
    // navigate(-1); // or navigate('/dashboard')
  };

  return (
    <>
      {/* Header with Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-100 dark:text-white">
          Profile
        </h1>
        <button
          onClick={handleBackNavigation}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          aria-label="Go back"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="me-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group focus:outline-none ${
                activeTab === "profile"
                  ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              <svg
                className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
              Profile
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab("property")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group focus:outline-none ${
                activeTab === "property"
                  ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              <svg
                className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
              </svg>
              Property
            </button>
          </li>

          <li className="me-2">
            <button
              onClick={() => setActiveTab("deal-property")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group focus:outline-none ${
                activeTab === "deal-property"
                  ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              <svg
                className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
              </svg>
              Deal
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "profile" && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-2xl shadow-xl p-8 w-full max-w-lg border border-white/10">
              <div className="flex flex-col items-center gap-4">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
                  {/* SVG Avatar */}
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="15"
                      stroke="url(#profile-gradient)"
                      strokeWidth="2"
                      fill="white"
                    />
                    <defs>
                      <linearGradient
                        id="profile-gradient"
                        x1="0"
                        y1="0"
                        x2="32"
                        y2="32"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#a78bfa" />
                        <stop offset="1" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                    <ellipse
                      cx="16"
                      cy="13"
                      rx="5"
                      ry="5.5"
                      fill="#6366f1"
                      fillOpacity="0.15"
                    />
                    <ellipse cx="16" cy="13" rx="3.5" ry="3.5" fill="#6366f1" />
                    <path
                      d="M8.5 24c1.5-3 5-4 7.5-4s6 1 7.5 4"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
                {/* Name */}
                <div className="text-2xl font-bold text-white text-center">
                  {user.name}
                </div>
                {/* Role badge */}
                {user.role && (
                  <span className="inline-block bg-indigo-600/80 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm mb-1">
                    {user.role}
                  </span>
                )}
                {/* Email */}
                <div className="text-gray-300 text-sm flex items-center gap-2">
                  <Mail />
                  {user.email}
                </div>
                {/* Phone */}
                {user.phone && (
                  <div className="text-gray-400 text-sm flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-indigo-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      ></path>
                    </svg>
                    {user.phone}
                  </div>
                )}
                {/* Edit Profile Button (optional, for future) */}
                <button className="mt-4 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition">
                  Edit Profile
                </button>
                {/* Logout Button */}
                <button
                  className="mt-2 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition"
                  onClick={async () => {
                    try {
                      await authAPI.logout();
                    } catch (e) {}
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === "property" && <SavedPropertiesPage />}
        {activeTab === "deal-property" && <DealsPage />}
      </div>
    </>
  );
};

export default ProfilePage;
