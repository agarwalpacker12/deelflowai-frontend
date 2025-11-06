import React, { useState, useMemo } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBar from "../UI/NotificationBar";
import { useFilteredNavigation } from "../../../navigationConfig";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isMarketplaceExpanded, setIsMarketplaceExpanded] = useState(false);
  const [isMarketingHubExpanded, setIsMarketingHubExpanded] = useState(false);
  const [isSaaSManagementExpanded, setIsSaaSManagementExpanded] =
    useState(false);
  const [isAIFeaturesExpanded, setIsAIFeaturesExpanded] = useState(false);
  const [isAnalyticsReportsExpanded, setIsAnalyticsReportsExpanded] =
    useState(false);
  const [isSystemSettingsExpanded, setIsSystemSettingsExpanded] =
    useState(false);
  const [isAiManagementExpanded, setIsAiManagementExpanded] = useState(false);
  const [isIntegrationsExpanded, setIsIntegrationsExpanded] = useState(false);
  const [isWhiteLabelExpanded, setIsWhiteLabelExpanded] = useState(false);
  const [isLandingPageBuilderExpanded, setIsLandingPageBuilderExpanded] =
    useState(false);

  const userDetails = JSON.parse(localStorage.getItem("user") || "{}");
  const userPermissions = userDetails.permissions || [];
  const hasNoPermissions = !userPermissions || userPermissions.length === 0;

  // Get filtered navigation links based on user permissions
  const {
    topLevelNavLinks,
    propertyNavLinks,
    marketplaceNavLinks,
    marketingHubNavLinks,
    aiFeatureNavLinks,
    analyticsReportsNavLinks,
    systemSettingsNavLinks,
    aiManagementNavLinks,
    integrationNavLinks,
    baseSettingsNavLinks,
    super_adminSettingsNavLinks,
    saasManagementNavLinks,
    whiteLabelNavLinks,
    landingPageBuilderNavLinks,
  } = useFilteredNavigation(userPermissions);

  // Default fallback links when user has no permissions
  const defaultNavLinks = useMemo(() => ({
    propertyList: [{ to: "/app/properties", label: "Property List" }],
    deals: [{ to: "/app/deals", label: "Deals" }],
    leads: [{ to: "/app/leads", label: "Leads" }],
  }), []);

  // Combine settings links
  const settingsNavLinks = useMemo(
    () => [...baseSettingsNavLinks, ...super_adminSettingsNavLinks],
    [baseSettingsNavLinks, super_adminSettingsNavLinks]
  );

  // Check if sections should be shown based on filtered results
  // If no permissions, show only default pages
  const shouldShowSettings = !hasNoPermissions && settingsNavLinks.length > 0;
  const shouldShowSaaSManagement = !hasNoPermissions && saasManagementNavLinks.length > 0;
  const shouldShowPropertyList = hasNoPermissions || propertyNavLinks.length > 0;
  const shouldShowMarketplace = !hasNoPermissions && marketplaceNavLinks.length > 0;
  const shouldShowMarketingHub = !hasNoPermissions && marketingHubNavLinks.length > 0;
  const shouldShowAIFeatures = !hasNoPermissions && aiFeatureNavLinks.length > 0;
  const shouldShowAnalyticsReports = !hasNoPermissions && analyticsReportsNavLinks.length > 0;
  const shouldShowSystemSettings = !hasNoPermissions && systemSettingsNavLinks.length > 0;
  const shouldShowAiManagement = !hasNoPermissions && aiManagementNavLinks.length > 0;
  const shouldShowIntegrations = !hasNoPermissions && integrationNavLinks.length > 0;
  const shouldShowWhiteLabel = !hasNoPermissions && whiteLabelNavLinks.length > 0;
  const shouldShowLandingPageBuilder = !hasNoPermissions && landingPageBuilderNavLinks.length > 0;
  const shouldShowDeals = hasNoPermissions;
  const shouldShowLeads = hasNoPermissions;

  // Check if any submenu items are currently active
  const isSettingsActive = settingsNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  const isSaaSManagementActive =
    shouldShowSaaSManagement &&
    saasManagementNavLinks.some((link) =>
      location.pathname.startsWith(link.to)
    );

  const isPropertyListActive = propertyNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  const isMarketplaceActive = marketplaceNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  const isMarketingHubActive = marketingHubNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  const isAIFeaturesActive = aiFeatureNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  const isAnalyticsReportsActive = analyticsReportsNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  const isSystemSettingsActive = systemSettingsNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  const isAiManagementActive = aiManagementNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  const isIntegrationsActive = integrationNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );
  const isWhiteLabelActive = whiteLabelNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );
  const isLandingPageBuilderActive = landingPageBuilderNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );
  return (
    <>
      <NotificationBar />
      <div className="h-screen grid grid-cols-[280px_1fr] bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Sidebar */}
        <aside className="bg-[#18192a] flex flex-col px-8 py-6 h-screen">
          <Link to="/" className="text-white text-2xl font-bold mb-8">
            <img src="/logo.jpeg" alt="Logo" />
          </Link>

          {/* Vertical Navbar */}
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

            {/* SaaS Management Dropdown */}
            {shouldShowSaaSManagement && (
              <div className="flex flex-col">
                <button
                  onClick={() =>
                    setIsSaaSManagementExpanded(!isSaaSManagementExpanded)
                  }
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isSaaSManagementActive ? "bg-indigo-600 text-white" : ""
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

                {isSaaSManagementExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {saasManagementNavLinks.map((link) => (
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

            {/* Property List */}
            {shouldShowPropertyList && (
              <Link
                to="/app/properties"
                className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white ${
                  location.pathname.startsWith("/app/properties") ? "bg-indigo-600 text-white" : ""
                }`}
              >
                Property List
              </Link>
            )}

            {/* Deals - shown when no permissions */}
            {shouldShowDeals && (
              <Link
                to="/app/deals"
                className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white ${
                  location.pathname.startsWith("/app/deals") ? "bg-indigo-600 text-white" : ""
                }`}
              >
                Deals
              </Link>
            )}

            {/* Leads - shown when no permissions */}
            {shouldShowLeads && (
              <Link
                to="/app/leads"
                className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white ${
                  location.pathname.startsWith("/app/leads") ? "bg-indigo-600 text-white" : ""
                }`}
              >
                Leads
              </Link>
            )}

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

            {/* Marketing Hub Dropdown */}
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

            {/* Marketplace Dropdown */}
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

            {/* Analytics & Reports Dropdown */}
            {shouldShowAnalyticsReports && (
              <div className="flex flex-col">
                <button
                  onClick={() =>
                    setIsAnalyticsReportsExpanded(!isAnalyticsReportsExpanded)
                  }
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isAnalyticsReportsActive ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  <span>Analytics & Reports</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isAnalyticsReportsExpanded ? "rotate-180" : ""
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

                {isAnalyticsReportsExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {analyticsReportsNavLinks.map((link) => (
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

            {/* AI Management Dropdown */}
            {shouldShowAiManagement && (
              <div className="flex flex-col">
                <button
                  onClick={() =>
                    setIsAiManagementExpanded(!isAiManagementExpanded)
                  }
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isAiManagementActive ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  <span>AI Management</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isAiManagementExpanded ? "rotate-180" : ""
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

                {isAiManagementExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {aiManagementNavLinks.map((link) => (
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

            {/* System Settings Dropdown */}
            {shouldShowSystemSettings && (
              <div className="flex flex-col">
                <button
                  onClick={() =>
                    setIsSystemSettingsExpanded(!isSystemSettingsExpanded)
                  }
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isSystemSettingsActive ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  <span>System Settings</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isSystemSettingsExpanded ? "rotate-180" : ""
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

                {isSystemSettingsExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {systemSettingsNavLinks.map((link) => (
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

            {/* Integrations Dropdown */}
            {shouldShowIntegrations && (
              <div className="flex flex-col">
                <button
                  onClick={() =>
                    setIsIntegrationsExpanded(!isIntegrationsExpanded)
                  }
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isIntegrationsActive ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  <span>Integrations</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isIntegrationsExpanded ? "rotate-180" : ""
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

                {isIntegrationsExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {integrationNavLinks.map((link) => (
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

            {/* White Label Dropdown */}
            {shouldShowWhiteLabel && (
              <div className="flex flex-col">
                <button
                  onClick={() => setIsWhiteLabelExpanded(!isWhiteLabelExpanded)}
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isWhiteLabelActive ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  <span>White Label</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isWhiteLabelExpanded ? "rotate-180" : ""
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

                {isWhiteLabelExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {whiteLabelNavLinks.map((link) => (
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
            {/* </div>
            )} */}
            {/* Landing Page Builder Dropdown */}
            {shouldShowLandingPageBuilder && (
              <div className="flex flex-col">
                <button
                  onClick={() =>
                    setIsLandingPageBuilderExpanded(
                      !isLandingPageBuilderExpanded
                    )
                  }
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white flex items-center justify-between ${
                    isLandingPageBuilderActive ? "bg-indigo-600 text-white" : ""
                  }`}
                >
                  <span>Landing Page Builder</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isLandingPageBuilderExpanded ? "rotate-180" : ""
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

                {isLandingPageBuilderExpanded && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {landingPageBuilderNavLinks.map((link) => (
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

            {/* Settings Dropdown */}
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
          <div className="w-full h-full p-6 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
