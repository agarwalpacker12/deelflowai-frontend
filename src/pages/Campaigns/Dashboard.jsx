import { useState, useEffect } from "react";
import CampaignsTable from "./Table";
import AddCampaign from "./add";

const MarketingCampaignModule = () => {
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

  const StatusBadge = ({ status, children }) => {
    const colors = {
      active: "bg-green-500/20 text-green-300 border border-green-500/30",
      paused: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      draft: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
      hot: "bg-red-500/20 text-red-300 border border-red-500/30",
      qualified: "bg-green-500/20 text-green-300 border border-green-500/30",
      nurturing: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          colors[status] || colors.draft
        }`}
      >
        {children}
      </span>
    );
  };

  const MetricBox = ({ label, value, trend, color = "text-white" }) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/70">{label}</div>
          <div className={`text-2xl font-bold ${color}`}>{value}</div>
        </div>
        {trend && <span className="text-sm text-green-300">↑ {trend}</span>}
      </div>
    </div>
  );

  const ProgressBar = ({ percentage, color = "bg-purple-400" }) => (
    <div className="w-full bg-white/20 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  const ChannelCard = ({ icon, name, status }) => (
    <div className="text-center p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
      <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xl">
        {icon}
      </div>
      <div className="text-xs font-semibold text-white">{name}</div>
      <div
        className={`text-sm ${
          status === "Active" ? "text-green-300" : "text-yellow-300"
        }`}
      >
        {status}
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-8">
      {/* Campaign Dashboard Overview */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 -m-8 mb-8 p-8 rounded-t-2xl">
          <h2 className="text-3xl font-bold text-white mb-2">
            Campaign Dashboard
          </h2>
          <p className="text-purple-100">
            Central hub for managing all marketing campaigns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Active Campaigns Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-1">
                Active Campaigns
              </h3>
              <p className="text-sm text-white/70">
                Real-time performance tracking
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/70">Total Active</div>
                  <div className="text-2xl font-bold text-white">8</div>
                </div>
                <StatusBadge status="active">
                  <span className="animate-pulse">LIVE</span>
                </StatusBadge>
              </div>

              <MetricBox label="Leads Today" value="147" trend="23%" />

              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-white/70">Response Rate</div>
                    <div className="text-2xl font-bold text-white">24.7%</div>
                  </div>
                </div>
                <ProgressBar percentage={24.7} />
              </div>
            </div>
          </div>

          {/* Lead Funnel Visualization */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-1">
                Lead Conversion Funnel
              </h3>
              <p className="text-sm text-white/70">
                Track progress through stages
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                  892
                </div>
                <div className="text-xs font-semibold text-white/70">Leads</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                  234
                </div>
                <div className="text-xs font-semibold text-white/70">
                  Qualified
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                  47
                </div>
                <div className="text-xs font-semibold text-white/70">
                  Converted
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Channel Overview */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-1">
                Multi-Channel Outreach
              </h3>
              <p className="text-sm text-white/70">
                Automated communication channels
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <ChannelCard icon="📧" name="Email" status="Active" />
              <ChannelCard icon="💬" name="SMS" status="Active" />
              <ChannelCard icon="📱" name="Voice" status="Active" />
              <ChannelCard icon="💬" name="WhatsApp" status="Setup" />
            </div>
            <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all">
              Configure Channels
            </button>
          </div>
        </div>

        {/* Heat Map Visualization */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-xl">
            <h3 className="text-xl font-semibold text-white mb-1">
              Opportunity Heat Map - Florida Market
            </h3>
            <p className="text-sm text-purple-100">
              Real-time market analysis with AI scoring
            </p>
          </div>
          <div className="p-6">
            <div className="bg-white/5 rounded-xl p-6 h-96 relative overflow-hidden">
              <div className="grid grid-cols-10 grid-rows-8 gap-1 h-full">
                {heatMapData.map((cell) => (
                  <div
                    key={cell.id}
                    className={`${getHeatColor(
                      cell.score
                    )} rounded cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10 hover:shadow-lg ${
                      cell.score >= 80
                        ? "opacity-80"
                        : cell.score >= 50
                        ? "opacity-60"
                        : "opacity-40"
                    }`}
                    title={`${cell.county}: Score ${cell.score}`}
                    onMouseEnter={() => setHeatMapHover(cell)}
                    onMouseLeave={() => setHeatMapHover(null)}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg">
                <div className="font-semibold mb-2 text-white">
                  Opportunity Score
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-white/80">High (80-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-white/80">Medium (50-79)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-white/80">Low (0-49)</span>
                  </div>
                </div>
              </div>

              {heatMapHover && (
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg">
                  <div className="font-semibold text-white">
                    {heatMapHover.county}
                  </div>
                  <div className="text-sm text-white/70">
                    Score: {heatMapHover.score}
                  </div>
                </div>
              )}
            </div>

            {/* Metrics Below Map */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <MetricBox label="Total Properties" value="2,847" />
              <MetricBox label="Distressed" value="423" color="text-red-300" />
              <MetricBox
                label="Competition"
                value="Medium"
                color="text-yellow-300"
              />
              <MetricBox label="Avg ROI" value="287%" color="text-green-300" />
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-xl">
            <h3 className="text-xl font-semibold text-white mb-1">
              Performance Overview
            </h3>
            <p className="text-sm text-purple-100">Last 30 days</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ROI Chart */}
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-white">
                  ROI by Campaign Type
                </h4>
                <div className="space-y-4">
                  {roiData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-white/80">
                          {item.name}
                        </span>
                        <span className="font-semibold text-white">
                          {item.value}%
                        </span>
                      </div>
                      <ProgressBar percentage={item.value / 3} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Performance */}
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-white">
                  Channel Response Rates
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {channelData.map((channel, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-white/10 rounded-lg"
                    >
                      <div className="text-3xl font-bold text-white">
                        {channel.rate}%
                      </div>
                      <div className="text-sm text-white/70">
                        {channel.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="mt-8 bg-white/5 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 text-white">
                Conversion Funnel Analysis
              </h4>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-white">2,847</div>
                  <div className="text-sm text-white/70">Leads Generated</div>
                  <div className="mt-2 h-1 bg-blue-400 rounded"></div>
                </div>
                <div className="text-white/40">→</div>
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-white">1,234</div>
                  <div className="text-sm text-white/70">Contacted</div>
                  <div className="mt-2 h-1 bg-purple-400 rounded"></div>
                </div>
                <div className="text-white/40">→</div>
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-white">423</div>
                  <div className="text-sm text-white/70">Responded</div>
                  <div className="mt-2 h-1 bg-yellow-400 rounded"></div>
                </div>
                <div className="text-white/40">→</div>
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-white">89</div>
                  <div className="text-sm text-white/70">Qualified</div>
                  <div className="mt-2 h-1 bg-green-400 rounded"></div>
                </div>
                <div className="text-white/40">→</div>
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-green-300">23</div>
                  <div className="text-sm text-white/70">Converted</div>
                  <div className="mt-2 h-1 bg-green-400 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  //   const CampaignWizardView = () => (
  //     <div className="max-w-4xl mx-auto">
  //       <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
  //         <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-t-2xl">
  //           <h2 className="text-3xl font-bold text-white mb-2">
  //             Campaign Creation Wizard
  //           </h2>
  //           <p className="text-purple-100">
  //             AI-guided campaign setup with smart defaults
  //           </p>
  //         </div>

  //         <div className="p-8">
  //           <div className="mb-6">
  //             <h3 className="text-xl font-semibold text-white mb-1">
  //               Create New Campaign - Step {campaignStep} of 5
  //             </h3>
  //             <p className="text-white/70">Geographic Targeting</p>
  //           </div>

  //           {/* Progress Steps */}
  //           <div className="flex justify-between mb-8">
  //             {[
  //               { step: 1, label: "Basic Info", completed: true },
  //               { step: 2, label: "Targeting", active: true },
  //               { step: 3, label: "AI Settings", completed: false },
  //               { step: 4, label: "Messaging", completed: false },
  //               { step: 5, label: "Launch", completed: false },
  //             ].map((item, index) => (
  //               <div key={index} className="text-center flex-1">
  //                 <div
  //                   className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-white ${
  //                     item.completed
  //                       ? "bg-green-500"
  //                       : item.active
  //                       ? "bg-gradient-to-r from-purple-500 to-indigo-500"
  //                       : "bg-white/20 text-white/60"
  //                   }`}
  //                 >
  //                   {item.completed ? "✓" : item.step}
  //                 </div>
  //                 <div className="text-xs mt-2 text-white/70">{item.label}</div>
  //               </div>
  //             ))}
  //           </div>

  //           {/* Targeting Options */}
  //           <div className="space-y-6">
  //             <div>
  //               <label className="block font-semibold mb-3 text-white">
  //                 Geographic Scope
  //               </label>
  //               <div className="grid grid-cols-3 gap-3">
  //                 <button className="py-2 px-4 border border-white/30 rounded-lg hover:bg-white/10 text-white transition-all">
  //                   Zip Codes
  //                 </button>
  //                 <button className="py-2 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg">
  //                   Counties
  //                 </button>
  //                 <button className="py-2 px-4 border border-white/30 rounded-lg hover:bg-white/10 text-white transition-all">
  //                   States
  //                 </button>
  //               </div>
  //             </div>

  //             <div>
  //               <label className="block font-semibold mb-3 text-white">
  //                 Selected Counties
  //               </label>
  //               <div className="flex flex-wrap gap-2 mb-3">
  //                 <span className="bg-purple-500/20 text-purple-200 border border-purple-500/30 px-3 py-1 rounded-full text-sm">
  //                   Miami-Dade ×
  //                 </span>
  //                 <span className="bg-purple-500/20 text-purple-200 border border-purple-500/30 px-3 py-1 rounded-full text-sm">
  //                   Broward ×
  //                 </span>
  //                 <span className="bg-purple-500/20 text-purple-200 border border-purple-500/30 px-3 py-1 rounded-full text-sm">
  //                   Palm Beach ×
  //                 </span>
  //                 <button className="bg-white/10 text-white border border-white/30 px-3 py-1 rounded-full text-sm hover:bg-white/20 transition-all">
  //                   + Add More
  //                 </button>
  //               </div>
  //             </div>

  //             <div>
  //               <label className="block font-semibold mb-3 text-white">
  //                 Property Criteria
  //               </label>
  //               <div className="grid grid-cols-2 gap-4">
  //                 <div>
  //                   <label className="block text-sm text-white/70 mb-1">
  //                     Min Price
  //                   </label>
  //                   <input
  //                     type="text"
  //                     placeholder="$50,000"
  //                     className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="block text-sm text-white/70 mb-1">
  //                     Max Price
  //                   </label>
  //                   <input
  //                     type="text"
  //                     placeholder="$500,000"
  //                     className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
  //                   />
  //                 </div>
  //               </div>
  //             </div>

  //             <div>
  //               <label className="block font-semibold mb-3 text-white">
  //                 Distress Indicators
  //               </label>
  //               <div className="grid grid-cols-2 gap-3">
  //                 {["Pre-foreclosure", "Tax Liens", "Divorce", "Vacant"].map(
  //                   (indicator, index) => (
  //                     <label
  //                       key={index}
  //                       className="flex items-center gap-2 cursor-pointer"
  //                     >
  //                       <input
  //                         type="checkbox"
  //                         defaultChecked={[0, 1, 3].includes(index)}
  //                         className="rounded text-purple-500 bg-white/10 border-white/30 focus:ring-purple-500"
  //                       />
  //                       <span className="text-sm text-white">{indicator}</span>
  //                     </label>
  //                   )
  //                 )}
  //               </div>
  //             </div>

  //             <div className="flex gap-4 pt-6">
  //               <button
  //                 className="flex-1 py-3 border border-white/30 rounded-lg hover:bg-white/10 font-semibold text-white transition-all"
  //                 onClick={() => setCampaignStep(Math.max(1, campaignStep - 1))}
  //               >
  //                 Previous
  //               </button>
  //               <button
  //                 className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 font-semibold transition-all"
  //                 onClick={() => setCampaignStep(Math.min(5, campaignStep + 1))}
  //               >
  //                 Next: AI Settings
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );

  //   const LeadManagementView = () => {
  //     const [campaigns, setCampaigns] = useState([]);
  //     const [loading, setLoading] = useState(true);
  //     const [currentPage, setCurrentPage] = useState(1);
  //     const [perPage, setPerPage] = useState(10);
  //     const [totalPages, setTotalPages] = useState(1);
  //     const [total, setTotal] = useState(0);
  //     const [typeFilter, setTypeFilter] = useState("");
  //     const [statusFilter, setStatusFilter] = useState("");
  //     const [channelFilter, setChannelFilter] = useState("");
  //     const [searchTerm, setSearchTerm] = useState("");
  //     const [error, setError] = useState(null);
  //     const [success, setSuccess] = useState(null);

  //     // Mock API call - replace with actual campaignsAPI.getCampaigns when integrating
  //     const fetchCampaigns = async () => {
  //       setLoading(true);
  //       setError(null);

  //       try {
  //         // Simulate API delay
  //         await new Promise((resolve) => setTimeout(resolve, 1000));

  //         // Mock campaign data based on your API structure
  //         const mockCampaigns = [
  //           {
  //             id: 1,
  //             name: "Florida Heat Map Campaign",
  //             target_criteria: {
  //               location: "Miami-Dade, FL",
  //               property_type: "single_family",
  //               equity_min: 50000,
  //             },
  //             campaign_type: "seller_finder",
  //             channel: "email_sms",
  //             status: "active",
  //             budget: 5200,
  //             spent: 3400,
  //             sent_count: 234,
  //             total_recipients: 300,
  //             open_count: 47,
  //             click_count: 23,
  //             conversion_count: 8,
  //             use_ai_personalization: true,
  //             scheduled_at: "2024-01-15T10:00:00Z",
  //             created_at: "2024-01-10T08:30:00Z",
  //           },
  //           {
  //             id: 2,
  //             name: "Social Media Life Events",
  //             target_criteria: {
  //               location: "Tampa, FL",
  //               property_type: "condo",
  //               equity_min: 30000,
  //             },
  //             campaign_type: "buyer_finder",
  //             channel: "sms_voice",
  //             status: "active",
  //             budget: 3800,
  //             spent: 2100,
  //             sent_count: 156,
  //             total_recipients: 200,
  //             open_count: 28,
  //             click_count: 15,
  //             conversion_count: 5,
  //             use_ai_personalization: false,
  //             scheduled_at: "2024-01-20T14:00:00Z",
  //             created_at: "2024-01-18T09:15:00Z",
  //           },
  //           {
  //             id: 3,
  //             name: "Distressed Property Outreach",
  //             target_criteria: {
  //               location: "Orlando, FL",
  //               property_type: "multi_family",
  //               equity_min: 75000,
  //             },
  //             campaign_type: "seller_finder",
  //             channel: "voice_email",
  //             status: "paused",
  //             budget: 2100,
  //             spent: 1200,
  //             sent_count: 89,
  //             total_recipients: 150,
  //             open_count: 12,
  //             click_count: 8,
  //             conversion_count: 2,
  //             use_ai_personalization: true,
  //             scheduled_at: "2024-01-12T11:30:00Z",
  //             created_at: "2024-01-08T16:45:00Z",
  //           },
  //           {
  //             id: 4,
  //             name: "Geofencing Targeting",
  //             target_criteria: {
  //               location: "Jacksonville, FL",
  //               property_type: "townhouse",
  //               equity_min: 40000,
  //             },
  //             campaign_type: "buyer_finder",
  //             channel: "email",
  //             status: "draft",
  //             budget: 1500,
  //             spent: 0,
  //             sent_count: 0,
  //             total_recipients: 0,
  //             open_count: 0,
  //             click_count: 0,
  //             conversion_count: 0,
  //             use_ai_personalization: false,
  //             scheduled_at: "2024-01-25T09:00:00Z",
  //             created_at: "2024-01-22T13:20:00Z",
  //           },
  //         ];

  //         // Apply filters
  //         let filteredCampaigns = mockCampaigns.filter((campaign) => {
  //           const matchesSearch =
  //             !searchTerm ||
  //             campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
  //           const matchesType =
  //             !typeFilter || campaign.campaign_type === typeFilter;
  //           const matchesStatus =
  //             !statusFilter || campaign.status === statusFilter;
  //           const matchesChannel =
  //             !channelFilter || campaign.channel.includes(channelFilter);
  //           return (
  //             matchesSearch && matchesType && matchesStatus && matchesChannel
  //           );
  //         });

  //         setCampaigns(filteredCampaigns);
  //         setTotal(filteredCampaigns.length);
  //         setTotalPages(Math.ceil(filteredCampaigns.length / perPage));
  //       } catch (err) {
  //         console.error("Error fetching campaigns:", err);
  //         setError("Failed to fetch campaigns");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     useEffect(() => {
  //       fetchCampaigns();
  //     }, [
  //       searchTerm,
  //       typeFilter,
  //       statusFilter,
  //       channelFilter,
  //       perPage,
  //       currentPage,
  //     ]);

  //     const resetFilters = () => {
  //       setSearchTerm("");
  //       setTypeFilter("");
  //       setStatusFilter("");
  //       setChannelFilter("");
  //       setCurrentPage(1);
  //     };

  //     const formatCurrency = (amount) => {
  //       return new Intl.NumberFormat("en-US", {
  //         style: "currency",
  //         currency: "USD",
  //         minimumFractionDigits: 0,
  //       }).format(amount);
  //     };

  //     const formatDate = (dateString) => {
  //       return new Date(dateString).toLocaleDateString("en-US", {
  //         month: "short",
  //         day: "numeric",
  //         year: "numeric",
  //       });
  //     };

  //     const getStatusColor = (status) => {
  //       switch (status) {
  //         case "active":
  //           return "bg-green-500/20 text-green-300 border-green-500/30";
  //         case "paused":
  //           return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  //         case "completed":
  //           return "bg-blue-500/20 text-blue-300 border-blue-500/30";
  //         case "draft":
  //           return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  //         default:
  //           return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  //       }
  //     };

  //     const calculateOpenRate = (open_count, sent_count) => {
  //       if (sent_count === 0) return 0;
  //       return ((open_count / sent_count) * 100).toFixed(1);
  //     };

  //     const calculateClickRate = (click_count, sent_count) => {
  //       if (sent_count === 0) return 0;
  //       return ((click_count / sent_count) * 100).toFixed(1);
  //     };

  //     const calculateConversionRate = (conversion_count, sent_count) => {
  //       if (sent_count === 0) return 0;
  //       return ((conversion_count / sent_count) * 100).toFixed(1);
  //     };

  //     const handleDelete = async (id) => {
  //       if (!window.confirm("Are you sure you want to delete this campaign?"))
  //         return;

  //       try {
  //         // Mock delete - replace with actual API call
  //         setCampaigns((prevCampaigns) =>
  //           prevCampaigns.filter((campaign) => campaign.id !== id)
  //         );
  //         setSuccess("Campaign deleted successfully");
  //         setTimeout(() => setSuccess(null), 3000);
  //       } catch (err) {
  //         setError("Failed to delete campaign");
  //       }
  //     };

  //     return (
  //       <div className="space-y-6">
  //         <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
  //           <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-t-2xl">
  //             <h2 className="text-3xl font-bold text-white mb-2">
  //               Marketing Campaigns
  //             </h2>
  //             <p className="text-purple-100">
  //               Manage and monitor all your marketing campaigns
  //             </p>
  //             <div className="mt-3 text-purple-100 text-sm">
  //               Total: {total} campaigns
  //             </div>
  //           </div>

  //           {/* Filters */}
  //           <div className="p-6 border-b border-white/10">
  //             <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
  //               {/* Search */}
  //               <div className="relative">
  //                 <input
  //                   type="text"
  //                   placeholder="Search campaigns..."
  //                   value={searchTerm}
  //                   onChange={(e) => setSearchTerm(e.target.value)}
  //                   className="w-full pl-4 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
  //                 />
  //               </div>

  //               {/* Campaign Type Filter */}
  //               <div>
  //                 <select
  //                   value={typeFilter}
  //                   onChange={(e) => setTypeFilter(e.target.value)}
  //                   className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-purple-800"
  //                 >
  //                   <option value="">All Types</option>
  //                   <option value="seller_finder">Seller Finder</option>
  //                   <option value="buyer_finder">Buyer Finder</option>
  //                 </select>
  //               </div>

  //               {/* Status Filter */}
  //               <div>
  //                 <select
  //                   value={statusFilter}
  //                   onChange={(e) => setStatusFilter(e.target.value)}
  //                   className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-purple-800"
  //                 >
  //                   <option value="">All Status</option>
  //                   <option value="active">Active</option>
  //                   <option value="paused">Paused</option>
  //                   <option value="draft">Draft</option>
  //                   <option value="completed">Completed</option>
  //                 </select>
  //               </div>

  //               {/* Channel Filter */}
  //               <div>
  //                 <select
  //                   value={channelFilter}
  //                   onChange={(e) => setChannelFilter(e.target.value)}
  //                   className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-purple-800"
  //                 >
  //                   <option value="">All Channels</option>
  //                   <option value="email">Email</option>
  //                   <option value="sms">SMS</option>
  //                   <option value="voice">Voice</option>
  //                 </select>
  //               </div>

  //               {/* Per Page */}
  //               <div>
  //                 <select
  //                   value={perPage}
  //                   onChange={(e) => setPerPage(Number(e.target.value))}
  //                   className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-purple-800"
  //                 >
  //                   <option value="10">10 per page</option>
  //                   <option value="25">25 per page</option>
  //                   <option value="50">50 per page</option>
  //                 </select>
  //               </div>

  //               {/* Reset Button */}
  //               <div>
  //                 <button
  //                   onClick={resetFilters}
  //                   className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 hover:text-purple-200 transition-all flex items-center justify-center gap-2"
  //                 >
  //                   Reset
  //                 </button>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Error/Success Messages */}
  //           {error && (
  //             <div className="mx-6 mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
  //               <p className="text-red-300">{error}</p>
  //             </div>
  //           )}
  //           {success && (
  //             <div className="mx-6 mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-4">
  //               <p className="text-green-300">{success}</p>
  //             </div>
  //           )}

  //           {/* Campaign Table */}
  //           <div className="overflow-x-auto">
  //             {loading ? (
  //               <div className="p-8 text-center text-white/70">
  //                 Loading campaigns...
  //               </div>
  //             ) : campaigns.length === 0 ? (
  //               <div className="p-8 text-center text-white/70">
  //                 No campaigns found
  //               </div>
  //             ) : (
  //               <table className="w-full">
  //                 <thead className="bg-white/10 border-b border-white/10">
  //                   <tr>
  //                     <th className="text-left p-4 text-white font-semibold">
  //                       Campaign Info
  //                     </th>
  //                     <th className="text-left p-4 text-white font-semibold">
  //                       Details
  //                     </th>
  //                     <th className="text-left p-4 text-white font-semibold">
  //                       Performance
  //                     </th>
  //                     <th className="text-left p-4 text-white font-semibold">
  //                       Budget & Spend
  //                     </th>
  //                     <th className="text-left p-4 text-white font-semibold">
  //                       Status
  //                     </th>
  //                     <th className="text-left p-4 text-white font-semibold">
  //                       Schedule
  //                     </th>
  //                     <th className="text-left p-4 text-white font-semibold">
  //                       Actions
  //                     </th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {campaigns.map((campaign, index) => (
  //                     <tr
  //                       key={campaign.id}
  //                       className="border-b border-white/10 hover:bg-white/5 transition-all"
  //                       style={{ animationDelay: `${index * 0.1}s` }}
  //                     >
  //                       <td className="p-4">
  //                         <div className="space-y-2">
  //                           <div className="text-white font-medium">
  //                             {campaign.name}
  //                           </div>
  //                           <div className="text-white/70 text-sm">
  //                             {campaign.target_criteria?.location}
  //                           </div>
  //                           <div className="text-xs text-white/50 capitalize">
  //                             {campaign.campaign_type?.replace("_", " ")}
  //                           </div>
  //                         </div>
  //                       </td>

  //                       <td className="p-4">
  //                         <div className="space-y-1">
  //                           <div className="flex items-center gap-2 text-white/70 text-sm">
  //                             📧 {campaign.channel?.replace("_", " ")}
  //                           </div>
  //                           <div className="text-white/60 text-sm capitalize">
  //                             {campaign.target_criteria?.property_type?.replace(
  //                               "_",
  //                               " "
  //                             )}
  //                           </div>
  //                           <div className="text-xs text-white/50">
  //                             Min Equity:{" "}
  //                             {formatCurrency(
  //                               campaign.target_criteria?.equity_min || 0
  //                             )}
  //                           </div>
  //                         </div>
  //                       </td>

  //                       <td className="p-4">
  //                         <div className="space-y-1">
  //                           <div className="flex items-center gap-2">
  //                             <span className="text-sm text-white">
  //                               {campaign.sent_count}/{campaign.total_recipients}
  //                             </span>
  //                           </div>
  //                           <div className="flex items-center gap-2">
  //                             <span className="text-sm text-green-300">
  //                               {calculateOpenRate(
  //                                 campaign.open_count,
  //                                 campaign.sent_count
  //                               )}
  //                               % open
  //                             </span>
  //                           </div>
  //                           <div className="text-xs text-white/60">
  //                             {calculateClickRate(
  //                               campaign.click_count,
  //                               campaign.sent_count
  //                             )}
  //                             % click
  //                           </div>
  //                           <div className="text-xs text-white/60">
  //                             {calculateConversionRate(
  //                               campaign.conversion_count,
  //                               campaign.sent_count
  //                             )}
  //                             % convert
  //                           </div>
  //                         </div>
  //                       </td>

  //                       <td className="p-4">
  //                         <div className="space-y-1">
  //                           <div className="flex items-center gap-2 text-white text-sm">
  //                             💲 {formatCurrency(campaign.budget)}
  //                           </div>
  //                           <div className="text-white/70 text-sm">
  //                             Spent: {formatCurrency(campaign.spent)}
  //                           </div>
  //                           <div className="text-xs text-white/60">
  //                             {((campaign.spent / campaign.budget) * 100).toFixed(
  //                               0
  //                             )}
  //                             % used
  //                           </div>
  //                           <div className="w-full bg-white/20 rounded-full h-1">
  //                             <div
  //                               className="bg-gradient-to-r from-purple-400 to-blue-400 h-1 rounded-full"
  //                               style={{
  //                                 width: `${Math.min(
  //                                   100,
  //                                   (campaign.spent / campaign.budget) * 100
  //                                 )}%`,
  //                               }}
  //                             />
  //                           </div>
  //                         </div>
  //                       </td>

  //                       <td className="p-4">
  //                         <div className="space-y-2">
  //                           <span
  //                             className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(
  //                               campaign.status
  //                             )}`}
  //                           >
  //                             {campaign.status}
  //                           </span>
  //                           {campaign.use_ai_personalization && (
  //                             <div className="flex items-center gap-1">
  //                               <span className="text-xs text-purple-300">
  //                                 ✨ AI Enhanced
  //                               </span>
  //                             </div>
  //                           )}
  //                         </div>
  //                       </td>

  //                       <td className="p-4">
  //                         <div className="space-y-1">
  //                           <div className="flex items-center gap-2 text-white/60 text-xs">
  //                             📅 {formatDate(campaign.scheduled_at)}
  //                           </div>
  //                           <div className="text-xs text-white/50">
  //                             Created: {formatDate(campaign.created_at)}
  //                           </div>
  //                         </div>
  //                       </td>

  //                       <td className="p-4">
  //                         <div className="flex gap-2">
  //                           <button
  //                             className="p-2 text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-all"
  //                             onClick={() => setSelectedLead(campaign)}
  //                           >
  //                             ✏️
  //                           </button>
  //                           <button
  //                             className="p-2 text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
  //                             onClick={() => handleDelete(campaign.id)}
  //                           >
  //                             🗑️
  //                           </button>
  //                         </div>
  //                       </td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             )}
  //           </div>

  //           {/* Pagination */}
  //           {totalPages > 1 && (
  //             <div className="p-6 border-t border-white/10">
  //               <div className="flex items-center justify-between">
  //                 <div className="text-sm text-white/70">
  //                   Showing {(currentPage - 1) * perPage + 1} to{" "}
  //                   {Math.min(currentPage * perPage, total)} of {total} campaigns
  //                 </div>
  //                 <div className="flex items-center gap-2">
  //                   <button
  //                     onClick={() =>
  //                       setCurrentPage((prev) => Math.max(1, prev - 1))
  //                     }
  //                     disabled={currentPage === 1}
  //                     className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  //                   >
  //                     ←
  //                   </button>
  //                   <div className="flex items-center gap-1">
  //                     {[...Array(totalPages)].map((_, i) => (
  //                       <button
  //                         key={i + 1}
  //                         onClick={() => setCurrentPage(i + 1)}
  //                         className={`px-3 py-1 rounded-lg text-sm transition-all ${
  //                           currentPage === i + 1
  //                             ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
  //                             : "text-white/70 hover:text-white hover:bg-white/10"
  //                         }`}
  //                       >
  //                         {i + 1}
  //                       </button>
  //                     ))}
  //                   </div>
  //                   <button
  //                     onClick={() =>
  //                       setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  //                     }
  //                     disabled={currentPage === totalPages}
  //                     className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  //                   >
  //                     →
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     );
  //   };

  const AIMessageView = () => (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Message Preview */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
            <h3 className="text-xl font-semibold text-white mb-1">
              AI-Generated Message
            </h3>
            <p className="text-purple-100">Personalized for John Smith</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="font-semibold mb-2 text-white">
                Email Subject:
              </div>
              <div className="text-white/80">
                Quick question about your Miami property
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="font-semibold mb-2 text-white">Message:</div>
              <div className="text-white/80 leading-relaxed">
                Hi John,
                <br />
                <br />
                I noticed your property at 123 Main St has been listed for a
                while. The Miami market can be challenging right now, and I
                specialize in helping homeowners in similar situations.
                <br />
                <br />
                Would you be open to a brief conversation about your options? I
                have some creative solutions that have helped other Miami
                homeowners move forward quickly.
                <br />
                <br />
                Best regards,
                <br />
                [Your Name]
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded text-xs">
                Empathetic Tone
              </span>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded text-xs">
                Problem-Solution
              </span>
              <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-1 rounded text-xs">
                Call-to-Action
              </span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all">
                Send Now
              </button>
              <button className="bg-white/10 border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
                Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
            <h3 className="text-xl font-semibold text-white mb-1">
              AI Configuration
            </h3>
            <p className="text-purple-100">Fine-tune message generation</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block font-semibold mb-3 text-white">
                Creativity Level
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="7"
                  className="flex-1 accent-purple-500"
                />
                <span className="font-semibold w-8 text-center text-white">
                  7
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Higher values create more varied messages
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-3 text-white">
                Message Tone
              </label>
              <select className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500">
                <option className="bg-purple-800">Professional</option>
                <option className="bg-purple-800">Friendly</option>
                <option className="bg-purple-800">Urgent</option>
                <option className="bg-purple-800">Empathetic</option>
                <option className="bg-purple-800">Direct</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-3 text-white">
                Personalization Factors
              </label>
              <div className="space-y-2">
                {[
                  "Property details",
                  "Market conditions",
                  "Time on market",
                  "Previous interactions",
                ].map((factor, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={index < 3}
                      className="rounded text-purple-500 bg-white/10 border-white/30 focus:ring-purple-500"
                    />
                    <span className="text-sm text-white">{factor}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 font-semibold transition-all">
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
          {activeTab === "dashboard" && <DashboardView />}
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

export default MarketingCampaignModule;
