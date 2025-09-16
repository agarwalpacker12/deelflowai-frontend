import { useState } from "react";
import {
  Copy,
  AlertTriangle,
  Users,
  Shield,
  Bell,
  Settings,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  UserCheck,
  GitBranch,
  Zap,
  Filter,
  Info,
  Clock,
  TrendingUp,
  AlertCircle,
  Search,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Database,
} from "lucide-react";

const DuplicateManagementDashboard = () => {
  const [activeView, setActiveView] = useState("overview");
  const [duplicateHandling, setDuplicateHandling] =
    useState("notify_and_proceed");
  const [showNotification, setShowNotification] = useState(false);

  // Sample duplicate data
  const duplicateLeads = [
    {
      id: 1,
      lead: {
        name: "John Smith",
        address: "123 Main St, Miami FL",
        phone: "(555) 123-4567",
        email: "john.smith@email.com",
      },
      duplicateCount: 3,
      investors: [
        {
          name: "Sarah Chen",
          campaign: "Miami Heat Map",
          status: "contacted",
          daysAgo: 2,
        },
        {
          name: "Mike Johnson",
          campaign: "Social Triggers",
          status: "nurturing",
          daysAgo: 5,
        },
        {
          name: "Your Campaign",
          campaign: "Florida Distressed",
          status: "new",
          daysAgo: 0,
        },
      ],
      severity: "high",
      recommendation: "alternative_messaging",
    },
    {
      id: 2,
      lead: {
        name: "Maria Garcia",
        address: "456 Oak Ave, Tampa FL",
        phone: "(555) 987-6543",
        email: "maria.g@email.com",
      },
      duplicateCount: 2,
      investors: [
        {
          name: "Tom Wilson",
          campaign: "Pre-foreclosure Sweep",
          status: "qualified",
          daysAgo: 1,
        },
        {
          name: "Your Campaign",
          campaign: "Florida Distressed",
          status: "new",
          daysAgo: 0,
        },
      ],
      severity: "medium",
      recommendation: "coordinate",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Copy className="w-8 h-8 text-purple-400" />
              Duplicate Management Center
            </h1>
            <p className="text-white/70 mt-1">
              Cross-investor duplicate detection and conflict resolution
            </p>
          </div>
          <button
            onClick={() => setShowNotification(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Test Notification
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl p-1 mb-6">
        {[
          { id: "overview", label: "Overview", icon: Eye },
          { id: "active", label: "Active Duplicates", icon: AlertTriangle },
          { id: "settings", label: "Detection Settings", icon: Settings },
          { id: "history", label: "Resolution History", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeView === tab.id
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeView === "overview" && (
        <DuplicateOverview duplicateLeads={duplicateLeads} />
      )}
      {activeView === "active" && (
        <ActiveDuplicates duplicateLeads={duplicateLeads} />
      )}
      {activeView === "settings" && (
        <DuplicateSettings
          duplicateHandling={duplicateHandling}
          setDuplicateHandling={setDuplicateHandling}
        />
      )}
      {activeView === "history" && <ResolutionHistory />}

      {/* Notification Modal */}
      {showNotification && (
        <DuplicateNotification
          onClose={() => setShowNotification(false)}
          lead={duplicateLeads[0]}
        />
      )}
    </div>
  );
};

// Duplicate Overview Component
const DuplicateOverview = ({ duplicateLeads }) => {
  const stats = {
    totalDuplicates: 47,
    resolvedToday: 12,
    pendingReview: 8,
    autoResolved: 27,
    conflictRate: "3.2%",
    avgResolutionTime: "2.4 hrs",
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: "Total Duplicates",
            value: stats.totalDuplicates,
            icon: Copy,
            color: "orange",
            trend: "+15%",
          },
          {
            label: "Resolved Today",
            value: stats.resolvedToday,
            icon: CheckCircle,
            color: "green",
            trend: "+8",
          },
          {
            label: "Pending Review",
            value: stats.pendingReview,
            icon: Clock,
            color: "yellow",
            alert: true,
          },
          {
            label: "Auto-Resolved",
            value: stats.autoResolved,
            icon: Zap,
            color: "blue",
            trend: "+23%",
          },
          {
            label: "Conflict Rate",
            value: stats.conflictRate,
            icon: AlertTriangle,
            color: "red",
            trend: "-0.5%",
          },
          {
            label: "Avg Resolution",
            value: stats.avgResolutionTime,
            icon: TrendingUp,
            color: "purple",
          },
        ].map((metric, idx) => (
          <div
            key={idx}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center`}
              >
                <metric.icon className={`w-6 h-6 text-purple-400`} />
              </div>
              {metric.alert && (
                <span className="animate-pulse w-3 h-3 bg-yellow-500 rounded-full"></span>
              )}
            </div>
            <div className="text-2xl font-bold text-white">{metric.value}</div>
            <div className="text-sm text-white/70">{metric.label}</div>
            {metric.trend && (
              <div
                className={`text-sm mt-1 ${
                  metric.trend.startsWith("+")
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {metric.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Duplicate Detection Flow */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
          <GitBranch className="w-5 h-5 text-purple-400" />
          Duplicate Detection Flow
        </h3>
        <div className="flex items-center justify-between bg-white/5 rounded-lg p-6">
          {[
            { stage: "Lead Import", icon: Database, count: 2847 },
            { stage: "Duplicate Check", icon: Search, count: 234 },
            { stage: "Investor Match", icon: Users, count: 89 },
            { stage: "Strategy Applied", icon: Shield, count: 89 },
            { stage: "Resolution", icon: CheckCircle, count: 47 },
          ].map((stage, idx) => (
            <div key={idx} className="text-center relative">
              <div className="w-20 h-20 bg-white/10 border-2 border-purple-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <stage.icon className="w-8 h-8 text-purple-400" />
              </div>
              <div className="font-semibold text-white">{stage.stage}</div>
              <div className="text-2xl font-bold text-purple-300">
                {stage.count}
              </div>
              {idx < 4 && (
                <div className="absolute top-10 left-20 w-full h-0.5 bg-purple-400"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Duplicate Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Bell className="w-5 h-5 text-purple-400" />
            Recent Duplicate Alerts
          </h3>
          <div className="space-y-3">
            {duplicateLeads.slice(0, 3).map((dup) => (
              <div
                key={dup.id}
                className="border border-white/20 rounded-lg p-4 hover:border-purple-400 transition-colors bg-white/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">
                    {dup.lead.name}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      dup.severity === "high"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    }`}
                  >
                    {dup.severity} priority
                  </span>
                </div>
                <div className="text-sm text-white/70 mb-2">
                  {dup.lead.address}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-white/50" />
                    <span className="text-white/80">
                      {dup.duplicateCount} investors targeting
                    </span>
                  </div>
                  <button className="text-purple-300 hover:text-purple-200 text-sm font-medium">
                    Review →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Handling Strategy Distribution */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Strategy Distribution
          </h3>
          <div className="space-y-4">
            {[
              {
                strategy: "Notify & Proceed",
                count: 234,
                percentage: 45,
                color: "blue",
              },
              {
                strategy: "Alternative Messaging",
                count: 156,
                percentage: 30,
                color: "purple",
              },
              {
                strategy: "Skip Contacted",
                count: 89,
                percentage: 17,
                color: "orange",
              },
              {
                strategy: "Ignore Duplicates",
                count: 41,
                percentage: 8,
                color: "gray",
              },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-white">
                    {item.strategy}
                  </span>
                  <span className="text-sm text-white/70">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r from-purple-400 to-indigo-400 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Active Duplicates Component
const ActiveDuplicates = ({ duplicateLeads }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[
              "all",
              "high_priority",
              "your_campaigns",
              "resolved",
              "pending",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {status.replace("_", " ").charAt(0).toUpperCase() +
                  status.replace("_", " ").slice(1)}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 text-white flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Duplicate List */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/20">
            <h3 className="font-semibold flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-purple-400" />
              Active Duplicate Leads ({duplicateLeads.length})
            </h3>
          </div>
          <div className="divide-y divide-white/20 max-h-96 overflow-y-auto">
            {duplicateLeads.map((dup) => (
              <div
                key={dup.id}
                onClick={() => setSelectedLead(dup)}
                className={`p-4 hover:bg-white/10 cursor-pointer transition-colors ${
                  selectedLead?.id === dup.id
                    ? "bg-purple-500/20 border-l-4 border-purple-400"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2 text-white">
                      {dup.lead.name}
                      {dup.severity === "high" && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                      {dup.lead.address}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-white/80">
                        <Users className="w-3 h-3 text-white/60" />
                        {dup.duplicateCount} investors
                      </span>
                      <span className="flex items-center gap-1 text-white/80">
                        <Clock className="w-3 h-3 text-white/60" />
                        Found 2 hrs ago
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-white/50 transform transition-transform ${
                      selectedLead?.id === dup.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Active Duplicate Leads ({duplicateLeads.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {duplicateLeads.map((dup) => (
              <div
                key={dup.id}
                onClick={() => setSelectedLead(dup)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedLead?.id === dup.id
                    ? "bg-orange-50 border-l-4 border-orange-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold flex items-center gap-2">
                      {dup.lead.name}
                      {dup.severity === "high" && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {dup.lead.address}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {dup.duplicateCount} investors
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Found 2 hrs ago
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      selectedLead?.id === dup.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Lead Details */}
        {selectedLead && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
              <Info className="w-5 h-5 text-purple-400" />
              Duplicate Details
            </h3>

            {/* Lead Info */}
            <div className="mb-6">
              <h4 className="font-medium text-white mb-2">Lead Information</h4>
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Name:</span>
                  <span className="font-medium text-white">
                    {selectedLead.lead.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Address:</span>
                  <span className="font-medium text-white">
                    {selectedLead.lead.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Phone:</span>
                  <span className="font-medium text-white">
                    {selectedLead.lead.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Email:</span>
                  <span className="font-medium text-white">
                    {selectedLead.lead.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Investor Activity */}
            <div className="mb-6">
              <h4 className="font-medium text-white mb-2">Investor Activity</h4>
              <div className="space-y-3">
                {selectedLead.investors.map((investor, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-lg p-3 ${
                      investor.name === "Your Campaign"
                        ? "border-purple-400 bg-purple-500/20"
                        : "border-white/20 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium flex items-center gap-2 text-white">
                        <UserCheck className="w-4 h-4 text-white/50" />
                        {investor.name}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          investor.status === "contacted"
                            ? "bg-blue-100 text-blue-700"
                            : investor.status === "nurturing"
                            ? "bg-purple-100 text-purple-700"
                            : investor.status === "qualified"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {investor.status}
                      </span>
                    </div>
                    <div className="text-sm text-white/70">
                      Campaign: {investor.campaign}
                    </div>
                    <div className="text-sm text-white/60 mt-1">
                      {investor.daysAgo === 0
                        ? "Just now"
                        : `${investor.daysAgo} days ago`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Action */}
            <div className="mb-6">
              <h4 className="font-medium text-white mb-2">AI Recommendation</h4>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-300 mt-1" />
                  <div>
                    <div className="font-medium text-blue-200 mb-1">
                      Use Alternative Messaging Strategy
                    </div>
                    <div className="text-sm text-blue-100">
                      Since 2 other investors have already contacted this lead,
                      we recommend using an alternative approach that
                      acknowledges the competitive situation while highlighting
                      your unique value proposition.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all">
                Apply Strategy
              </button>
              <button className="flex-1 px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-white">
                Override & Proceed
              </button>
              <button className="px-4 py-2 text-white/70 hover:text-white">
                Skip Lead
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/70">2 duplicates selected</span>
            <button className="text-sm text-purple-300 hover:text-purple-200 font-medium">
              Select All
            </button>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              Apply Strategy to Selected
            </button>
            <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
              Skip Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Duplicate Settings Component
const DuplicateSettings = ({ duplicateHandling, setDuplicateHandling }) => {
  const [crossInvestorCheck, setCrossInvestorCheck] = useState(true);
  const [autoResolve, setAutoResolve] = useState(false);
  const [matchingCriteria, setMatchingCriteria] = useState({
    name: true,
    phone: true,
    email: true,
    address: true,
  });

  return (
    <div className="space-y-6">
      {/* Detection Settings */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
          <Shield className="w-5 h-5 text-purple-400" />
          Duplicate Detection Settings
        </h3>

        <div className="space-y-6">
          {/* Cross-Investor Detection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-white">
                  Cross-Investor Detection
                </h4>
                <p className="text-sm text-white/70">
                  Check for duplicates across all investors in your organization
                </p>
              </div>
              <button
                onClick={() => setCrossInvestorCheck(!crossInvestorCheck)}
                className="relative"
              >
                {crossInvestorCheck ? (
                  <ToggleRight className="w-12 h-6 text-purple-400" />
                ) : (
                  <ToggleLeft className="w-12 h-6 text-white/40" />
                )}
              </button>
            </div>
            {crossInvestorCheck && (
              <div className="ml-4 mt-3 p-3 bg-purple-500/20 rounded-lg">
                <p className="text-sm text-purple-200">
                  <Info className="w-4 h-4 inline mr-1" />
                  When enabled, you'll be notified if other investors in your
                  organization are already working with a lead
                </p>
              </div>
            )}
          </div>

          {/* Matching Criteria */}
          <div>
            <h4 className="font-medium mb-3 text-white">Matching Criteria</h4>
            <p className="text-sm text-white/70 mb-4">
              Select which fields to use for duplicate detection
            </p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(matchingCriteria).map(([field, enabled]) => (
                <label
                  key={field}
                  className="flex items-center gap-3 p-3 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10"
                >
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      setMatchingCriteria({
                        ...matchingCriteria,
                        [field]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-purple-400"
                  />
                  <span className="font-medium capitalize text-white">
                    {field}
                  </span>
                  {field === "phone" && (
                    <span className="text-xs text-white/50">(Recommended)</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Sensitivity */}
          <div>
            <h4 className="font-medium mb-3 text-white">Match Sensitivity</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Fuzzy Matching</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="80"
                  className="w-48"
                />
                <span className="text-sm font-medium text-white">80%</span>
              </div>
              <p className="text-xs text-white/50">
                Higher values require closer matches. 80% will catch "John
                Smith" vs "Jon Smith"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Handling Strategies */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
          <GitBranch className="w-5 h-5 text-purple-400" />
          Duplicate Handling Strategies
        </h3>

        <div className="space-y-3">
          {[
            {
              id: "skip_contacted",
              title: "Skip Contacted Leads",
              description:
                "Do not contact leads that are already being worked by another investor",
              icon: XCircle,
              color: "red",
            },
            {
              id: "notify_and_proceed",
              title: "Notify and Proceed",
              description:
                "Alert me about duplicates but continue with my outreach campaign",
              icon: Bell,
              color: "blue",
            },
            {
              id: "alternative_messaging",
              title: "Alternative Messaging",
              description:
                "Automatically adjust messaging for competitive situations",
              icon: MessageSquare,
              color: "purple",
            },
            {
              id: "ignore_duplicates",
              title: "Ignore Duplicates",
              description:
                "Contact all leads regardless of other investor activity",
              icon: Eye,
              color: "gray",
            },
          ].map((strategy) => (
            <label
              key={strategy.id}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                duplicateHandling === strategy.id
                  ? "border-purple-500 bg-purple-500/20"
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              <input
                type="radio"
                name="duplicateHandling"
                value={strategy.id}
                checked={duplicateHandling === strategy.id}
                onChange={(e) => setDuplicateHandling(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center`}
                >
                  <strategy.icon className={`w-5 h-5 text-purple-400`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{strategy.title}</div>
                  <div className="text-sm text-white/70 mt-1">
                    {strategy.description}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Strategy-specific settings */}
        {duplicateHandling === "alternative_messaging" && (
          <div className="mt-4 p-4 bg-purple-500/20 rounded-lg">
            <h4 className="font-medium mb-2 text-white">
              Alternative Messaging Options
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm text-white">
                  Acknowledge competitive situation
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm text-white">
                  Emphasize unique value proposition
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm text-white">
                  Offer exclusive benefits
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Auto-Resolution */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
          <Zap className="w-5 h-5 text-purple-400" />
          Automatic Resolution
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-white">Enable Auto-Resolution</h4>
            <p className="text-sm text-white/70">
              Automatically apply handling strategies without manual review
            </p>
          </div>
          <button
            onClick={() => setAutoResolve(!autoResolve)}
            className="relative"
          >
            {autoResolve ? (
              <ToggleRight className="w-12 h-6 text-purple-400" />
            ) : (
              <ToggleLeft className="w-12 h-6 text-white/40" />
            )}
          </button>
        </div>

        {autoResolve && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Auto-resolve confidence threshold
              </label>
              <select className="w-full px-3 py-2 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:bg-purple-800">
                <option>High confidence only (95%+)</option>
                <option>Medium confidence (80%+)</option>
                <option>Low confidence (60%+)</option>
              </select>
            </div>

            <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-200">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Auto-resolution will still notify you of all actions taken
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Save Settings */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-white">
          Reset to Defaults
        </button>
        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

// Resolution History Component
const ResolutionHistory = () => {
  const history = [
    {
      id: 1,
      date: "2024-01-26 10:30 AM",
      lead: "John Smith - 123 Main St",
      action: "Alternative Messaging Applied",
      result: "Lead responded positively",
      resolver: "AI Auto-Resolution",
      status: "success",
    },
    {
      id: 2,
      date: "2024-01-26 09:15 AM",
      lead: "Maria Garcia - 456 Oak Ave",
      action: "Skipped (Already Contacted)",
      result: "Avoided duplicate outreach",
      resolver: "Manual Review",
      status: "neutral",
    },
    {
      id: 3,
      date: "2024-01-25 04:45 PM",
      lead: "Robert Johnson - 789 Pine St",
      action: "Notified and Proceeded",
      result: "No response yet",
      resolver: "Campaign Settings",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-300">87%</div>
          <div className="text-sm text-white/70">Success Rate</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-300">234</div>
          <div className="text-sm text-white/70">Total Resolved</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-300">156</div>
          <div className="text-sm text-white/70">Auto-Resolved</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <div className="text-2xl font-bold text-orange-300">2.4h</div>
          <div className="text-sm text-white/70">Avg Time</div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/20">
          <h3 className="font-semibold flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-purple-400" />
            Resolution History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Action Taken
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Resolved By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-white/10">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.lead}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                    {item.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.result}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                    {item.resolver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.status === "success"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : item.status === "neutral"
                          ? "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Export History</h4>
            <p className="text-sm text-white/70">
              Download resolution history for reporting
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-white">
              Export CSV
            </button>
            <button className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-white">
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Duplicate Notification Modal
const DuplicateNotification = ({ onClose, lead }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-slideIn">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Duplicate Lead Detected
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2 text-white">
              {lead.lead.name}
            </h4>
            <p className="text-white/70">{lead.lead.address}</p>
          </div>

          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 mb-6">
            <p className="text-purple-200">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              This lead is already being contacted by {lead.duplicateCount -
                1}{" "}
              other investor(s) in your organization
            </p>
          </div>

          <div className="mb-6">
            <h5 className="font-medium mb-3 text-white">
              Other Investors Targeting This Lead:
            </h5>
            <div className="space-y-2">
              {lead.investors
                .filter((i) => i.name !== "Your Campaign")
                .map((investor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-white/5 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-white/50" />
                      <span className="font-medium text-white">
                        {investor.name}
                      </span>
                    </div>
                    <span className="text-sm text-white/70">
                      {investor.status} • {investor.daysAgo}d ago
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all"
            >
              Apply Alternative Strategy
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              Review Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateManagementDashboard;
