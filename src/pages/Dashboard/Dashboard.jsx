import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Phone,
  Eye,
  Brain,
  Shield,
  ShoppingBag,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Home,
  FileText,
  Loader2,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";
import { DashboardAPI } from "../../services/api";

const Dashboard = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: { value: "$0", change: "0%" },
    activeUsers: { value: "0", change: "0%" },
    propertiesListed: { value: "0", change: "0%" }, // You may need to add this API endpoint
    aiConversations: { value: "0", change: "0%" },
    totalDeals: { value: "0", change: "0%" },
    monthlyProfit: { value: "$0", change: "0%" },
    voiceCalls: { value: "0", change: "0%" },
    complianceStatus: {
      percentage: 0,
      status: "All audits compliant",

      // Optional additional fields:
      lastAuditDate: null,
      nextAuditDate: null,
      criticalIssues: 0,
      resolvedIssues: 0,
    },
    // Add AI accuracy to existing dashboard data
    aiAccuracy: { value: "0%", change: "0% improvement" },
  });

  // Add new state for AI metrics
  const [aiMetrics, setAiMetrics] = useState({
    voiceAI: { value: "0", percentage: "0%" },
    visionAnalysis: { value: "0", percentage: "0%" },
    nlpProcessing: { value: "0", percentage: "0%" },
    blockchain: { value: "0", percentage: "0%" },
  });

  // Add new state for tenant management data
  const [tenantData, setTenantData] = useState({
    stats: {
      activeTenants: "0",
      paymentOverdue: "0",
      suspended: "0",
      monthlyRevenue: "$0",
    },
    recentActivity: [],
  });

  // Add new state for opportunity cost analysis
  const [opportunityCostData, setOpportunityCostData] = useState({
    lostRevenue: "$0",
    lostRevenueDescription: "Lost due diluted for full automation",
    potentialRevenue: "$0",
    currentRevenue: "$0",
    projectedRevenue: "$0",
    optimizationNeeded: 0,
    roiConversionEfficiency: "0%",
    peakTimeMonths: 0,
    peakDescription: "automated renewal potential",
  });
  const [chartData, setChartData] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add new state for market alerts
  const [marketAlerts, setMarketAlerts] = useState([]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          totalRevenueRes,
          activeUsersRes,
          aiConversationsRes,
          totalDealsRes,
          monthlyProfitRes,
          voiceCallsRes,
          complianceStatusRes,
          liveActivityRes,
          chartDataRes,

          // New AI metrics requests
          voiceAIMetricsRes,
          visionAnalysisRes,
          nlpProcessingRes,
          blockchainRes,

          // New tenant management requests
          tenantStatsRes,
          tenantActivityRes,
          // New opportunity cost analysis request
          opportunityCostRes,
          // New AI accuracy request
          aiAccuracyRes,
          // New market alerts request
          marketAlertsRes,
        ] = await Promise.allSettled([
          DashboardAPI.getTotalRevenue(),
          DashboardAPI.getActiveUsers(),
          DashboardAPI.getAiConversations(),
          DashboardAPI.getTotalDeals(),
          DashboardAPI.getMonthlyProfit(),
          DashboardAPI.getVoiceCallsCount(),
          DashboardAPI.getComplianceStatus(),
          DashboardAPI.getLiveActivityFeed(),
          DashboardAPI.getChartData(),

          // New AI metrics API calls
          DashboardAPI.getVoiceAIMetrics(),
          DashboardAPI.getVisionAnalysisMetrics(),
          DashboardAPI.getNLPProcessingMetrics(),
          DashboardAPI.getBlockchainMetrics(),

          // New tenant management API calls
          DashboardAPI.getTenantStats(),
          DashboardAPI.getRecentTenantActivity(),

          // New opportunity cost analysis API call
          DashboardAPI.getOpportunityCostAnalysis(),
          // New AI accuracy API call
          DashboardAPI.getAiAccuracy(),
          DashboardAPI.getChartData(),
          // New market alerts API call
          DashboardAPI.getMarketAlerts(),
        ]);

        // Process the responses
        const newDashboardData = { ...dashboardData };

        if (totalRevenueRes.status === "fulfilled") {
          newDashboardData.totalRevenue = {
            value: formatCurrency(
              totalRevenueRes.value.data.total_revenue || 0
            ),
            change: `${totalRevenueRes.value.data.change_percentage || 0}%`,
          };
        }

        if (activeUsersRes.status === "fulfilled") {
          newDashboardData.activeUsers = {
            value: formatNumber(activeUsersRes.value.data.active_users || 0),
            change: `${activeUsersRes.value.data.change_percentage || 0}%`,
          };
        }

        if (aiConversationsRes.status === "fulfilled") {
          newDashboardData.aiConversations = {
            value: formatNumber(
              aiConversationsRes.value.data.total_conversations || 0
            ),
            change: `${aiConversationsRes.value.data.change_percentage || 0}%`,
          };
        }

        if (totalDealsRes.status === "fulfilled") {
          newDashboardData.totalDeals = {
            value: totalDealsRes.value.data.total_deals?.toString() || "0",
            change: `${
              totalDealsRes.value.data.change_percentage || 0
            }% from last month`,
          };
        }

        if (monthlyProfitRes.status === "fulfilled") {
          newDashboardData.monthlyProfit = {
            value: formatCurrency(
              monthlyProfitRes.value.data.monthly_profit || 0
            ),
            change: `${
              monthlyProfitRes.value.data.change_percentage || 0
            }% from last month`,
          };
        }

        if (voiceCallsRes.status === "fulfilled") {
          newDashboardData.voiceCalls = {
            value:
              voiceCallsRes.value.data.voice_calls_count?.toString() || "0",
            change: `${voiceCallsRes.value.data.change_percentage || 0}% today`,
          };
        }

        if (complianceStatusRes.status === "fulfilled") {
          newDashboardData.complianceStatus = {
            percentage:
              complianceStatusRes.value.data.compliance_percentage || 0,
            status:
              complianceStatusRes.value.data.status || "All audits compliant",
          };
        }
        // Process AI accuracy response
        if (aiAccuracyRes.status === "fulfilled") {
          const data = aiAccuracyRes.value.data;
          newDashboardData.aiAccuracy = {
            value: `${data.overall_accuracy || 0}%`,
            change: `${data.improvement_percentage || 0}% improvement`,
          };
        }

        setDashboardData(newDashboardData);

        // Process AI metrics responses
        const newAiMetrics = { ...aiMetrics };

        if (voiceAIMetricsRes.status === "fulfilled") {
          const data = voiceAIMetricsRes.value.data;
          newAiMetrics.voiceAI = {
            value: formatNumber(data.total_calls || 0),
            percentage: `${data.success_rate || 0}%`,
          };
        }

        if (visionAnalysisRes.status === "fulfilled") {
          const data = visionAnalysisRes.value.data;
          newAiMetrics.visionAnalysis = {
            value: formatNumber(data.total_analyses || 0),
            percentage: `${data.accuracy_rate || 0}%`,
          };
        }

        if (nlpProcessingRes.status === "fulfilled") {
          const data = nlpProcessingRes.value.data;
          newAiMetrics.nlpProcessing = {
            value: formatNumber(data.total_processed || 0),
            percentage: `${data.processing_success_rate || 0}%`,
          };
        }

        if (blockchainRes.status === "fulfilled") {
          const data = blockchainRes.value.data;
          newAiMetrics.blockchain = {
            value: formatNumber(data.total_transactions || 0),
            percentage: `${data.success_rate || 0}%`,
          };
        }

        setAiMetrics(newAiMetrics);

        // Process tenant management responses
        const newTenantData = { ...tenantData };

        if (tenantStatsRes.status === "fulfilled") {
          const data = tenantStatsRes.value.data;
          newTenantData.stats = {
            activeTenants: (data.active_tenants || 0).toString(),
            paymentOverdue: (data.payment_overdue || 0).toString(),
            suspended: (data.suspended || 0).toString(),
            monthlyRevenue: formatCurrency(data.monthly_revenue || 0),
          };
        }

        if (tenantActivityRes.status === "fulfilled") {
          const data = tenantActivityRes.value.data;
          newTenantData.recentActivity = data.recent_activities || [];
        }

        setTenantData(newTenantData);

        // Process opportunity cost analysis response
        if (opportunityCostRes.status === "fulfilled") {
          const data = opportunityCostRes.value.data;
          setOpportunityCostData({
            lostRevenue: formatCurrency(data.lost_revenue || 0),
            lostRevenueDescription:
              data.lost_revenue_description ||
              "Lost due diluted for full automation",
            potentialRevenue: formatCurrency(data.potential_revenue || 0),
            currentRevenue: formatCurrency(data.current_revenue || 0),
            projectedRevenue: formatCurrency(data.projected_revenue || 0),
            optimizationNeeded: data.optimization_needed || 0,
            roiConversionEfficiency: `${data.roi_conversion_efficiency || 0}%`,
            peakTimeMonths: data.peak_time_months || 0,
            peakDescription:
              data.peak_description || "automated renewal potential",
          });
        }
        // Process market alerts response
        if (marketAlertsRes.status === "fulfilled") {
          setMarketAlerts(marketAlertsRes.value.data.alerts || []);
        }
        // Set chart data
        if (chartDataRes.status === "fulfilled") {
          setChartData(chartDataRes.value.data.chart_data || []);
        }

        // Set live activity
        if (liveActivityRes.status === "fulfilled") {
          setLiveActivity(liveActivityRes.value.data.activities || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up polling for live data every 30 seconds

    const interval = setInterval(() => {
      // Update live activity
      DashboardAPI.getLiveActivityFeed()
        .then((res) => setLiveActivity(res.data.activities || []))
        .catch((err) => console.error("Error fetching live activity:", err));

      // Update market alerts
      DashboardAPI.getMarketAlerts()
        .then((res) => setMarketAlerts(res.data.alerts || []))
        .catch((err) => console.error("Error fetching market alerts:", err));

      // Update AI accuracy (optional - you might want to update this less frequently)
      DashboardAPI.getAiAccuracy()
        .then((res) => {
          const data = res.data;
          setDashboardData((prev) => ({
            ...prev,
            aiAccuracy: {
              value: `${data.overall_accuracy || 0}%`,
              change: `${data.improvement_percentage || 0}% improvement`,
            },
          }));
        })
        .catch((err) => console.error("Error fetching AI accuracy:", err));

      // Optionally, also update AI metrics periodically
      Promise.allSettled([
        DashboardAPI.getVoiceAIMetrics(),
        DashboardAPI.getVisionAnalysisMetrics(),
        DashboardAPI.getNLPProcessingMetrics(),
        DashboardAPI.getBlockchainMetrics(),
      ]).then((results) => {
        const newAiMetrics = { ...aiMetrics };

        if (results[0].status === "fulfilled") {
          const data = results[0].value.data;
          newAiMetrics.voiceAI = {
            value: formatNumber(data.total_calls || 0),
            percentage: `${data.success_rate || 0}%`,
          };
        }

        if (results[1].status === "fulfilled") {
          const data = results[1].value.data;
          newAiMetrics.visionAnalysis = {
            value: formatNumber(data.total_analyses || 0),
            percentage: `${data.accuracy_rate || 0}%`,
          };
        }

        if (results[2].status === "fulfilled") {
          const data = results[2].value.data;
          newAiMetrics.nlpProcessing = {
            value: formatNumber(data.total_processed || 0),
            percentage: `${data.processing_success_rate || 0}%`,
          };
        }

        if (results[3].status === "fulfilled") {
          const data = results[3].value.data;
          newAiMetrics.blockchain = {
            value: formatNumber(data.total_transactions || 0),
            percentage: `${data.success_rate || 0}%`,
          };
        }

        setAiMetrics(newAiMetrics);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Helper functions
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return `${amount}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const isPositiveChange = (change) => {
    return parseFloat(change.replace("%", "").replace(/[^-\d.]/g, "")) > 0;
  };

  // Helper functions for live activity
  const getActivityIcon = (type) => {
    switch (type) {
      case "phone_call":
      case "voice_ai":
        return <Phone className="w-4 h-4" />;
      case "deal_closed":
      case "payment":
        return <DollarSign className="w-4 h-4" />;
      case "property":
        return <Home className="w-4 h-4" />;
      case "user_activity":
        return <Users className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "phone_call":
      case "voice_ai":
        return { iconColor: "text-orange-400", iconBg: "bg-orange-500/20" };
      case "deal_closed":
      case "payment":
        return { iconColor: "text-green-400", iconBg: "bg-green-500/20" };
      case "property":
        return { iconColor: "text-blue-400", iconBg: "bg-blue-500/20" };
      case "user_activity":
        return { iconColor: "text-purple-400", iconBg: "bg-purple-500/20" };
      default:
        return { iconColor: "text-gray-400", iconBg: "bg-gray-500/20" };
    }
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";

    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  // 4. Helper function to get alert icon based on type:
  const getAlertIcon = (type) => {
    switch (type) {
      case "property":
        return <Home className="w-4 h-4" />;
      case "regulation":
        return <FileText className="w-4 h-4" />;
      case "funding":
      case "financial":
        return <DollarSign className="w-4 h-4" />;
      case "market":
        return <TrendingUp className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <MainContentWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3 text-white">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-lg">Loading dashboard data...</span>
          </div>
        </div>
      </MainContentWrapper>
    );
  }

  if (error) {
    return (
      <MainContentWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </MainContentWrapper>
    );
  }

  return (
    <MainContentWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400">
                Track your business performance in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedStatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total Revenue"
            value={dashboardData.totalRevenue.value}
            change={dashboardData.totalRevenue.change}
            positive={isPositiveChange(dashboardData.totalRevenue.change)}
            trend="trending_up"
            subtitle="vs last month"
            color="blue"
          />
          <EnhancedStatCard
            icon={<Users className="w-6 h-6" />}
            title="Active Users"
            value={dashboardData.activeUsers.value}
            change={dashboardData.activeUsers.change}
            positive={isPositiveChange(dashboardData.activeUsers.change)}
            trend="trending_up"
            subtitle="in pipeline"
            color="green"
          />
          <EnhancedStatCard
            icon={<ShoppingBag className="w-6 h-6" />}
            title="Properties Listed"
            value={dashboardData.propertiesListed.value}
            change={dashboardData.propertiesListed.change}
            positive={isPositiveChange(dashboardData.propertiesListed.change)}
            trend="trending_up"
            subtitle="this month"
            color="emerald"
          />
          <EnhancedStatCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="AI Conversations"
            value={dashboardData.aiConversations.value}
            change={dashboardData.aiConversations.change}
            positive={isPositiveChange(dashboardData.aiConversations.change)}
            trend="trending_up"
            subtitle="avg. rate"
            color="purple"
          />
        </div>

        {/* AI Performance Metrics Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <Brain className="w-6 h-6 text-cyan-400" />
            AI Performance Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AIMetricCard
              icon={<Phone className="w-5 h-5" />}
              title="Voice AI Calls"
              value={aiMetrics.voiceAI.value}
              percentage={aiMetrics.voiceAI.percentage}
              color="blue"
            />
            <AIMetricCard
              icon={<Eye className="w-5 h-5" />}
              title="Vision Analysis"
              value={aiMetrics.visionAnalysis.value}
              percentage={aiMetrics.visionAnalysis.percentage}
              color="green"
            />
            <AIMetricCard
              icon={<Brain className="w-5 h-5" />}
              title="NLP Processing"
              value={aiMetrics.nlpProcessing.value}
              percentage={aiMetrics.nlpProcessing.percentage}
              color="purple"
            />
            <AIMetricCard
              icon={<Shield className="w-5 h-5" />}
              title="Blockchain Txns"
              value={aiMetrics.blockchain.value}
              percentage={aiMetrics.blockchain.percentage}
              color="cyan"
            />
          </div>
        </div>

        {/* Tenant Management Overview Section with Dynamic Data */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-400" />
              Tenant Management Overview
            </h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              View All Tenants →
            </button>
          </div>

          {/* Tenant Stats - Now using dynamic data */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <TenantStatCard
              title="Active Tenants"
              value={tenantData.stats.activeTenants}
              color="green"
              icon={<CheckCircle className="w-4 h-4" />}
            />
            <TenantStatCard
              title="Payment Overdue"
              value={tenantData.stats.paymentOverdue}
              color="red"
              icon={<AlertTriangle className="w-4 h-4" />}
            />
            <TenantStatCard
              title="Suspended"
              value={tenantData.stats.suspended}
              color="orange"
              icon={<Eye className="w-4 h-4" />}
            />
            <TenantStatCard
              title="Monthly Revenue"
              value={tenantData.stats.monthlyRevenue}
              color="blue"
              icon={<DollarSign className="w-4 h-4" />}
            />
          </div>

          {/* Recent Tenant Activity - Now using dynamic data */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Recent Activity
            </h3>
            {tenantData.recentActivity.length > 0 ? (
              tenantData.recentActivity.map((activity, index) => (
                <TenantActivityItem
                  key={activity.id || index}
                  organization={activity.organization_name}
                  action={activity.action}
                  amount={
                    activity.amount ? formatCurrency(activity.amount) : ""
                  }
                  time={formatTimeAgo(activity.timestamp)}
                  status={activity.status}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No recent tenant activity</p>
              </div>
            )}
          </div>

          {/* Opportunity Cost Analysis Section with Dynamic Data */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <TrendingUp className="w-full h-full" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5" />
                <h2 className="text-lg font-semibold">
                  Opportunity Cost Analysis
                </h2>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-2">
                  {opportunityCostData.lostRevenue}
                </div>
                <div className="text-sm opacity-90">
                  {opportunityCostData.lostRevenueDescription}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {opportunityCostData.potentialRevenue}
                  </div>
                  <div className="text-xs opacity-75">Potential</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {opportunityCostData.currentRevenue}
                  </div>
                  <div className="text-xs opacity-75">Current</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {opportunityCostData.projectedRevenue}
                  </div>
                  <div className="text-xs opacity-75">Projected</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {opportunityCostData.optimizationNeeded} OPTIMIZATION NEEDED
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs opacity-75 mb-1">
                  Peaks at {opportunityCostData.peakTimeMonths} months in{" "}
                  {opportunityCostData.peakDescription}
                </div>
                <div className="text-xs opacity-75">
                  ROI conversion efficiency:{" "}
                  {opportunityCostData.roiConversionEfficiency}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Business Metrics - Now fully populated with dynamic data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-5">
            <BusinessMetricCard
              title="Total Deals"
              value={dashboardData.totalDeals.value}
              change={dashboardData.totalDeals.change}
              positive={isPositiveChange(dashboardData.totalDeals.change)}
              icon={<Target className="w-5 h-5" />}
              color="blue"
            />
            <BusinessMetricCard
              title="Monthly Profit"
              value={dashboardData.monthlyProfit.value}
              change={dashboardData.monthlyProfit.change}
              positive={isPositiveChange(dashboardData.monthlyProfit.change)}
              icon={<DollarSign className="w-5 h-5" />}
              color="green"
            />
            <BusinessMetricCard
              title="AI Accuracy"
              value={dashboardData.aiAccuracy.value}
              change={dashboardData.aiAccuracy.change}
              positive={isPositiveChange(dashboardData.aiAccuracy.change)}
              icon={<Brain className="w-5 h-5" />}
              color="purple"
            />
            <BusinessMetricCard
              title="Voice Calls"
              value={dashboardData.voiceCalls.value}
              change={dashboardData.voiceCalls.change}
              positive={isPositiveChange(dashboardData.voiceCalls.change)}
              icon={<Phone className="w-5 h-5" />}
              color="orange"
              showTodayBadge={dashboardData.voiceCalls.change.includes("today")}
            />
          </div>

          {/* Compliance Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 my-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-400" />
                Compliance Status
              </h2>
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">
                  {dashboardData.complianceStatus.percentage}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">
                {dashboardData.complianceStatus.status}
              </span>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${dashboardData.complianceStatus.percentage}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Revenue & User Growth Chart */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                Revenue & User Growth
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Users</span>
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#60A5FA"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient
                      id="usersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#34D399"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (value >= 1000000)
                        return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value;
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      backdropFilter: "blur(10px)",
                    }}
                    labelStyle={{ color: "#fff" }}
                    formatter={(value, name) => [
                      name === "revenue"
                        ? `${(value / 1000).toFixed(0)}K`
                        : `${(value / 1000).toFixed(1)}K`,
                      name === "revenue" ? "Revenue" : "Users",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    name="revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#34D399"
                    strokeWidth={2}
                    fill="url(#usersGradient)"
                    name="users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Activity Feed - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Alerts & Opportunities - Now with dynamic data */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">
                  Market Alerts & Opportunities
                </h3>
              </div>

              <div className="space-y-3">
                {marketAlerts.length > 0 ? (
                  marketAlerts
                    .slice(0, 3)
                    .map((alert, index) => (
                      <AlertItem
                        key={alert.id || index}
                        icon={getAlertIcon(alert.type)}
                        text={alert.message || alert.text}
                        time={formatTimeAgo(alert.created_at || alert.time)}
                        type={alert.severity || alert.type || "info"}
                      />
                    ))
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">No recent market alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Activity Feed - Already using dynamic data */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-white">
                    Live Activity
                  </h3>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {liveActivity.length > 0 ? (
                  liveActivity
                    .slice(0, 3)
                    .map((activity, index) => (
                      <ActivityItem
                        key={index}
                        icon={getActivityIcon(activity.type)}
                        iconColor={getActivityColor(activity.type).iconColor}
                        iconBg={getActivityColor(activity.type).iconBg}
                        title={
                          activity.user_name || activity.title || "Unknown User"
                        }
                        action={activity.action || activity.description}
                        time={formatTimeAgo(
                          activity.created_at || activity.time
                        )}
                        location={activity.location || ""}
                      />
                    ))
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainContentWrapper>
  );
};

const EnhancedStatCard = ({
  icon,
  title,
  value,
  change,
  positive,
  color,
  subtitle,
}) => {
  const colorClasses = {
    blue: "text-blue-400",
    green: "text-green-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`${colorClasses[color]} group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div className="flex items-center gap-1">
          {positive ? (
            <ArrowUp className="w-3 h-3 text-green-400" />
          ) : (
            <ArrowDown className="w-3 h-3 text-red-400" />
          )}
          <span
            className={`text-sm font-medium ${
              positive ? "text-green-400" : "text-red-400"
            }`}
          >
            {change}
          </span>
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1 group-hover:text-3xl transition-all">
        {value}
      </div>
      <div className="text-sm text-gray-400">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}

      {/* Mini progress indicator */}
      <div className="mt-3 w-full bg-white/5 rounded-full h-1">
        <div
          className={`bg-gradient-to-r ${
            color === "blue"
              ? "from-blue-500 to-blue-400"
              : color === "green"
              ? "from-green-500 to-green-400"
              : color === "emerald"
              ? "from-emerald-500 to-emerald-400"
              : "from-purple-500 to-purple-400"
          } h-1 rounded-full transition-all duration-300`}
          style={{ width: positive ? "70%" : "45%" }}
        ></div>
      </div>
    </div>
  );
};

const ActivityItem = ({
  icon,
  iconColor,
  iconBg,
  title,
  action,
  time,
  location,
}) => {
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors">
      <div className={`p-2 rounded-full ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-medium text-sm">{title}</span>
          <span className="text-white text-sm">{action}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">{time}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400">{location}</span>
        </div>
      </div>
    </div>
  );
};

const AlertItem = ({ icon, text, time, type }) => {
  const typeStyles = {
    success: {
      border: "border-l-green-400",
      bg: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    warning: {
      border: "border-l-yellow-400",
      bg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },
    info: {
      border: "border-l-blue-400",
      bg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`flex items-center gap-4 p-4 ${style.bg} ${style.border} border-l-4 rounded-lg hover:bg-white/10 transition-colors`}
    >
      <div className={`${style.iconColor}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-white text-sm">{text}</p>
        <p className="text-gray-400 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
};

const BusinessMetricCard = ({
  title,
  value,
  change,
  positive,
  icon,
  color,
  showTodayBadge,
}) => {
  const colorClasses = {
    blue: {
      icon: "text-blue-400",
      bg: "bg-blue-500/10",
      accent: "text-blue-400",
    },
    green: {
      icon: "text-green-400",
      bg: "bg-green-500/10",
      accent: "text-green-400",
    },
    purple: {
      icon: "text-purple-400",
      bg: "bg-purple-500/10",
      accent: "text-purple-400",
    },
    orange: {
      icon: "text-orange-400",
      bg: "bg-orange-500/10",
      accent: "text-orange-400",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 relative">
      {/* Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <span className={colors.icon}>{icon}</span>
        </div>
        {showTodayBadge && (
          <div className="bg-orange-500/20 px-2 py-1 rounded-full">
            <span className="text-xs text-orange-400 font-medium">Today</span>
          </div>
        )}
      </div>

      {/* Title */}
      <p className="text-sm text-gray-400 mb-1">{title}</p>

      {/* Value */}
      <p className="text-2xl font-bold text-white mb-2">{value}</p>

      {/* Change indicator */}
      <div className="flex items-center gap-1">
        {positive ? (
          <TrendingUp className="w-3 h-3 text-green-400" />
        ) : (
          <TrendingDown className="w-3 h-3 text-red-400" />
        )}
        <span
          className={`text-xs ${positive ? "text-green-400" : "text-red-400"}`}
        >
          {change}
        </span>
      </div>
    </div>
  );
};

const AIMetricCard = ({ icon, title, value, percentage, color }) => {
  const colorClasses = {
    blue: {
      icon: "text-blue-400",
      bg: "bg-blue-500/10",
      progress: "from-blue-500 to-blue-400",
      percentage: "text-blue-400",
    },
    green: {
      icon: "text-green-400",
      bg: "bg-green-500/10",
      progress: "from-green-500 to-green-400",
      percentage: "text-green-400",
    },
    purple: {
      icon: "text-purple-400",
      bg: "bg-purple-500/10",
      progress: "from-purple-500 to-purple-400",
      percentage: "text-purple-400",
    },
    cyan: {
      icon: "text-cyan-400",
      bg: "bg-cyan-500/10",
      progress: "from-cyan-500 to-cyan-400",
      percentage: "text-cyan-400",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <span className={colors.icon}>{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
        <div className={`text-sm font-semibold ${colors.percentage}`}>
          {percentage}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-1.5">
        <div
          className={`bg-gradient-to-r ${colors.progress} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: percentage }}
        ></div>
      </div>
    </div>
  );
};

const TenantStatCard = ({ title, value, color, icon }) => {
  const colorClasses = {
    green: {
      bg: "bg-green-500/20",
      icon: "text-green-400",
      text: "text-green-400",
    },
    red: {
      bg: "bg-red-500/20",
      icon: "text-red-400",
      text: "text-red-400",
    },
    orange: {
      bg: "bg-orange-500/20",
      icon: "text-orange-400",
      text: "text-orange-400",
    },
    blue: {
      bg: "bg-blue-500/20",
      icon: "text-blue-400",
      text: "text-blue-400",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <span className={colors.icon}>{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className={`text-lg font-bold ${colors.text}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

const TenantActivityItem = ({ organization, action, amount, time, status }) => {
  const statusStyles = {
    paid: {
      dot: "bg-green-400",
      action: "text-green-400",
    },
    upgrade: {
      dot: "bg-blue-400",
      action: "text-blue-400",
    },
    overdue: {
      dot: "bg-red-400",
      action: "text-red-400",
    },
  };

  const style = statusStyles[status] || statusStyles.paid;

  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
      <div className={`w-2 h-2 ${style.dot} rounded-full`}></div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">{organization}</span>
          {amount && (
            <span className={`text-sm font-semibold ${style.action}`}>
              {amount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs ${style.action}`}>{action}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
