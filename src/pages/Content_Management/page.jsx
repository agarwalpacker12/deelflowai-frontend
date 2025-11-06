import { useState } from "react";
import {
  FileText,
  PenTool,
  Video,
  Mail,
  MessageSquare,
  Layout,
  Plus,
  Search,
  Eye,
  Edit,
  Copy,
  Share2,
  Calendar,
  TrendingUp,
  BarChart3,
  Star,
  Heart,
  ThumbsUp,
  Target,
  Folder,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

const ContentManagementPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedContent, setSelectedContent] = useState(null);
  const [contentType, setContentType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Sample content data
  const contentItems = [
    {
      id: 1,
      title: "Motivated Seller Email Campaign",
      type: "email",
      category: "Lead Generation",
      status: "published",
      performance: { opens: 847, clicks: 234, conversions: 67 },
      created: "2024-01-10",
      lastModified: "2024-01-12",
      author: "AI Assistant",
      thumbnail: "/api/placeholder/300/200",
      preview:
        "Hi {name}, Are you looking to sell your property quickly? We specialize in...",
      tags: ["seller", "motivated", "quick-sale"],
      engagement: 94,
    },
    {
      id: 2,
      title: "Social Media Property Showcase",
      type: "social",
      category: "Property Marketing",
      status: "draft",
      performance: { likes: 423, shares: 89, comments: 156 },
      created: "2024-01-11",
      lastModified: "2024-01-13",
      author: "Marketing Team",
      thumbnail: "/api/placeholder/300/200",
      preview:
        "🏠 STUNNING INVESTMENT OPPORTUNITY! This 3BR/2BA property in Dallas offers...",
      tags: ["social", "property", "investment"],
      engagement: 76,
    },
    {
      id: 3,
      title: "Investor Welcome Sequence",
      type: "email_sequence",
      category: "Onboarding",
      status: "active",
      performance: { opens: 1234, clicks: 567, conversions: 145 },
      created: "2024-01-05",
      lastModified: "2024-01-14",
      author: "AI Assistant",
      thumbnail: "/api/placeholder/300/200",
      preview:
        "Welcome to our exclusive investor network! You're about to discover...",
      tags: ["investor", "welcome", "sequence"],
      engagement: 89,
    },
  ];

  const templates = [
    {
      id: 1,
      name: "Seller Outreach Email",
      type: "email",
      description: "Professional email template for motivated seller leads",
      usage: 1247,
      conversion: 23.4,
      rating: 4.8,
      category: "Lead Generation",
    },
    {
      id: 2,
      name: "Social Media Property Post",
      type: "social",
      description: "Engaging social media content for property listings",
      usage: 634,
      conversion: 18.7,
      rating: 4.6,
      category: "Property Marketing",
    },
  ];

  const contentCalendar = [
    {
      date: "2024-01-15",
      content: "Weekly Market Update Email",
      type: "email",
      status: "scheduled",
    },
    {
      date: "2024-01-16",
      content: "Property Showcase - Instagram",
      type: "social",
      status: "draft",
    },
    {
      date: "2024-01-17",
      content: "Investor Newsletter",
      type: "email",
      status: "scheduled",
    },
  ];

  const tabs = [
    { id: "overview", label: "Content Overview", icon: BarChart3 },
    { id: "library", label: "Content Library", icon: Folder },
    { id: "templates", label: "Templates", icon: Layout },
    { id: "calendar", label: "Content Calendar", icon: Calendar },
    { id: "create", label: "Create Content", icon: PenTool },
    { id: "analytics", label: "Performance", icon: TrendingUp },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "in_review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "email_sequence":
        return <Mail className="w-4 h-4" />;
      case "social":
        return <Share2 className="w-4 h-4" />;
      case "sms":
        return <MessageSquare className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleCreateContent = (type) => {
    console.log("Creating content of type:", type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-purple-800/90 via-purple-700/90 to-indigo-800/90 backdrop-blur-sm border-b border-purple-600/30"> */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Content Management
              </h1>
              <p className="text-sm text-purple-200">
                Create, manage, and optimize marketing content across all
                channels
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">847</div>
              <div className="text-sm text-purple-200">Content Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">94.2%</div>
              <div className="text-sm text-purple-200">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">23.4%</div>
              <div className="text-sm text-purple-200">Conversion</div>
            </div>
          </div>
        </div>
        {/* </div> */}

        {/* Navigation Tabs */}
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-400 text-blue-300"
                      : "border-transparent text-purple-300 hover:text-white hover:border-purple-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">
                      Total Content
                    </p>
                    <p className="text-3xl font-bold text-white">847</p>
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +12% this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">
                      Published
                    </p>
                    <p className="text-3xl font-bold text-white">634</p>
                    <p className="text-sm text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Active content
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">
                      Avg Engagement
                    </p>
                    <p className="text-3xl font-bold text-white">84.3%</p>
                    <p className="text-sm text-pink-400 flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      Above average
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-200">
                      Conversion Rate
                    </p>
                    <p className="text-3xl font-bold text-white">23.4%</p>
                    <p className="text-sm text-green-400 flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      High converting
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30">
              <div className="p-6 border-b border-purple-600/30">
                <h3 className="text-lg font-semibold text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      action: "Published",
                      item: "Seller Outreach Email Campaign",
                      time: "2 minutes ago",
                      user: "AI Assistant",
                    },
                    {
                      action: "Updated",
                      item: "Social Media Property Showcase",
                      time: "15 minutes ago",
                      user: "Marketing Team",
                    },
                    {
                      action: "Created",
                      item: "SMS Follow-up Templates",
                      time: "1 hour ago",
                      user: "AI Assistant",
                    },
                    {
                      action: "Scheduled",
                      item: "Weekly Market Update",
                      time: "3 hours ago",
                      user: "Content Manager",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-700/50 to-indigo-800/50 rounded-lg border border-purple-600/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-white">
                            <span className="text-blue-400">
                              {activity.action}
                            </span>{" "}
                            {activity.item}
                          </div>
                          <div className="text-xs text-purple-200">
                            {activity.time} by {activity.user}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">
                    Create Email Campaign
                  </h3>
                </div>
                <p className="text-sm text-purple-200 mb-4">
                  Generate AI-powered email campaigns for lead generation
                </p>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all shadow-lg">
                  Create Now
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">
                    Social Media Content
                  </h3>
                </div>
                <p className="text-sm text-purple-200 mb-4">
                  Create engaging social media posts for property marketing
                </p>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg">
                  Generate Post
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">
                    Performance Report
                  </h3>
                </div>
                <p className="text-sm text-purple-200 mb-4">
                  Analyze content performance and optimization opportunities
                </p>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "library" && (
          <div className="space-y-6">
            {/* Library Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Content Library
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-300" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    className="bg-purple-800/50 border border-purple-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder-purple-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="bg-purple-800/50 border border-purple-600/50 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="email">Email</option>
                  <option value="social">Social Media</option>
                  <option value="sms">SMS</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                </select>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Content
                </button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {contentItems
                .filter(
                  (item) =>
                    contentType === "all" || item.type.includes(contentType)
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="relative">
                      <img
                        // src={item.thumbnail}
                        src={`/images/${item.title}.jpg`}
                        alt={item.title}
                        className="w-full h-32 object-fill"
                      />
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1 bg-purple-900/90 backdrop-blur-sm rounded-full px-2 py-1 border border-purple-600/50">
                          {getTypeIcon(item.type)}
                          <span className="text-xs font-medium capitalize text-white">
                            {item.type.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm leading-tight text-white">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <Star className="w-3 h-3" />
                          {item.engagement}%
                        </div>
                      </div>

                      <p className="text-xs text-purple-200 mb-3 line-clamp-2">
                        {item.preview}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-700/50 text-purple-200 text-xs rounded-full border border-purple-600/30"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-purple-600/30">
                        <div className="text-xs text-purple-300">
                          {new Date(item.lastModified).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-purple-300 hover:text-blue-400 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-purple-300 hover:text-green-400 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-purple-300 hover:text-purple-400 transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-purple-300 hover:text-orange-400 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="space-y-6">
            {/* Templates Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Content Templates
              </h2>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            </div>

            {/* Template Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Email Marketing",
                  count: 23,
                  icon: Mail,
                  color: "bg-gradient-to-br from-blue-500 to-blue-600",
                },
                {
                  name: "Social Media",
                  count: 18,
                  icon: Share2,
                  color: "bg-gradient-to-br from-green-500 to-green-600",
                },
                {
                  name: "SMS Campaigns",
                  count: 12,
                  icon: MessageSquare,
                  color: "bg-gradient-to-br from-purple-500 to-purple-600",
                },
                {
                  name: "Documents",
                  count: 8,
                  icon: FileText,
                  color: "bg-gradient-to-br from-orange-500 to-orange-600",
                },
              ].map((category, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6 cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${category.color}`}
                    >
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {category.name}
                      </h3>
                      <p className="text-sm text-purple-200">
                        {category.count} templates
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Templates */}
            <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30">
              <div className="p-6 border-b border-purple-600/30">
                <h3 className="text-lg font-semibold text-white">
                  Featured Templates
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-purple-600/30 rounded-lg p-4 bg-gradient-to-r from-purple-700/30 to-indigo-800/30"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            {getTypeIcon(template.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">
                              {template.name}
                            </h4>
                            <p className="text-sm text-purple-200">
                              {template.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-purple-200">
                            {template.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-purple-200 mb-4">
                        {template.description}
                      </p>

                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-purple-300">
                          Used {template.usage.toLocaleString()} times
                        </span>
                        <span className="text-green-400 font-medium">
                          {template.conversion}% conversion
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg text-sm">
                          Use Template
                        </button>
                        <button className="px-4 py-2 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/30 transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/30 transition-all">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Content Calendar
              </h2>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/30 transition-all">
                  This Week
                </button>
                <button className="px-4 py-2 border border-purple-600/50 text-purple-200 rounded-lg hover:bg-purple-700/30 transition-all">
                  This Month
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Schedule Content
                </button>
              </div>
            </div>

            {/* Upcoming Content */}
            <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30">
              <div className="p-6 border-b border-purple-600/30">
                <h3 className="text-lg font-semibold text-white">
                  Upcoming Scheduled Content
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {contentCalendar.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-purple-600/30 rounded-lg bg-gradient-to-r from-purple-700/30 to-indigo-800/30 hover:from-purple-600/30 hover:to-indigo-700/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-purple-400">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </div>
                          <div className="text-lg font-bold text-white">
                            {new Date(item.date).getDate()}
                          </div>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {item.content}
                          </h4>
                          <p className="text-sm text-purple-200 capitalize">
                            {item.type} •{" "}
                            {new Date(item.date).toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status.replace("_", " ")}
                        </span>
                        <button className="p-2 text-purple-300 hover:text-blue-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "create" && (
          <div className="space-y-6">
            {/* Create Content Header */}
            <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
              <h2 className="text-xl font-semibold mb-2 text-white">
                Create New Content
              </h2>
              <p className="text-purple-200">
                Choose a content type to get started with AI-powered content
                generation
              </p>
            </div>

            {/* Content Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  type: "email",
                  title: "Email Campaign",
                  description:
                    "Create targeted email campaigns for lead generation and nurturing",
                  icon: Mail,
                  color: "bg-gradient-to-br from-blue-500 to-blue-600",
                  features: [
                    "AI subject lines",
                    "Personalization",
                    "A/B testing",
                  ],
                },
                {
                  type: "social",
                  title: "Social Media Post",
                  description:
                    "Generate engaging content for Facebook, Instagram, and Twitter",
                  icon: Share2,
                  color: "bg-gradient-to-br from-green-500 to-green-600",
                  features: [
                    "Auto hashtags",
                    "Image suggestions",
                    "Multi-platform",
                  ],
                },
                {
                  type: "sms",
                  title: "SMS Campaign",
                  description: "Create short, impactful text message campaigns",
                  icon: MessageSquare,
                  color: "bg-gradient-to-br from-purple-500 to-purple-600",
                  features: [
                    "Character optimization",
                    "Link tracking",
                    "Automation",
                  ],
                },
              ].map((contentType, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => handleCreateContent(contentType.type)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 ${contentType.color} rounded-lg flex items-center justify-center shadow-lg`}
                    >
                      <contentType.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {contentType.title}
                      </h3>
                      <p className="text-sm text-purple-200">
                        {contentType.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {contentType.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-purple-200 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create {contentType.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Analytics Header */}
            <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
              <h2 className="text-xl font-semibold mb-2 text-white">
                Content Performance Analytics
              </h2>
              <p className="text-purple-200">
                Track engagement, conversions, and ROI across all content types
              </p>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-green-400">+24.3%</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">847.2K</div>
                <div className="text-sm text-purple-200">Total Views</div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                    <ThumbsUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-green-400">+18.7%</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">94.3%</div>
                <div className="text-sm text-purple-200">Engagement Rate</div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-green-400">+31.2%</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">23.4%</div>
                <div className="text-sm text-purple-200">Conversion Rate</div>
              </div>

              <div className="bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-600/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-green-400">+42.1%</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">$47.2K</div>
                <div className="text-sm text-purple-200">Revenue Generated</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagementPage;
