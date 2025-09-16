import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBar from "../UI/NotificationBar";

const topLevelNavLinks = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/analytics", label: "Analytics" },
  { to: "/app/psychology", label: "Psychological Dashboard" },
  { to: "/app/content-management", label: "Content Management" },
];

const marketplaceNavLinks = [
  { to: "/app/live-activity", label: "Live Feed" },
  { to: "/app/properties", label: "Properties" },
  { to: "/app/deals", label: "Deals" },
];

const marketingHubNavLinks = [
  { to: "/app/campaigns", label: "Campaigns" },
  { to: "/app/duplicate", label: "Duplicate Management" },
  { to: "/app/leads", label: "Leads" },
  { to: "/app/clients", label: "Clients" },
  { to: "/app/marketing/advanced", label: "Advanced" },
];

// AI Features navigation links
const aiFeatureNavLinks = [
  { to: "/app/ai/vision", label: "Vision AI" },
  { to: "/app/ai/voice", label: "Voice AI" },
  { to: "/app/ai/nlp-center", label: "NLP Center" },
];

// Base settings for all roles (except staff)
const baseSettingsNavLinks = [
  { to: "/app/settings", label: "Organization Settings" },
  { to: "/app/user-management", label: "User Management" },
  { to: "/app/billing", label: "Billing & Subscription" },
];

// Super admin only settings
const superAdminSettingsNavLinks = [
  { to: "/app/ai-settings", label: "AI Settings" },
];

