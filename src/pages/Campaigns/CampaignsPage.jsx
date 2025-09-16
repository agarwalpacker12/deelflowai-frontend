import { useState, useEffect } from "react";
import CampaignsTable from "./Table";
import AddCampaign from "./add";
import DashboardView from "./Dashboard";
import StatusBadge from "./StatusBadge";
import AIMessageView from "./AIMessageView";

const CampaignPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [campaignStep, setCampaignStep] = useState(2);
  const [heatMapHover, setHeatMapHover] = useState(null);

  // Sample data for charts
  const roiData = [
    { name: "Heat Mapping", value: 287, color: "#10b981" },
    { name: "Social Media", value: 234, color: "#3b82f6" },
    { name: "Web Scraping", value: 198, color: "#3b82f6" },
    { name: "Geofencing", value: 156, color: "#f59e0b" },
  ];

  const channelData = [
    { name: "Voice Calls", rate: 19, color: "#10b981" },
    { name: "SMS", rate: 12, color: "#3b82f6" },
    { name: "Email", rate: 8, color: "#f59e0b" },
    { name: "WhatsApp", rate: 15, color: "#8b5cf6" },
  ];

  // Heat map data
  const generateHeatMapData = () => {
    const data = [];
    const scores = [
      92, 88, 73, 45, 67, 81, 34, 56, 89, 72, 78, 85, 42, 69, 91, 76, 38, 83,
      65, 41,
    ];
    for (let i = 0; i < 80; i++) {
      const score =
        scores[i % scores.length] + Math.floor(Math.random() * 20 - 10);
      data.push({
        id: i,
        score: Math.max(0, Math.min(100, score)),
        county: `County ${i + 1}`,
      });
    }
    return data;
  };

  const heatMapData = generateHeatMapData();

  const getHeatColor = (score) => {
    if (score >= 80) return "bg-red-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Navigation */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl mb-8 p-1">
          <nav className="flex space-x-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "wizard", label: "Campaign Wizard", icon: "🎯" },
              { id: "leads", label: "Lead Management", icon: "👥" },
              { id: "ai", label: "AI Messages", icon: "🤖" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Marketing Campaign Module
          </h1>
          <p className="text-xl text-purple-100">
            Comprehensive campaign management with AI-powered insights
          </p>
        </div>

        {/* Content */}
        <div className="transition-all duration-500">
          {activeTab === "dashboard" && (
            <DashboardView
              heatMapData={heatMapData}
              getHeatColor={getHeatColor}
              heatMapHover={heatMapHover}
              roiData={roiData}
              channelData={channelData}
              setHeatMapHover={setHeatMapHover}
            />
          )}
          {activeTab === "wizard" && <AddCampaign />}
          {activeTab === "leads" && <CampaignsTable />}
          {activeTab === "ai" && <AIMessageView />}
        </div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedLead.name}
                    </h3>
                    <p className="text-purple-100">{selectedLead.property}</p>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="text-2xl text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-all"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm text-white/70 mb-1">AI Score</div>
                    <div className="text-3xl font-bold text-white">
                      {selectedLead.score}/100
                    </div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-sm text-white/70 mb-1">Status</div>
                    <StatusBadge status={selectedLead.status}>
                      {selectedLead.status.toUpperCase()}
                    </StatusBadge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-white">
                      Campaign Details
                    </h4>
                    <p className="text-white/80">{selectedLead.campaign}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-white">
                      Contact History
                    </h4>
                    <p className="text-sm text-white/70">
                      Last contacted via {selectedLead.channel} •{" "}
                      {selectedLead.lastContact}
                      <br />
                      Total responses: {selectedLead.responses}
                    </p>
                  </div>

                  <div className="bg-purple-500/20 border border-purple-500/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-200 mb-2">
                      AI Insights
                    </h4>
                    <p className="text-sm text-purple-100">
                      This lead shows high engagement potential based on
                      response patterns and market analysis. Recommended next
                      steps: Personal outreach via phone call within next 24
                      hours.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all">
                    📞 Call Now
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all">
                    💬 Send Message
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-gray-500 to-slate-500 text-white py-3 rounded-lg hover:from-gray-600 hover:to-slate-600 transition-all">
                    📧 Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignPage;
