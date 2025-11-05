import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBar from "../UI/NotificationBar";

// 🧭 All link groups (same as before)
const topLevelNavLinks = [
  { to: "/app/dashboard", label: "Dashboard", permission: "view_dashboard" },
  { to: "/app/analytics", label: "Analytics", permission: "view_analytics" },
  { to: "/app/psychology", label: "Psychological Dashboard" },
];

const propertyNavLinks = [
  {
    to: "/app/properties",
    label: "Property List",
    permission: "view_properties",
  },
];

const marketplaceNavLinks = [
  { to: "/app/live-activity", label: "Live Feed", permission: "view_deals" },
  { to: "/app/deals", label: "Deals", permission: "view_deals" },
  { to: "/app/transaction", label: "Transaction" },
  { to: "/app/Funding Partners", label: "Funding Partners" },
  { to: "/app/pricing", label: "Pricing" },
];

const marketingHubNavLinks = [
  { to: "/app/campaigns", label: "Campaigns", permission: "view_campaigns" },
  { to: "/app/content-management", label: "Content Management" },
  { to: "/app/leads", label: "Leads", permission: "view_leads" },
  { to: "/app/clients", label: "Clients" },
];

const aiFeatureNavLinks = [
  { to: "/app/ai/vision", label: "Vision AI", permission: "use_vision_ai" },
  { to: "/app/ai/voice", label: "Voice AI", permission: "use_voice_ai" },
  {
    to: "/app/ai/nlp-center",
    label: "NLP Center",
    permission: "use_ai_services",
  },
];

const analyticsReportsNavLinks = [
  {
    to: "/app/reports/overview",
    label: "Overview",
    permission: "view_analytics",
  },
  {
    to: "/app/reports/custom",
    label: "Custom Reports",
    permission: "view_analytics",
  },
];

const systemSettingsNavLinks = [
  {
    to: "/app/system/general",
    label: "General",
    permission: "manage_organization",
  },
  { to: "/app/system/security", label: "Security" },
  { to: "/app/system/notification", label: "Notification" },
];

const integrationNavLinks = [
  { to: "/app/integrations/api", label: "API Keys" },
  { to: "/app/payment-gateway", label: "Payment Methods" },
  { to: "/app/integrations/webhooks", label: "Webhooks" },
];

// 🔥 Helper: Check if user has a given permission
const hasPermission = (permissions, perm) =>
  !perm || permissions.includes(perm);

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState({
    marketplace: false,
    marketingHub: false,
    aiFeatures: false,
    analytics: false,
    settings: false,
    integrations: false,
  });

  // 🧩 Load user & permissions
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const permissions = user.permissions || [];

  const toggleExpand = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const isActive = (links) =>
    links.some((link) => location.pathname.startsWith(link.to));

  return (
    <>
      <NotificationBar />
      <div className="h-screen grid grid-cols-[280px_1fr] bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Sidebar */}
        <aside className="bg-[#18192a] flex flex-col px-8 py-6 h-screen">
          <Link to="/" className="text-white text-2xl font-bold mb-8">
            <img src="/logo.jpeg" alt="Logo" />
          </Link>

          <nav className="flex flex-col gap-3 w-full flex-1 overflow-y-auto">
            {/* 🧭 Top Level */}
            {topLevelNavLinks
              .filter((link) => hasPermission(permissions, link.permission))
              .map((link) => (
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

            {/* 🏠 Properties */}
            {hasPermission(permissions, "view_properties") && (
              <Link
                to="/app/properties"
                className={`px-3 py-2 rounded text-slate-200 font-medium transition hover:bg-indigo-700 hover:text-white ${
                  location.pathname.startsWith("/app/properties")
                    ? "bg-indigo-600 text-white"
                    : ""
                }`}
              >
                Property List
              </Link>
            )}

            {/* 🏪 Marketplace */}
            {marketplaceNavLinks.some((l) =>
              hasPermission(permissions, l.permission)
            ) && (
              <div className="flex flex-col">
                <button
                  onClick={() => toggleExpand("marketplace")}
                  className={`px-3 py-2 rounded text-slate-200 font-medium transition flex justify-between hover:bg-indigo-700 hover:text-white ${
                    isActive(marketplaceNavLinks)
                      ? "bg-indigo-600 text-white"
                      : ""
                  }`}
                >
                  <span>Marketplace</span>
                  <span
                    className={`transform transition ${
                      expanded.marketplace ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {expanded.marketplace && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {marketplaceNavLinks
                      .filter((link) =>
                        hasPermission(permissions, link.permission)
                      )
                      .map((link) => (
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

            {/* 🧠 AI Features */}
            {aiFeatureNavLinks.some((l) =>
              hasPermission(permissions, l.permission)
            ) && (
              <div className="flex flex-col">
                <button
                  onClick={() => toggleExpand("aiFeatures")}
                  className={`px-3 py-2 rounded text-slate-200 font-medium flex justify-between hover:bg-indigo-700 hover:text-white ${
                    isActive(aiFeatureNavLinks)
                      ? "bg-indigo-600 text-white"
                      : ""
                  }`}
                >
                  <span>AI Features</span>
                  <span
                    className={`transform transition ${
                      expanded.aiFeatures ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {expanded.aiFeatures && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {aiFeatureNavLinks
                      .filter((link) =>
                        hasPermission(permissions, link.permission)
                      )
                      .map((link) => (
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

            {/* 📊 Analytics */}
            {analyticsReportsNavLinks.some((l) =>
              hasPermission(permissions, l.permission)
            ) && (
              <div className="flex flex-col">
                <button
                  onClick={() => toggleExpand("analytics")}
                  className={`px-3 py-2 rounded text-slate-200 font-medium flex justify-between hover:bg-indigo-700 hover:text-white ${
                    isActive(analyticsReportsNavLinks)
                      ? "bg-indigo-600 text-white"
                      : ""
                  }`}
                >
                  <span>Analytics & Reports</span>
                  <span
                    className={`transform transition ${
                      expanded.analytics ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {expanded.analytics && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {analyticsReportsNavLinks
                      .filter((link) =>
                        hasPermission(permissions, link.permission)
                      )
                      .map((link) => (
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

          {/* 👤 Profile Button */}
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
                    stroke="#6366f1"
                    strokeWidth="2"
                    fill="white"
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

        {/* 📄 Main */}
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