const saasManagementNavLinks = [
  { to: "/app/tenant-management", label: "Tenant Management" },
  { to: "/app/role-management", label: "Role Management" },
];

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isMarketplaceExpanded, setIsMarketplaceExpanded] = useState(false);
  const [isMarketingHubExpanded, setIsMarketingHubExpanded] = useState(false);
  const [isSaaSManagementExpanded, setIsSaaSManagementExpanded] =
    useState(false);
  const [isAIFeaturesExpanded, setIsAIFeaturesExpanded] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = userDetails.role || "staff"; // Default to staff if no role

  // Generate settings links based on role
  const getSettingsNavLinks = () => {
    if (userRole === "superadmin") {
      return [...baseSettingsNavLinks, ...superAdminSettingsNavLinks]; // Show ALL settings for superadmin
    } else if (userRole === "admin") {
      return [...baseSettingsNavLinks]; // Show base settings for admin
    }
    return []; // Staff gets no settings
  };

  // Generate SaaS Management links based on role
  const getSaaSManagementNavLinks = () => {
    if (userRole === "superadmin") {
      return saasManagementNavLinks; // Show all SaaS management links
    } else if (userRole === "admin") {
      // Filter out tenant management for admin users
      return saasManagementNavLinks.filter(
        (link) => link.to !== "/app/tenant-management"
      );
    }
    return []; // Staff gets no SaaS management
  };

  const settingsNavLinks = getSettingsNavLinks();
  const filteredSaaSManagementNavLinks = getSaaSManagementNavLinks();

  // Check if settings section should be shown
  const shouldShowSettings = userRole !== "staff";

  // Check if SaaS Management should be shown (for superadmin and admin)
  const shouldShowSaaSManagement =
    userRole === "superadmin" || userRole === "admin";

  // Check if Marketplace should be shown (show for all roles including superadmin)
  const shouldShowMarketplace = userRole !== "staff"; // Changed: now shows for superadmin too

  // Check if Marketing Hub should be shown (show for all roles including superadmin)
  const shouldShowMarketingHub = userRole !== "staff"; // Changed: now shows for superadmin too

  // Check if AI Features should be shown (show for all roles)
  const shouldShowAIFeatures = true;

  // Check if any of the "Settings" submenu items are currently active
  const isSettingsActive =
    settingsNavLinks.some((link) => location.pathname.startsWith(link.to)) ||
    (shouldShowSaaSManagement &&
      filteredSaaSManagementNavLinks.some((link) =>
        location.pathname.startsWith(link.to)
      ));

  const isSaaSManagementActive =
    shouldShowSaaSManagement &&
    filteredSaaSManagementNavLinks.some((link) =>
      location.pathname.startsWith(link.to)
    );

  // Check if any of the "Marketplace" submenu items are currently active
  const isMarketplaceActive = marketplaceNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  // Check if any of the "Marketing Hub" submenu items are currently active
  const isMarketingHubActive = marketingHubNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  // Check if any of the "AI Features" submenu items are currently active
  const isAIFeaturesActive = aiFeatureNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  return (
    <>
      <NotificationBar />
      <div className="h-screen grid grid-cols-[280px_1fr] bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Sidebar */}
        <aside className="bg-[#18192a] flex flex-col px-8 py-6 h-screen">
          <Link to="/" className="text-white text-2xl font-bold mb-8">
            {/* DealFlow */}
            <img src="/logo.jpeg" alt="Logo" />
          </Link>

          {/* Vertical Navbar - Takes up remaining space */}
          <nav className="flex flex-col gap-3 w-full flex-1 overflow-y-auto">
            {/* Top Level Navigation Items */}
            {topLevelNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white ${
                  location.pathname.startsWith(link.to)
                    ? "bg-indigo-600 text-white"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* AI Features Dropdown */}
            {shouldShowAIFeatures && (
              <div className="flex flex-col">
                <button
                  onClick={() => setIsAIFeaturesExpanded(!isAIFeaturesExpanded)}
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isAIFeaturesActive ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  <span>AI Features</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isAIFeaturesExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* AI Features Submenu Items */}
                {isAIFeaturesExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {aiFeatureNavLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`px-3 py-2 rounded text-slate-300 font-medium transition hover:bg-indigo-700 hover:text-white text-sm ${
                          location.pathname.startsWith(link.to)
                            ? "bg-indigo-600 text-white"
                            : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Marketing Hub Dropdown - Now shows for superadmin */}
            {shouldShowMarketingHub && (
              <div className="flex flex-col">
                <button
                  onClick={() =>
                    setIsMarketingHubExpanded(!isMarketingHubExpanded)
                  }
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isMarketingHubActive ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  <span>Marketing Hub</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isMarketingHubExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Marketing Hub Submenu Items */}
                {isMarketingHubExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {marketingHubNavLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`px-3 py-2 rounded text-slate-300 font-medium transition hover:bg-indigo-700 hover:text-white text-sm ${
                          location.pathname.startsWith(link.to)
                            ? "bg-indigo-600 text-white"
                            : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Marketplace Dropdown - Now shows for superadmin */}
            {shouldShowMarketplace && (
              <div className="flex flex-col">
                <button
                  onClick={() =>
                    setIsMarketplaceExpanded(!isMarketplaceExpanded)
                  }
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isMarketplaceActive ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  <span>Marketplace</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isMarketplaceExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Marketplace Submenu Items */}
                {isMarketplaceExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {marketplaceNavLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`px-3 py-2 rounded text-slate-300 font-medium transition hover:bg-indigo-700 hover:text-white text-sm ${
                          location.pathname.startsWith(link.to)
                            ? "bg-indigo-600 text-white"
                            : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Dropdown - Only show if user is not staff */}
            {shouldShowSettings && (
              <div className="flex flex-col">
                <button
                  onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isSettingsActive ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  <span>Settings</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isSettingsExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Settings Submenu Items */}
                {isSettingsExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {settingsNavLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`px-3 py-2 rounded text-slate-300 font-medium transition hover:bg-indigo-700 hover:text-white text-sm ${
                          location.pathname.startsWith(link.to)
                            ? "bg-indigo-600 text-white"
                            : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}

                    {/* SaaS Management Dropdown - For superadmin and admin */}
                    {shouldShowSaaSManagement && (
                      <div className="flex flex-col">
                        <button
                          onClick={() =>
                            setIsSaaSManagementExpanded(
                              !isSaaSManagementExpanded
                            )
                          }
                          className={`px-3 py-2 rounded text-slate-300 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between text-sm ${
                            isSaaSManagementActive
                              ? "bg-indigo-600 text-white"
                              : ""
                          }`}
                        >
                          <span>SaaS Management</span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              isSaaSManagementExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* SaaS Management Submenu Items */}
                        {isSaaSManagementExpanded && (
                          <div className="ml-4 mt-2 flex flex-col gap-2">
                            {filteredSaaSManagementNavLinks.map((link) => (
                              <Link
                                key={link.to}
                                to={link.to}
                                className={`px-3 py-2 rounded text-slate-400 font-medium transition hover:bg-indigo-700 hover:text-white text-xs ${
                                  location.pathname.startsWith(link.to)
                                    ? "bg-indigo-600 text-white"
                                    : ""
                                }`}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* User icon at bottom */}
          <span>
            <button
              onClick={() => navigate("/app/profile")}
              className="rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shadow p-1 hover:scale-105 transition border border-slate-200"
              title="Go to Profile"
              aria-label="Go to Profile"
            >
              <span className="block bg-white rounded-full p-1">
                {/* Elegant User Avatar SVG */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
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
              </span>
            </button>
          </span>
        </aside>

        {/* Main Content */}
        <main className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden">
          {/* Fixed Profile Icon Button */}

          {/* Card-like wrapper for content */}
          <div className="w-full h-full p-6 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
