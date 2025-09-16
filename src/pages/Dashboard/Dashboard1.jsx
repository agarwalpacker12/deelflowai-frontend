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

const Dashboard = () => {
  // Chart data for Revenue & User Growth
  const chartData = [
    { month: "Jan", revenue: 180000, users: 12000 },
    { month: "Feb", revenue: 220000, users: 15000 },
    { month: "Mar", revenue: 280000, users: 18000 },
    { month: "Apr", revenue: 320000, users: 22000 },
    { month: "May", revenue: 380000, users: 28000 },
    { month: "Jun", revenue: 480000, users: 35000 },
  ];

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
            value="$2.4M"
            change="+12%"
            positive={true}
            trend="trending_up"
            subtitle="vs last month"
            color="blue"
          />
          <EnhancedStatCard
            icon={<Users className="w-6 h-6" />}
            title="Active Users"
            value="14,238"
            change="+8%"
            positive={true}
            trend="trending_up"
            subtitle="in pipeline"
            color="green"
          />
          <EnhancedStatCard
            icon={<ShoppingBag className="w-6 h-6" />}
            title="Properties Listed"
            value="3,847"
            change="+23%"
            positive={true}
            trend="trending_up"
            subtitle="this month"
            color="emerald"
          />
          <EnhancedStatCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="AI Conversations"
            value="48.2K"
            change="+5%"
            positive={true}
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
              value="47.8K"
              percentage="94%"
              color="blue"
            />
            <AIMetricCard
              icon={<Eye className="w-5 h-5" />}
              title="Vision Analysis"
              value="12.3K"
              percentage="97%"
              color="green"
            />
            <AIMetricCard
              icon={<Brain className="w-5 h-5" />}
              title="NLP Processing"
              value="124K"
              percentage="92%"
              color="purple"
            />
            <AIMetricCard
              icon={<Shield className="w-5 h-5" />}
              title="Blockchain Txns"
              value="847"
              percentage="100%"
              color="cyan"
            />
          </div>
        </div>

        {/* Tenant Management Overview */}
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

          {/* Tenant Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <TenantStatCard
              title="Active Tenants"
              value="8"
              color="green"
              icon={<CheckCircle className="w-4 h-4" />}
            />
            <TenantStatCard
              title="Payment Overdue"
              value="3"
              color="red"
              icon={<AlertTriangle className="w-4 h-4" />}
            />
            <TenantStatCard
              title="Suspended"
              value="1"
              color="orange"
              icon={<Eye className="w-4 h-4" />}
            />
            <TenantStatCard
              title="Monthly Revenue"
              value="$24.5K"
              color="blue"
              icon={<DollarSign className="w-4 h-4" />}
            />
          </div>

          {/* Recent Tenant Activity */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Recent Activity
            </h3>
            <TenantActivityItem
              organization="Dallas Wholesalers LLC"
              action="Payment received"
              amount="$4,850"
              time="2 hours ago"
              status="paid"
            />
            <TenantActivityItem
              organization="Texas Property Investors"
              action="Plan upgraded to Enterprise"
              amount=""
              time="5 hours ago"
              status="upgrade"
            />
            <TenantActivityItem
              organization="Austin Real Estate Co"
              action="Payment overdue"
              amount="$2,150"
              time="1 day ago"
              status="overdue"
            />
          </div>
        </div>

        {/* Opportunity Cost Analysis */}
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
              <div className="text-4xl font-bold mb-2">$2,847</div>
              <div className="text-sm opacity-90">
                Lost due diluted for full automation
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold">$19.9K</div>
                <div className="text-xs opacity-75">Potential</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">$85.4K</div>
                <div className="text-xs opacity-75">Current</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">$1.04M</div>
                <div className="text-xs opacity-75">Projected</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>51 OPTIMIZATION NEEDED</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs opacity-75 mb-1">
                Peaks at 3 months in automated renewal potential
              </div>
              <div className="text-xs opacity-75">
                ROI conversion efficiency: 67%
              </div>
            </div>
          </div>
        </div>

        {/* Additional Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <BusinessMetricCard
            title="Total Deals"
            value="47"
            change="12% from last month"
            positive={true}
            icon={<Target className="w-5 h-5" />}
            color="blue"
          />
          <BusinessMetricCard
            title="Monthly Profit"
            value="$127,500"
            change="28% from last month"
            positive={true}
            icon={<DollarSign className="w-5 h-5" />}
            color="green"
          />
          <BusinessMetricCard
            title="AI Accuracy"
            value="94.2%"
            change="2.1% improvement"
            positive={true}
            icon={<Brain className="w-5 h-5" />}
            color="purple"
          />
          <BusinessMetricCard
            title="Voice Calls"
            value="89"
            change="% today"
            positive={false}
            icon={<Phone className="w-5 h-5" />}
            color="orange"
            showTodayBadge={true}
          />
        </div>

        {/* Compliance Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              Compliance Status
            </h2>
            <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">96%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">All audits compliant</span>
          </div>
          <div className="mt-3 w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
              style={{ width: "96%" }}
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
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient
                    id="usersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.05} />
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Activity Feed - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Alerts & Opportunities */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">
                  Market Alerts & Opportunities
                </h3>
              </div>

              <div className="space-y-3">
                <AlertItem
                  icon={<Home className="w-4 h-4" />}
                  text="3 new distressed properties found in Dallas"
                  time="5 minutes ago"
                  type="success"
                />
                <AlertItem
                  icon={<FileText className="w-4 h-4" />}
                  text="New TX regulations effective next month"
                  time="1 hour ago"
                  type="warning"
                />
                <AlertItem
                  icon={<DollarSign className="w-4 h-4" />}
                  text="New lender offering 1.5% transactional funding"
                  time="2 hours ago"
                  type="info"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Activity Feed */}
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
                <ActivityItem
                  icon={<Phone className="w-4 h-4" />}
                  iconColor="text-orange-400"
                  iconBg="bg-orange-500/20"
                  title="Rachel W."
                  action="voice AI scheduled appointment"
                  time="Just now"
                  location="Atlanta, GA"
                />
                <ActivityItem
                  icon={<DollarSign className="w-4 h-4" />}
                  iconColor="text-green-400"
                  iconBg="bg-green-500/20"
                  title="David M."
                  action="completed double close in 18 hours"
                  time="Just now"
                  location="Miami, FL"
                />
                <ActivityItem
                  icon={<DollarSign className="w-4 h-4" />}
                  iconColor="text-green-400"
                  iconBg="bg-green-500/20"
                  title="David M."
                  action="completed double close in 18 hours"
                  time="Just now"
                  location="Miami, FL"
                />
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

// static dashboard for deelflow
