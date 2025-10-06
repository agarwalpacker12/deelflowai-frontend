import { useState } from "react";
import {
  Crown,
  Shield,
  Globe,
  Zap,
  Settings,
  BarChart3,
  Lock,
  Wallet,
  Code,
  Brain,
  Rocket,
  ChevronRight,
  Eye,
  TrendingUp,
  CheckCircle,
  Activity,
  Timer,
  FileText,
} from "lucide-react";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";

const AdvancedPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Advanced features data
  const advancedFeatures = [
    {
      id: "white-label",
      title: "White-Label System",
      description: "Complete multi-tenant architecture with custom branding",
      icon: Crown,
      category: "Enterprise",
      status: "Active",
      badge: "ENTERPRISE",
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      features: [
        "Custom domain management",
        "Full brand customization",
        "Multi-tenant database",
        "Revenue tracking per tenant",
        "Feature flag controls",
        "Domain & subdomain management",
      ],
      metrics: {
        tenants: 12,
        revenue: "$47.2K",
        users: 1247,
        uptime: "99.9%",
      },
    },
    {
      id: "rbac",
      title: "RBAC & Permissions",
      description: "Role-based access control with granular permissions",
      icon: Shield,
      category: "Security",
      status: "Active",
      badge: "SECURE",
      badgeColor: "bg-gradient-to-r from-green-500 to-blue-500",
      features: [
        "Super Admin controls",
        "Tenant Admin management",
        "User role hierarchies",
        "Permission matrices",
        "Audit trail logging",
        "Compliance monitoring",
      ],
      metrics: {
        roles: 8,
        permissions: 147,
        users: 892,
        violations: 0,
      },
    },
    {
      id: "blockchain",
      title: "Blockchain Integration",
      description: "Smart contracts and cryptocurrency escrow system",
      icon: Lock,
      category: "Blockchain",
      status: "Active",
      badge: "WEB3",
      badgeColor: "bg-gradient-to-r from-orange-500 to-red-500",
      features: [
        "Multi-signature contracts",
        "Instant escrow deposits",
        "Crypto wallet integration",
        "Smart contract automation",
        "IPFS document storage",
        "KYC/AML compliance",
      ],
      metrics: {
        contracts: 847,
        escrow: "$2.4M",
        transactions: 1573,
        success: "100%",
      },
    },
    {
      id: "api-marketplace",
      title: "API Marketplace",
      description: "Custom AI models and third-party integrations",
      icon: Code,
      category: "Development",
      status: "Beta",
      badge: "API",
      badgeColor: "bg-gradient-to-r from-blue-500 to-purple-500",
      features: [
        "RESTful API endpoints",
        "GraphQL support",
        "WebSocket connections",
        "Custom AI model training",
        "Third-party integrations",
        "Developer documentation",
      ],
      metrics: {
        endpoints: 247,
        requests: "1.2M",
        integrations: 34,
        latency: "45ms",
      },
    },
    {
      id: "advanced-analytics",
      title: "Advanced Analytics",
      description: "AI-powered business intelligence and predictive insights",
      icon: BarChart3,
      category: "Analytics",
      status: "Active",
      badge: "AI POWERED",
      badgeColor: "bg-gradient-to-r from-cyan-500 to-blue-500",
      features: [
        "Predictive analytics",
        "Conversion funnel analysis",
        "Revenue forecasting",
        "Market trend analysis",
        "Performance benchmarking",
        "Real-time dashboards",
      ],
      metrics: {
        insights: 2847,
        accuracy: "94.2%",
        predictions: 892,
        reports: 156,
      },
    },
    {
      id: "compliance-suite",
      title: "Compliance Suite",
      description: "State-specific legal compliance and risk management",
      icon: Shield,
      category: "Legal",
      status: "Active",
      badge: "COMPLIANT",
      badgeColor: "bg-gradient-to-r from-green-500 to-teal-500",
      features: [
        "State-specific automation",
        "Risk scoring system",
        "Audit trail maintenance",
        "Regulatory monitoring",
        "Document compliance",
        "Legal template library",
      ],
      metrics: {
        states: 50,
        compliance: "98.7%",
        audits: 423,
        violations: 2,
      },
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "white-label", label: "White-Label", icon: Crown },
    { id: "blockchain", label: "Blockchain", icon: Lock },
    { id: "api", label: "API Hub", icon: Code },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "Beta":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "Coming Soon":
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
    }
  };

  const FeatureCard = ({ feature }) => {
    const IconComponent = feature.icon;

    return (
      <div
        className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30 hover:border-purple-500/50 transition-all cursor-pointer transform hover:scale-105"
        onClick={() => setSelectedFeature(feature)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-purple-200 text-sm">{feature.category}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold text-white ${feature.badgeColor}`}
            >
              {feature.badge}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                feature.status
              )}`}
            >
              {feature.status}
            </span>
          </div>
        </div>

        <p className="text-purple-100 mb-4">{feature.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {Object.entries(feature.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-lg font-bold text-white">{value}</div>
              <div className="text-purple-200 text-xs capitalize">{key}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-purple-300 text-sm">
            <Activity className="w-4 h-4" />
            <span>Last updated: 2 hrs ago</span>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-300" />
        </div>
      </div>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-purple-200 font-medium">Enterprise</span>
          </div>
          <div className="text-2xl font-bold text-white">12</div>
          <div className="text-purple-200 text-sm">Active Tenants</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-green-400" />
            <span className="text-purple-200 font-medium">Security</span>
          </div>
          <div className="text-2xl font-bold text-white">99.9%</div>
          <div className="text-purple-200 text-sm">Compliance Score</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-6 h-6 text-orange-400" />
            <span className="text-purple-200 font-medium">Blockchain</span>
          </div>
          <div className="text-2xl font-bold text-white">$2.4M</div>
          <div className="text-purple-200 text-sm">In Escrow</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Code className="w-6 h-6 text-blue-400" />
            <span className="text-purple-200 font-medium">API</span>
          </div>
          <div className="text-2xl font-bold text-white">1.2M</div>
          <div className="text-purple-200 text-sm">Monthly Requests</div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {advancedFeatures.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>

      {/* System Health */}
      <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
        <h3 className="text-xl font-bold text-white mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white">All Systems Operational</span>
          </div>
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-blue-400" />
            <span className="text-purple-200">Uptime: 99.98%</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-purple-200">Response: 45ms avg</span>
          </div>
        </div>
      </div>
    </div>
  );

  const WhiteLabelTab = () => (
    <div className="space-y-6">
      {/* Tenant Management */}
      <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Tenant Management</h3>
          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Create Tenant
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {[
            {
              name: "RealtyPro AI",
              domain: "realtypro.com",
              plan: "Enterprise",
              users: 127,
              revenue: "$12.5K",
              status: "Active",
            },
            {
              name: "WholesaleHub",
              domain: "wholesalehub.io",
              plan: "Professional",
              users: 89,
              revenue: "$8.2K",
              status: "Active",
            },
            {
              name: "InvestorEdge",
              domain: "investoredge.net",
              plan: "White Label",
              users: 234,
              revenue: "$18.7K",
              status: "Active",
            },
          ].map((tenant, index) => (
            <div key={index} className="bg-purple-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{tenant.name}</h4>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30">
                  {tenant.status}
                </span>
              </div>
              <p className="text-purple-200 text-sm mb-2">{tenant.domain}</p>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">{tenant.users} users</span>
                <span className="text-green-400 font-semibold">
                  {tenant.revenue}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 bg-purple-600/50 hover:bg-purple-600/70 text-white py-1 px-2 rounded text-sm">
                  Configure
                </button>
                <button className="flex-1 bg-blue-600/50 hover:bg-blue-600/70 text-white py-1 px-2 rounded text-sm">
                  Analytics
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Branding Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-700/30 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">Branding Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="text-purple-200 text-sm">Primary Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 bg-blue-500 rounded border-2 border-white"></div>
                  <input
                    type="text"
                    value="#2563eb"
                    className="bg-purple-900/50 border border-purple-600/50 rounded px-2 py-1 text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-purple-200 text-sm">Company Logo</label>
                <button className="w-full mt-1 border-2 border-dashed border-purple-500/50 rounded-xl p-4 text-purple-300 hover:border-purple-400/70 transition-colors">
                  <Crown className="w-8 h-8 mx-auto mb-2" />
                  Upload Logo
                </button>
              </div>
            </div>
          </div>

          <div className="bg-purple-700/30 rounded-xl p-4">
            <h4 className="font-semibold text-white mb-3">Feature Controls</h4>
            <div className="space-y-3">
              {[
                "AI Features",
                "Blockchain Escrow",
                "Voice AI",
                "Advanced Analytics",
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">{feature}</span>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BlockchainTab = () => (
    <div className="space-y-6">
      {/* Blockchain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-6 h-6 text-orange-400" />
            <span className="text-purple-200 font-medium">Smart Contracts</span>
          </div>
          <div className="text-2xl font-bold text-white">847</div>
          <div className="text-green-400 text-sm">+23 today</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-6 h-6 text-green-400" />
            <span className="text-purple-200 font-medium">Total Escrow</span>
          </div>
          <div className="text-2xl font-bold text-white">$2.4M</div>
          <div className="text-green-400 text-sm">+$45K today</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-blue-400" />
            <span className="text-purple-200 font-medium">Transactions</span>
          </div>
          <div className="text-2xl font-bold text-white">1,573</div>
          <div className="text-green-400 text-sm">100% success</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <span className="text-purple-200 font-medium">Security</span>
          </div>
          <div className="text-2xl font-bold text-white">256-bit</div>
          <div className="text-green-400 text-sm">Encrypted</div>
        </div>
      </div>

      {/* Active Smart Contracts */}
      <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Active Smart Contracts
          </h3>
          <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Deploy Contract
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-600/30">
                <th className="text-left py-3 text-purple-200 font-medium">
                  Contract ID
                </th>
                <th className="text-left py-3 text-purple-200 font-medium">
                  Property
                </th>
                <th className="text-left py-3 text-purple-200 font-medium">
                  Escrow Amount
                </th>
                <th className="text-left py-3 text-purple-200 font-medium">
                  Status
                </th>
                <th className="text-left py-3 text-purple-200 font-medium">
                  Participants
                </th>
                <th className="text-left py-3 text-purple-200 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "0x1a2b3c",
                  property: "123 Main St, Atlanta",
                  amount: "$85,000",
                  status: "Active",
                  participants: 3,
                },
                {
                  id: "0x4d5e6f",
                  property: "456 Oak Ave, Miami",
                  amount: "$120,000",
                  status: "Pending",
                  participants: 2,
                },
                {
                  id: "0x7g8h9i",
                  property: "789 Pine Rd, Dallas",
                  amount: "$95,000",
                  status: "Completed",
                  participants: 4,
                },
              ].map((contract, index) => (
                <tr
                  key={index}
                  className="border-b border-purple-600/20 hover:bg-purple-700/20"
                >
                  <td className="py-4 text-white font-mono text-sm">
                    {contract.id}
                  </td>
                  <td className="py-4 text-white">{contract.property}</td>
                  <td className="py-4 text-green-400 font-semibold">
                    {contract.amount}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        contract.status === "Active"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : contract.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {contract.status}
                    </span>
                  </td>
                  <td className="py-4 text-purple-200">
                    {contract.participants} parties
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-purple-300 hover:text-white hover:bg-purple-600/50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-purple-300 hover:text-white hover:bg-purple-600/50 rounded">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet Integration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <h4 className="text-lg font-bold text-white mb-4">
            Supported Wallets
          </h4>
          <div className="space-y-3">
            {["MetaMask", "Coinbase Wallet", "WalletConnect", "Ledger"].map(
              (wallet, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-purple-700/30 rounded-xl p-3"
                >
                  <span className="text-white">{wallet}</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <h4 className="text-lg font-bold text-white mb-4">
            Network Settings
          </h4>
          <div className="space-y-4">
            <div>
              <label className="text-purple-200 text-sm">Default Network</label>
              <select className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white">
                <option>Ethereum Mainnet</option>
                <option>Polygon</option>
                <option>BSC</option>
              </select>
            </div>
            <div>
              <label className="text-purple-200 text-sm">
                Gas Price (Gwei)
              </label>
              <input
                type="number"
                value="20"
                className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ApiHubTab = () => (
    <div className="space-y-6">
      {/* API Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Code className="w-6 h-6 text-blue-400" />
            <span className="text-purple-200 font-medium">Endpoints</span>
          </div>
          <div className="text-2xl font-bold text-white">247</div>
          <div className="text-green-400 text-sm">+5 this week</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-green-400" />
            <span className="text-purple-200 font-medium">Requests/Month</span>
          </div>
          <div className="text-2xl font-bold text-white">1.2M</div>
          <div className="text-green-400 text-sm">+15% growth</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Timer className="w-6 h-6 text-yellow-400" />
            <span className="text-purple-200 font-medium">Avg Latency</span>
          </div>
          <div className="text-2xl font-bold text-white">45ms</div>
          <div className="text-green-400 text-sm">-5ms improved</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-6 h-6 text-purple-400" />
            <span className="text-purple-200 font-medium">Integrations</span>
          </div>
          <div className="text-2xl font-bold text-white">34</div>
          <div className="text-green-400 text-sm">Active partners</div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">API Endpoints</h3>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Code className="w-4 h-4" />
            Create Endpoint
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              method: "POST",
              endpoint: "/api/v1/properties/analyze",
              description: "AI property analysis",
              requests: "45.2K",
            },
            {
              method: "GET",
              endpoint: "/api/v1/leads/score",
              description: "Lead scoring algorithm",
              requests: "32.1K",
            },
            {
              method: "POST",
              endpoint: "/api/v1/contracts/create",
              description: "Smart contract deployment",
              requests: "8.7K",
            },
            {
              method: "GET",
              endpoint: "/api/v1/analytics/dashboard",
              description: "Dashboard metrics",
              requests: "67.3K",
            },
          ].map((api, index) => (
            <div key={index} className="bg-purple-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    api.method === "GET"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {api.method}
                </span>
                <code className="text-purple-100 font-mono text-sm">
                  {api.endpoint}
                </code>
              </div>
              <p className="text-purple-200 text-sm mb-2">{api.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-semibold">
                  {api.requests} requests
                </span>
                <div className="flex gap-2">
                  <button className="text-purple-300 hover:text-white p-1">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-purple-300 hover:text-white p-1">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Partners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <h4 className="text-lg font-bold text-white mb-4">
            Active Integrations
          </h4>
          <div className="space-y-3">
            {[
              { name: "Zapier", status: "Connected", requests: "12.5K" },
              { name: "Salesforce", status: "Connected", requests: "8.2K" },
              { name: "HubSpot", status: "Pending", requests: "0" },
              { name: "Mailchimp", status: "Connected", requests: "5.7K" },
            ].map((integration, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-purple-700/30 rounded-xl p-3"
              >
                <div>
                  <span className="text-white font-medium">
                    {integration.name}
                  </span>
                  <p className="text-purple-200 text-xs">
                    {integration.requests} requests
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    integration.status === "Connected"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <h4 className="text-lg font-bold text-white mb-4">API Keys</h4>
          <div className="space-y-4">
            <div>
              <label className="text-purple-200 text-sm">Production Key</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="password"
                  value="pk_live_..."
                  className="flex-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white"
                />
                <button className="bg-purple-600/50 hover:bg-purple-600/70 px-3 py-2 rounded-xl text-white">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-purple-200 text-sm">Test Key</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="password"
                  value="pk_test_..."
                  className="flex-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white"
                />
                <button className="bg-purple-600/50 hover:bg-purple-600/70 px-3 py-2 rounded-xl text-white">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 rounded-xl">
              Generate New Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-6 h-6 text-purple-400" />
            <span className="text-purple-200 font-medium">AI Insights</span>
          </div>
          <div className="text-2xl font-bold text-white">2,847</div>
          <div className="text-green-400 text-sm">+47 today</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <span className="text-purple-200 font-medium">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-white">94.2%</div>
          <div className="text-green-400 text-sm">+1.3% this month</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span className="text-purple-200 font-medium">Predictions</span>
          </div>
          <div className="text-2xl font-bold text-white">892</div>
          <div className="text-green-400 text-sm">87% accurate</div>
        </div>

        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-orange-400" />
            <span className="text-purple-200 font-medium">Reports</span>
          </div>
          <div className="text-2xl font-bold text-white">156</div>
          <div className="text-green-400 text-sm">23 this week</div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <h4 className="text-lg font-bold text-white mb-4">
            Conversion Funnel
          </h4>
          <div className="space-y-3">
            {[
              {
                stage: "Leads Generated",
                count: "2,847",
                percentage: "100%",
                color: "bg-blue-500",
              },
              {
                stage: "Qualified Leads",
                count: "1,987",
                percentage: "69.8%",
                color: "bg-green-500",
              },
              {
                stage: "Appointments Set",
                count: "892",
                percentage: "31.3%",
                color: "bg-yellow-500",
              },
              {
                stage: "Deals Closed",
                count: "234",
                percentage: "8.2%",
                color: "bg-purple-500",
              },
            ].map((stage, index) => (
              <div key={index} className="bg-purple-700/30 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{stage.stage}</span>
                  <span className="text-purple-200">{stage.percentage}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-purple-900/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stage.color}`}
                      style={{ width: stage.percentage }}
                    ></div>
                  </div>
                  <span className="text-white font-semibold">
                    {stage.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
          <h4 className="text-lg font-bold text-white mb-4">
            Revenue Breakdown
          </h4>
          <div className="space-y-4">
            {[
              {
                source: "Subscription Revenue",
                amount: "$47.2K",
                percentage: "68%",
              },
              {
                source: "Transaction Fees",
                amount: "$18.5K",
                percentage: "27%",
              },
              { source: "API Usage", amount: "$3.8K", percentage: "5%" },
            ].map((revenue, index) => (
              <div key={index} className="bg-purple-700/30 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-white font-medium">
                      {revenue.source}
                    </span>
                    <p className="text-green-400 font-semibold">
                      {revenue.amount}
                    </p>
                  </div>
                  <span className="text-purple-200">{revenue.percentage}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-purple-700/30 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">Total Revenue</span>
              <span className="text-green-400 font-bold text-xl">$69.5K</span>
            </div>
            <p className="text-green-400 text-sm mt-1">+23% from last month</p>
          </div>
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
        <h4 className="text-lg font-bold text-white mb-4">
          AI Performance Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { metric: "Lead Scoring Accuracy", value: "94.2%", trend: "+1.3%" },
            {
              metric: "Property Analysis Speed",
              value: "2.3s",
              trend: "-0.4s",
            },
            { metric: "Conversion Prediction", value: "87.5%", trend: "+2.1%" },
            { metric: "Voice AI Recognition", value: "96.8%", trend: "+0.7%" },
          ].map((metric, index) => (
            <div
              key={index}
              className="bg-purple-700/30 rounded-xl p-4 text-center"
            >
              <p className="text-purple-200 text-sm mb-1">{metric.metric}</p>
              <p className="text-white font-bold text-lg">{metric.value}</p>
              <p className="text-green-400 text-xs">{metric.trend}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      {/* System Configuration */}
      <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
        <h3 className="text-xl font-bold text-white mb-6">
          System Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-purple-200 text-sm font-medium">
                System Name
              </label>
              <input
                type="text"
                value="DealFlow AI Enterprise"
                className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-purple-200 text-sm font-medium">
                Default Timezone
              </label>
              <select className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC+0 (GMT)</option>
              </select>
            </div>
            <div>
              <label className="text-purple-200 text-sm font-medium">
                Maintenance Mode
              </label>
              <div className="flex items-center justify-between mt-2 bg-purple-700/30 rounded-xl p-3">
                <span className="text-white">Enable Maintenance Mode</span>
                <div className="w-10 h-6 bg-gray-500 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-purple-200 text-sm font-medium">
                Max Users Per Tenant
              </label>
              <input
                type="number"
                value="500"
                className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-purple-200 text-sm font-medium">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value="60"
                className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-purple-200 text-sm font-medium">
                Auto-backup Frequency
              </label>
              <select className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white">
                <option>Every 6 hours</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
        <h4 className="text-lg font-bold text-white mb-4">Security Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-purple-700/30 rounded-xl p-3">
              <div>
                <span className="text-white font-medium">
                  Two-Factor Authentication
                </span>
                <p className="text-purple-200 text-xs">
                  Required for all admin accounts
                </p>
              </div>
              <div className="w-10 h-6 bg-green-500 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-purple-700/30 rounded-xl p-3">
              <div>
                <span className="text-white font-medium">IP Whitelisting</span>
                <p className="text-purple-200 text-xs">
                  Restrict access by IP address
                </p>
              </div>
              <div className="w-10 h-6 bg-green-500 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-purple-700/30 rounded-xl p-3">
              <div>
                <span className="text-white font-medium">Audit Logging</span>
                <p className="text-purple-200 text-xs">
                  Log all system activities
                </p>
              </div>
              <div className="w-10 h-6 bg-green-500 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-purple-200 text-sm font-medium">
                Password Policy
              </label>
              <select className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white">
                <option>Strong (12+ chars, symbols)</option>
                <option>Medium (8+ chars)</option>
                <option>Basic (6+ chars)</option>
              </select>
            </div>
            <div>
              <label className="text-purple-200 text-sm font-medium">
                Login Attempts Limit
              </label>
              <input
                type="number"
                value="5"
                className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-purple-200 text-sm font-medium">
                Encryption Level
              </label>
              <select className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white">
                <option>AES-256</option>
                <option>AES-128</option>
                <option>RSA-2048</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
        <h4 className="text-lg font-bold text-white mb-4">
          Notification Preferences
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {[
              "System Alerts",
              "Security Warnings",
              "Tenant Updates",
              "Performance Reports",
            ].map((notification, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-purple-700/30 rounded-xl p-3"
              >
                <span className="text-white">{notification}</span>
                <div className="w-10 h-6 bg-green-500 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-purple-200 text-sm font-medium">
                Email Recipients
              </label>
              <textarea
                className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white h-20"
                placeholder="admin@dealflow.ai, security@dealflow.ai"
              ></textarea>
            </div>
            <div>
              <label className="text-purple-200 text-sm font-medium">
                Notification Frequency
              </label>
              <select className="w-full mt-1 bg-purple-900/50 border border-purple-600/50 rounded-xl px-3 py-2 text-white">
                <option>Immediate</option>
                <option>Hourly Digest</option>
                <option>Daily Summary</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "white-label":
        return <WhiteLabelTab />;
      case "blockchain":
        return <BlockchainTab />;
      case "api":
        return <ApiHubTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <MainContentWrapper>
      {/* Header */}
      {/* <div className="bg-purple-800/30 backdrop-blur-sm border-b border-purple-600/30"> */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Advanced Features
                </h1>
                <p className="text-purple-200">
                  Enterprise-grade capabilities and integrations
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-green-500/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">
                  All Systems Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}

      <div className="p-4">
        {/* Navigation Tabs */}
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-2 border border-purple-600/30 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                      : "text-purple-200 hover:text-white hover:bg-purple-600/50"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Feature Detail Modal */}
        {selectedFeature && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900/95 to-purple-800/95 backdrop-blur-xl rounded-lg max-w-2xl w-full border border-purple-600/30">
              <div className="p-6 border-b border-purple-600/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <selectedFeature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {selectedFeature.title}
                      </h3>
                      <p className="text-purple-200">
                        {selectedFeature.category}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="text-purple-300 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-purple-100 mb-6">
                  {selectedFeature.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(selectedFeature.metrics).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="bg-purple-800/30 rounded-xl p-4 text-center"
                      >
                        <div className="text-xl font-bold text-white">
                          {value}
                        </div>
                        <div className="text-purple-200 text-sm capitalize">
                          {key}
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">
                    Key Features:
                  </h4>
                  {selectedFeature.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-purple-100">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                  <button className="bg-purple-700/50 hover:bg-purple-600/70 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainContentWrapper>
  );
};

export default AdvancedPage;
