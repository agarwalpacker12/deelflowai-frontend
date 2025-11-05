import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBar from "../UI/NotificationBar";

const topLevelNavLinks = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/analytics", label: "Analytics" },
  { to: "/app/psychology", label: "Psychological Dashboard" },
];

// Property List as independent menu
const propertyNavLinks = [{ to: "/app/properties", label: "Property List" }];

const marketplaceNavLinks = [
  { to: "/app/live-activity", label: "Live Feed" },
  { to: "/app/deals", label: "Deals" },
  { to: "/app/transaction", label: "transaction" },
  { to: "/app/Funding Partners", label: "funding" },
  { to: "/app/pricing", label: "pricing" },
];

const marketingHubNavLinks = [
  { to: "/app/campaigns", label: "Campaigns" },
  { to: "/app/content-management", label: "Content Management" },
  { to: "/app/duplicate", label: "Duplicate Management" },
  { to: "/app/leads", label: "Leads" },
  { to: "/app/clients", label: "Clients" },
  { to: "/app/marketing/advanced", label: "Advanced" },
  { to: "/app/marketing/contacts", label: "Contacts" },
  { to: "/app/marketing/communications", label: "Communications" },
];

// AI Features navigation links
const aiFeatureNavLinks = [
  { to: "/app/ai/vision", label: "Vision AI" },
  { to: "/app/ai/voice", label: "Voice AI" },
  { to: "/app/ai/nlp-center", label: "NLP Center" },
];

// Analytics & Reports navigation links
const analyticsReportsNavLinks = [
  { to: "/app/reports/overview", label: "Overview" },
  { to: "/app/reports/custom", label: "Custom Reports" },
  { to: "/app/reports/data-export", label: "Data Exports" },
];

// System Settings navigation links
const systemSettingsNavLinks = [
  { to: "/app/system/general", label: "General" },
  { to: "/app/system/security", label: "Security" },
  { to: "/app/system/notification", label: "Notification" },
  { to: "/app/system/backup", label: "Backup" },
];

// AI management navigation links
const aiManagementNavLinks = [
  { to: "/app/ai-management/conversation", label: "AI Conversation" },
  { to: "/app/ai-management/training", label: "Training" },
  { to: "/app/ai-management/automation-rule", label: "Automation Rules" },
];

// Integration navigation links
const integrationNavLinks = [
  { to: "/app/integrations/api", label: "API Keys" },
  { to: "/app/payment-gateway", label: "Payment Methods" },
  { to: "/app/integrations/webhooks", label: "Webhooks" },
  { to: "/app/integrations/third-party", label: "Third Party Apps" },
];

// Base settings for all roles (except staff)
const baseSettingsNavLinks = [
  { to: "/app/settings", label: "Organization Settings" },
  { to: "/app/user-management", label: "User Management" },
  { to: "/app/billing", label: "Billing & Subscription" },
  { to: "/app/page-management", label: "Page Management" },
];

// Super admin only settings
const super_adminSettingsNavLinks = [
  { to: "/app/ai-settings", label: "AI Settings" },
];

const saasManagementNavLinks = [
  { to: "/app/role-management", label: "Role Management" },

  { to: "/app/pricing", label: "Pricing Plans" },
  { to: "/app/billing", label: "Billing Settings" },
  { to: "/app/revenue", label: "Revenue Analytics" },
  { to: "/app/subscription", label: "Subscription" },
];

const whiteLabelNavLinks = [
  { to: "/app/tenant-management", label: "Tenant Management" },
  { to: "/app/white-label/branding-settings", label: "Branding Settings" },
  { to: "/app/white-label/domain-management", label: "Domain Management" },
];

const landingPageBuilderNavLinks = [
  { to: "/app/landing-page-builder/templates", label: "Templates" },
  { to: "/app/landing-page-builder/page-builder", label: "Page Builder" },
  { to: "/app/landing-page-builder/ab-testing", label: "A/B Testing" },
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
  const userRole = userDetails.role || "staff";

  // Generate settings links based on role
  const getSettingsNavLinks = () => {
    if (userRole === "super_admin") {
      return [...baseSettingsNavLinks, ...super_adminSettingsNavLinks];
    } else if (userRole === "admin") {
      return [...baseSettingsNavLinks];
    }
    return [];
  };

  // Generate SaaS Management links based on role
  const getSaaSManagementNavLinks = () => {
    if (userRole === "super_admin") {
      return saasManagementNavLinks;
    } else if (userRole === "admin") {
      return saasManagementNavLinks.filter(
        (link) => link.to !== "/app/tenant-management"
      );
    }
    return [];
  };

  const settingsNavLinks = getSettingsNavLinks();
  const filteredSaaSManagementNavLinks = getSaaSManagementNavLinks();

  // Check if sections should be shown based on role
  const shouldShowSettings = userRole !== "staff";
  const shouldShowSaaSManagement =
    userRole === "super_admin" || userRole === "admin";
  const shouldShowPropertyList = userRole !== "staff";
  const shouldShowMarketplace = userRole !== "staff";
  const shouldShowMarketingHub = userRole !== "staff";
  const shouldShowAIFeatures = true;
  const shouldShowAnalyticsReports = userRole !== "staff";
  const shouldShowSystemSettings =
    userRole === "admin" || userRole === "super_admin";
  const shouldShowAiManagement =
    userRole === "admin" || userRole === "super_admin";
  const shouldShowIntegrations =
    userRole === "admin" || userRole === "super_admin";

  const shouldShowWhiteLabel =
    userRole === "admin" || userRole === "super_admin";

  const shouldShowLandingPageBuilder =
    userRole === "admin" || userRole === "super_admin";

  // Check if any submenu items are currently active
  const isSettingsActive = settingsNavLinks.some((link) =>
    location.pathname.startsWith(link.to)
  );

  const isSaaSManagementActive =
    shouldShowSaaSManagement &&
    filteredSaaSManagementNavLinks.some((link) =>
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
                    {filteredSaaSManagementNavLinks.map((link) => (
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
                  isPropertyListActive ? "bg-indigo-600 text-white" : ""
                }`}
              >
                Property List
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
