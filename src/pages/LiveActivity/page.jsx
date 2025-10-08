import { useState, useEffect } from "react";
import {
  Activity,
  Users,
  DollarSign,
  Brain,
  Lock,
  Phone,
  Eye,
  Briefcase,
  Clock,
  Search,
  RefreshCw,
  Target,
  Globe,
  ArrowUpRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

const LiveFeedPage = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "deal",
      user: "Sarah Martinez",
      action: "closed $47K assignment",
      location: "Dallas, TX",
      time: "2 min ago",
      value: 47000,
      avatar: "SM",
      priority: "high",
    },
    {
      id: 2,
      type: "ai",
      user: "AI System",
      action: "identified 12 hot leads with 95% accuracy",
      location: "Austin, TX",
      time: "5 min ago",
      score: 95,
      avatar: "AI",
      priority: "medium",
    },
    {
      id: 3,
      type: "blockchain",
      user: "Jennifer Lee",
      action: "deposited $15K blockchain escrow",
      location: "Houston, TX",
      time: "8 min ago",
      value: 15000,
      avatar: "JL",
      priority: "high",
    },
    {
      id: 4,
      type: "voice",
      user: "Voice AI",
      action: "completed 47 cold calls, 32 successful",
      location: "Phoenix, AZ",
      time: "12 min ago",
      success: 32,
      avatar: "VA",
      priority: "medium",
    },
    {
      id: 5,
      type: "vision",
      user: "Vision AI",
      action: "analyzed 23 properties with 94% accuracy",
      location: "Miami, FL",
      time: "15 min ago",
      accuracy: 94,
      avatar: "VI",
      priority: "low",
    },
  ]);

  const [stats, setStats] = useState([
    {
      label: "Active Users Now",
      value: "2,847",
      change: "+124",
      icon: Users,
      color: "blue",
    },
    {
      label: "Deals in Progress",
      value: "47",
      change: "+8",
      icon: Briefcase,
      color: "green",
    },
    {
      label: "Total in Escrow",
      value: "$12.4M",
      change: "+$1.2M",
      icon: Lock,
      color: "purple",
    },
    {
      label: "AI Accuracy",
      value: "94.7%",
      change: "+2.3%",
      icon: Brain,
      color: "orange",
    },
  ]);

  const [isLiveEnabled, setIsLiveEnabled] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveEnabled) return;

    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ["deal", "ai", "blockchain", "voice", "vision"][
          Math.floor(Math.random() * 5)
        ],
        user: [
          "Alex Thompson",
          "Maria Garcia",
          "David Chen",
          "Emma Wilson",
          "Carlos Rodriguez",
        ][Math.floor(Math.random() * 5)],
        action: [
          "completed new wholesale deal worth $34K",
          "AI found perfect buyer match",
          "blockchain transaction confirmed",
          "identified high-value lead",
          "closed assignment in record time",
        ][Math.floor(Math.random() * 5)],
        location: [
          "Miami, FL",
          "Seattle, WA",
          "Denver, CO",
          "Atlanta, GA",
          "Las Vegas, NV",
        ][Math.floor(Math.random() * 5)],
        time: "Just now",
        value: Math.floor(Math.random() * 50000) + 10000,
        avatar: ["AT", "MG", "DC", "EW", "CR"][Math.floor(Math.random() * 5)],
        priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 19)]);

      if (soundEnabled) {
        // Play notification sound (simulated)
        console.log("🔔 New activity notification");
      }
    }, Math.random() * 15000 + 5000);

    return () => clearInterval(interval);
  }, [isLiveEnabled, soundEnabled]);

  const getActivityIcon = (type) => {
    switch (type) {
      case "deal":
        return <DollarSign className="w-5 h-5" />;
      case "ai":
        return <Brain className="w-5 h-5" />;
      case "blockchain":
        return <Lock className="w-5 h-5" />;
      case "voice":
        return <Phone className="w-5 h-5" />;
      case "vision":
        return <Eye className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "deal":
        return "bg-green-100 text-green-600 border-green-200";
      case "ai":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "blockchain":
        return "bg-purple-100 text-purple-600 border-purple-200";
      case "voice":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "vision":
        return "bg-pink-100 text-pink-600 border-pink-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  const filteredActivities =
    selectedFilter === "all"
      ? activities
      : activities.filter((activity) => activity.type === selectedFilter);

  const getStatColor = (color) => {
    switch (color) {
      case "blue":
        return "text-blue-600 bg-blue-50";
      case "green":
        return "text-green-600 bg-green-50";
      case "purple":
        return "text-purple-600 bg-purple-50";
      case "orange":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Live Status Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">🔴 LIVE</span>
              </div>
              <span className="text-white">Real-time marketplace activity</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {activities.length} updates today
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                2,847 users online
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Live Activity Feed
              </h1>
              <p className="text-gray-400">
                Monitor real-time marketplace activity and performance metrics
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiveEnabled(!isLiveEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isLiveEnabled
                    ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                {isLiveEnabled ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isLiveEnabled ? "Pause Live" : "Resume Live"}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  // className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
                  className="bg-gradient-to-r from-blue-900 to-purple-500 rounded-xl shadow-sm p-6 border border-transparent hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${getStatColor(
                        stat.color
                      )} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-300 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-100">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls and Filters */}
        <div className="bg-purple-950 rounded-xl shadow-sm border border-purple-500 mb-6">
          <div className="p-6 border-b border-purple-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Activity Stream
              </h2>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    className="pl-10 pr-4 py-2 border border-purple-300 bg-purple-900 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-purple-300 bg-purple-900 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Activities</option>
                  <option value="deal">Deals</option>
                  <option value="ai">AI Actions</option>
                  <option value="blockchain">Blockchain</option>
                  <option value="voice">Voice AI</option>
                  <option value="vision">Vision AI</option>
                </select>

                <button className="p-2 text-gray-400 hover:text-gray-600 border border-purple-500 rounded-lg hover:bg-purple-300">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="divide-y divide-purple-800 max-h-[600px] overflow-y-auto">
            {filteredActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`p-4 hover:bg-purple-900 transition-all duration-300 border-l-4 ${getPriorityColor(
                  activity.priority
                )} ${
                  index === 0 && isLiveEnabled
                    ? "animate-pulse bg-purple-800/30"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full ${getActivityColor(
                        activity.type
                      )} border-2 flex items-center justify-center font-semibold text-sm`}
                    >
                      {activity.avatar}
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white mb-1">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          {activity.action}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-300 mb-2">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {activity.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </span>
                          {activity.value && (
                            <span className="flex items-center gap-1 font-medium text-green-600">
                              <DollarSign className="w-3 h-3" />$
                              {activity.value.toLocaleString()}
                            </span>
                          )}
                          {activity.score && (
                            <span className="flex items-center gap-1 font-medium text-blue-600">
                              <Target className="w-3 h-3" />
                              {activity.score}% accuracy
                            </span>
                          )}
                        </div>

                        {/* Activity Type Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getActivityColor(
                              activity.type
                            )}`}
                          >
                            {getActivityIcon(activity.type)}
                            {activity.type.toUpperCase()}
                          </span>

                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.priority === "high"
                                ? "bg-red-100 text-red-600"
                                : activity.priority === "medium"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {activity.priority} priority
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="ml-4 p-2 text-gray-400 hover:text-white hover:bg-purple-800 rounded-lg transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-300 text-sm">
          <p>
            Live feed updates every 5-25 seconds • Last update:{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveFeedPage;
