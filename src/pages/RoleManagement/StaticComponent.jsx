import React from "react";

function StaticComponent() {
  const stats = [
    {
      value: "12",
      label: "Total Tenants",
      color: "text-indigo-400",
    },
    {
      value: "156",
      label: "Total Users",
      color: "text-purple-400",
    },
    {
      value: "3",
      label: "System Roles",
      color: "text-blue-400",
    },
    {
      value: "89%",
      label: "Active Tenants",
      color: "text-green-400",
      isWide: true,
    },
  ];
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Role Management
          </h1>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* System Roles Overview */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            System Roles Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Super Admin Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 relative hover:border-red-500/50 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-t-xl"></div>

            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white text-xl font-bold">Super Admin</h3>
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                System Role
              </span>
            </div>

            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Platform-wide administrator with complete system control. Manages
              all tenants, subscriptions, and platform configuration. No
              operational capabilities.
            </p>

            <div className="space-y-4">
              <h4 className="text-white text-sm font-semibold mb-3">
                Administrative Powers
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  Tenant Management
                </span>
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  Subscription Control
                </span>
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  Platform Analytics
                </span>
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  System Configuration
                </span>
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  Role Management
                </span>
              </div>
            </div>
          </div>

          {/* Organization Admin Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 relative hover:border-purple-500/50 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl"></div>

            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white text-xl font-bold">
                Organization Admin
              </h3>
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                Organization Admin
              </span>
            </div>

            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Organization administrator with full control over their tenant.
              Manages users, settings, and has complete operational capabilities
              within their organization.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">
                  Administrative
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                    User Management
                  </span>
                  <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                    Organization Settings
                  </span>
                  <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                    Billing Management
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-white text-sm font-semibold mb-3">
                  Operational
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                    All Features
                  </span>
                  <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                    Campaigns
                  </span>
                  <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                    Properties
                  </span>
                  <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                    Marketplace
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Member Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 relative hover:border-blue-500/50 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>

            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white text-xl font-bold">
                Organization Member
              </h3>
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                Staff Member
              </span>
            </div>

            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Organization staff member with operational access. Can perform all
              business operations but has no administrative capabilities.
            </p>

            <div className="space-y-4">
              <h4 className="text-white text-sm font-semibold mb-3">
                Operational Access
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  Marketing Campaigns
                </span>
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  Lead Management
                </span>
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  Property Listings
                </span>
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  Marketplace Trading
                </span>
                <span className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  Analytics (Own Data)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StaticComponent;
