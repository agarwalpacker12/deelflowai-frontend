import React, { useState, useEffect } from "react";

// Icon components as SVGs
const Phone = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const PhoneCall = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const Mic = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
  </svg>
);

const Play = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const Settings = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const Users = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const Calendar = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TrendingUp = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const BarChart3 = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const Activity = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);

const MessageCircle = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const CheckCircle2 = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RefreshCw = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);

const Target = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ThumbsUp = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
    />
  </svg>
);

const ThumbsDown = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"
    />
  </svg>
);

const Star = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const Zap = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  </svg>
);

const VoiceAIPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeCalls, setActiveCalls] = useState(12);
  const [currentCall, setCurrentCall] = useState(null);

  // Sample campaigns data
  const campaigns = [
    {
      id: 1,
      name: "Seller Outreach - Dallas",
      status: "active",
      totalCalls: 247,
      connected: 89,
      appointments: 23,
      conversionRate: 25.8,
      avgCallDuration: "3:42",
      dailyLimit: 100,
      voiceType: "Professional Female",
      script:
        "Hi {name}, I'm calling about potential real estate opportunities in your area...",
      leads: 156,
      lastActive: "2 minutes ago",
    },
    {
      id: 2,
      name: "Follow-up Campaign - Austin",
      status: "paused",
      totalCalls: 156,
      connected: 67,
      appointments: 18,
      conversionRate: 26.9,
      avgCallDuration: "4:15",
      dailyLimit: 75,
      voiceType: "Friendly Male",
      script:
        "Hello {name}, I wanted to follow up on our previous conversation...",
      leads: 89,
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      name: "Buyer Interest - Houston",
      status: "scheduled",
      totalCalls: 0,
      connected: 0,
      appointments: 0,
      conversionRate: 0,
      avgCallDuration: "0:00",
      dailyLimit: 50,
      voiceType: "Professional Male",
      script:
        "Good morning {name}, I have some exciting investment opportunities...",
      leads: 234,
      lastActive: "Scheduled for 9:00 AM",
    },
  ];

  // Recent calls data
  const recentCalls = [
    {
      id: 1,
      leadName: "Sarah Martinez",
      phone: "(555) 123-4567",
      status: "completed",
      duration: "4:23",
      outcome: "appointment_scheduled",
      sentiment: "positive",
      timestamp: "2024-01-15T10:30:00Z",
      campaign: "Seller Outreach - Dallas",
      notes: "Interested in selling duplex, scheduled for Friday 2PM",
      callScore: 92,
    },
    {
      id: 2,
      leadName: "Michael Chen",
      phone: "(555) 987-6543",
      status: "completed",
      duration: "2:15",
      outcome: "not_interested",
      sentiment: "neutral",
      timestamp: "2024-01-15T09:45:00Z",
      campaign: "Follow-up Campaign",
      notes: "Not interested at this time, marked for future follow-up",
      callScore: 67,
    },
    {
      id: 3,
      leadName: "Jennifer Wilson",
      phone: "(555) 456-7890",
      status: "in_progress",
      duration: "1:32",
      outcome: "ongoing",
      sentiment: "positive",
      timestamp: "2024-01-15T11:15:00Z",
      campaign: "Seller Outreach - Dallas",
      notes: "Currently discussing property details",
      callScore: 85,
    },
  ];

  // Live activity simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalls((prev) =>
        Math.max(8, prev + Math.floor(Math.random() * 3) - 1)
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-900/20 text-emerald-400";
      case "paused":
        return "bg-amber-900/20 text-amber-400";
      case "scheduled":
        return "bg-blue-900/20 text-blue-400";
      case "completed":
        return "bg-gray-800/20 text-gray-400";
      default:
        return "bg-gray-800/20 text-gray-400";
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case "appointment_scheduled":
        return "bg-emerald-900/20 text-emerald-400";
      case "callback_requested":
        return "bg-blue-900/20 text-blue-400";
      case "not_interested":
        return "bg-red-900/20 text-red-400";
      case "ongoing":
        return "bg-purple-900/20 text-purple-400";
      default:
        return "bg-gray-800/20 text-gray-400";
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="w-4 h-4 text-emerald-400" />;
      case "negative":
        return <ThumbsDown className="w-4 h-4 text-red-400" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "campaigns", label: "Campaigns", icon: Target },
    { id: "calls", label: "Call History", icon: Phone },
    { id: "live", label: "Live Monitoring", icon: Activity },
    { id: "settings", label: "Voice Settings", icon: Settings },
  ];

  const handleStartCampaign = (campaignId) => {
    console.log("Starting campaign:", campaignId);
  };

  const handleTestCall = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="px-6 py-6 border-b border-purple-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Voice AI Assistant
              </h1>
              <p className="text-purple-200 mt-1">
                AI-powered voice calls for lead qualification & appointment
                setting
              </p>
            </div>
          </div>

          {/* Live Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 flex items-center gap-2 justify-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                {activeCalls}
              </div>
              <div className="text-sm text-purple-400">Active Calls</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">73%</div>
              <div className="text-sm text-purple-400">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300">3:58</div>
              <div className="text-sm text-purple-400">Avg Duration</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-2 py-4 border-b-2 font-medium transition-all ${
                    activeTab === tab.id
                      ? "border-purple-400 text-purple-300"
                      : "border-transparent text-purple-500 hover:text-purple-300 hover:border-purple-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-400">
                      Total Calls Today
                    </p>
                    <p className="text-3xl font-bold text-white">142</p>
                    <p className="text-sm text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +23% vs yesterday
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <PhoneCall className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-400">
                      Appointments Set
                    </p>
                    <p className="text-3xl font-bold text-white">41</p>
                    <p className="text-sm text-emerald-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      28.9% conversion
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-400">
                      Connection Rate
                    </p>
                    <p className="text-3xl font-bold text-white">67%</p>
                    <p className="text-sm text-blue-400 flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      Above industry avg
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-400">
                      AI Accuracy
                    </p>
                    <p className="text-3xl font-bold text-white">94%</p>
                    <p className="text-sm text-orange-400 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Excellent rating
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-lg">
                    Start New Campaign
                  </h3>
                </div>
                <p className="text-purple-300 mb-6">
                  Launch AI-powered calling campaign for lead generation
                </p>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 flex items-center justify-center gap-2 shadow-lg transition-all">
                  <Play className="w-5 h-5" />
                  Start Campaign
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-lg">
                    Test Voice AI
                  </h3>
                </div>
                <p className="text-purple-300 mb-6">
                  Test and customize your AI voice assistant responses
                </p>
                <button
                  onClick={handleTestCall}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  {isRecording ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                  {isRecording ? "Testing..." : "Test Voice"}
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-lg">
                    Live Monitoring
                  </h3>
                </div>
                <p className="text-purple-300 mb-6">
                  Monitor active calls and AI performance in real-time
                </p>
                <button
                  onClick={() => setActiveTab("live")}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Activity className="w-5 h-5" />
                  Monitor Live
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 shadow-xl">
              <div className="p-6 border-b border-purple-800/30">
                <h3 className="text-lg font-semibold text-white">
                  Recent Call Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentCalls.slice(0, 5).map((call) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-purple-800/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {call.leadName}
                          </div>
                          <div className="text-sm text-purple-300 flex items-center gap-2">
                            <span>{call.phone}</span>
                            <span>•</span>
                            <span>{call.duration}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {getSentimentIcon(call.sentiment)}
                              {call.sentiment}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${getOutcomeColor(
                            call.outcome
                          )}`}
                        >
                          {call.outcome.replace("_", " ")}
                        </span>
                        <div className="text-sm font-medium text-white">
                          Score: {call.callScore}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would go here with similar purple theming... */}
        {activeTab !== "dashboard" && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              {activeTab === "campaigns" && (
                <Target className="w-8 h-8 text-white" />
              )}
              {activeTab === "calls" && (
                <Phone className="w-8 h-8 text-white" />
              )}
              {activeTab === "live" && (
                <Activity className="w-8 h-8 text-white" />
              )}
              {activeTab === "settings" && (
                <Settings className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === "campaigns" && "Voice Campaigns"}
              {activeTab === "calls" && "Call History"}
              {activeTab === "live" && "Live Call Monitoring"}
              {activeTab === "settings" && "Voice AI Settings"}
            </h3>
            <p className="text-purple-300 mb-6">
              {activeTab === "campaigns" &&
                "Manage your AI-powered calling campaigns"}
              {activeTab === "calls" &&
                "View detailed call history and analytics"}
              {activeTab === "live" && "Monitor active calls in real-time"}
              {activeTab === "settings" &&
                "Configure voice models and conversation flows"}
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg">
              Coming Soon
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAIPage;
