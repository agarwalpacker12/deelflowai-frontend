import { useState } from "react";
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  User,
  Building,
  TrendingUp,
  Eye,
  MoreVertical,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);

  // Sample client data
  const clients = [
    {
      id: 1,
      name: "Sarah Johnson",
      type: "Investor",
      email: "sarah.johnson@email.com",
      phone: "(555) 234-5678",
      location: "Atlanta, GA",
      status: "Active",
      aiScore: 92,
      totalInvested: "$450,000",
      propertiesOwned: 12,
      lastActivity: "2 hours ago",
      avatar: "SJ",
      tags: ["High Value", "Repeat Buyer"],
      preferredAreas: ["Downtown", "Midtown"],
      budget: "$50k - $100k",
    },
    {
      id: 2,
      name: "Marcus Williams",
      type: "Seller",
      email: "marcus.w@gmail.com",
      phone: "(555) 345-6789",
      location: "Birmingham, AL",
      status: "Hot Lead",
      aiScore: 87,
      totalInvested: "$0",
      propertiesOwned: 1,
      lastActivity: "15 mins ago",
      avatar: "MW",
      tags: ["Motivated", "Cash Needed"],
      preferredAreas: ["Southside"],
      budget: "N/A",
    },
    {
      id: 3,
      name: "Jennifer Davis",
      type: "Wholesaler",
      email: "jen.davis@realty.com",
      phone: "(555) 456-7890",
      location: "Nashville, TN",
      status: "Active",
      aiScore: 95,
      totalInvested: "$1,200,000",
      propertiesOwned: 28,
      lastActivity: "1 hour ago",
      avatar: "JD",
      tags: ["Top Producer", "Mentor"],
      preferredAreas: ["Music City", "The Gulch"],
      budget: "$25k - $150k",
    },
    {
      id: 4,
      name: "Robert Chen",
      type: "Funder",
      email: "r.chen@funding.com",
      phone: "(555) 567-8901",
      location: "Miami, FL",
      status: "Active",
      aiScore: 98,
      totalInvested: "$3,500,000",
      propertiesOwned: 0,
      lastActivity: "30 mins ago",
      avatar: "RC",
      tags: ["Hard Money", "Quick Close"],
      preferredAreas: ["All Markets"],
      budget: "$500k - $5M",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      type: "Investor",
      email: "lisa.t@investments.com",
      phone: "(555) 678-9012",
      location: "Charlotte, NC",
      status: "Warm",
      aiScore: 78,
      totalInvested: "$280,000",
      propertiesOwned: 7,
      lastActivity: "4 hours ago",
      avatar: "LT",
      tags: ["Fix & Flip", "Buy & Hold"],
      preferredAreas: ["South End", "NoDa"],
      budget: "$30k - $80k",
    },
    {
      id: 6,
      name: "David Rodriguez",
      type: "Seller",
      email: "david.r@email.com",
      phone: "(555) 789-0123",
      location: "Tampa, FL",
      status: "Cold",
      aiScore: 65,
      totalInvested: "$0",
      propertiesOwned: 1,
      lastActivity: "2 days ago",
      avatar: "DR",
      tags: ["Inherited Property"],
      preferredAreas: ["Westshore"],
      budget: "N/A",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      case "Hot Lead":
        return "bg-red-500/20 text-red-300 border border-red-500/30";
      case "Warm":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
      case "Cold":
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Investor":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "Seller":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      case "Wholesaler":
        return "bg-orange-500/20 text-orange-300 border border-orange-500/30";
      case "Funder":
        return "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  const getAIScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    return "text-red-400";
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || client.type.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <MainContentWrapper>
      {/* Header */}
      {/* <div className="bg-purple-800/30 backdrop-blur-sm border-b border-purple-600/30"> */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Clients</h1>
            <p className="text-purple-200 mt-2">
              Manage your investors, sellers, wholesalers, and funders
            </p>
          </div>
        </div>
      </div>
      {/* </div> */}

      <div className="p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">
                  Total Clients
                </p>
                <p className="text-3xl font-bold text-white mt-1">247</p>
                <p className="text-green-400 text-sm mt-2 font-medium">
                  +12% this month
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl">
                <User className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">
                  Active Deals
                </p>
                <p className="text-3xl font-bold text-white mt-1">89</p>
                <p className="text-green-400 text-sm mt-2 font-medium">
                  +8% this week
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl">
                <Building className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">
                  Total Volume
                </p>
                <p className="text-3xl font-bold text-white mt-1">$8.4M</p>
                <p className="text-green-400 text-sm mt-2 font-medium">
                  +25% this quarter
                </p>
              </div>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-xl">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">
                  AI Conversations
                </p>
                <p className="text-3xl font-bold text-white mt-1">1,247</p>
                <p className="text-green-400 text-sm mt-2 font-medium">
                  +45% this month
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-xl">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg p-6 border border-purple-600/30 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-purple-300" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-purple-900/50 border border-purple-600/50 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm"
              />
            </div>

            <div className="flex gap-2">
              {["all", "investor", "seller", "wholesaler", "funder"].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-xl capitalize transition-all font-medium ${
                      selectedFilter === filter
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                        : "bg-purple-700/50 text-purple-200 hover:bg-purple-600/70 hover:text-white"
                    }`}
                  >
                    {filter === "all" ? "All Clients" : filter + "s"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Clients List */}
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-lg border border-purple-600/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-900/50 border-b border-purple-600/30">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-purple-100">
                    Client
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-purple-100">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-purple-100">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-purple-100">
                    AI Score
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-purple-100">
                    Location
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-purple-100">
                    Portfolio
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-purple-100">
                    Last Activity
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-purple-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr
                    key={client.id}
                    className={`border-b border-purple-600/20 hover:bg-purple-700/30 transition-colors ${
                      index % 2 === 0 ? "bg-purple-800/20" : "bg-purple-800/10"
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                          {client.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {client.name}
                          </p>
                          <p className="text-purple-200 text-sm">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getTypeColor(
                          client.type
                        )}`}
                      >
                        {client.type}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(
                          client.status
                        )}`}
                      >
                        {client.status}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-bold text-lg ${getAIScoreColor(
                            client.aiScore
                          )}`}
                        >
                          {client.aiScore}
                        </span>
                        <div className="w-20 bg-purple-900/50 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              client.aiScore >= 90
                                ? "bg-green-400"
                                : client.aiScore >= 75
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${client.aiScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-purple-200">
                        <MapPin className="w-4 h-4 text-purple-300" />
                        <span className="text-sm">{client.location}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-white">
                          {client.totalInvested}
                        </p>
                        <p className="text-purple-200 text-sm">
                          {client.propertiesOwned} properties
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-purple-200">
                        <Clock className="w-4 h-4 text-purple-300" />
                        <span className="text-sm">{client.lastActivity}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2.5 text-purple-300 hover:text-white hover:bg-purple-600/50 rounded-lg transition-all">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 text-purple-300 hover:text-white hover:bg-purple-600/50 rounded-lg transition-all">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 text-purple-300 hover:text-white hover:bg-purple-600/50 rounded-lg transition-all">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="p-2.5 text-purple-300 hover:text-white hover:bg-purple-600/50 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 text-purple-300 hover:text-white hover:bg-purple-600/50 rounded-lg transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Detail Modal */}
        {selectedClient && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900/95 to-purple-800/95 backdrop-blur-xl rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-600/30">
              <div className="p-6 border-b border-purple-600/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {selectedClient.avatar}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {selectedClient.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                            selectedClient.type
                          )}`}
                        >
                          {selectedClient.type}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            selectedClient.status
                          )}`}
                        >
                          {selectedClient.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-purple-300 hover:text-white text-3xl font-light"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white text-xl">
                      Contact Information
                    </h3>
                    <div className="space-y-4 bg-purple-800/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-purple-300" />
                        <span className="text-purple-100">
                          {selectedClient.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-purple-300" />
                        <span className="text-purple-100">
                          {selectedClient.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-purple-300" />
                        <span className="text-purple-100">
                          {selectedClient.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white text-xl">
                      AI Insights
                    </h3>
                    <div className="space-y-4 bg-purple-800/30 rounded-xl p-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-purple-200">
                            AI Score
                          </span>
                          <span
                            className={`font-bold text-lg ${getAIScoreColor(
                              selectedClient.aiScore
                            )}`}
                          >
                            {selectedClient.aiScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-purple-900/50 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              selectedClient.aiScore >= 90
                                ? "bg-green-400"
                                : selectedClient.aiScore >= 75
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${selectedClient.aiScore}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-purple-200 mb-3">
                          Preferred Areas
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedClient.preferredAreas.map((area, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-600/50 text-purple-100 rounded-full text-xs"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-purple-200 mb-2">
                          Budget Range
                        </p>
                        <span className="font-semibold text-white">
                          {selectedClient.budget}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Summary */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white text-xl">
                      Portfolio Summary
                    </h3>
                    <div className="space-y-3 bg-purple-800/30 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200">Total Invested</span>
                        <span className="font-semibold text-white">
                          {selectedClient.totalInvested}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200">
                          Properties Owned
                        </span>
                        <span className="font-semibold text-white">
                          {selectedClient.propertiesOwned}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200">Last Activity</span>
                        <span className="font-semibold text-white">
                          {selectedClient.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-white text-xl">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600/50 to-purple-500/50 text-purple-100 rounded-full text-sm border border-purple-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-purple-600/30">
                  <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg">
                    <MessageSquare className="w-5 h-5" />
                    Start AI Chat
                  </button>
                  <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg">
                    <Phone className="w-5 h-5" />
                    Voice Call
                  </button>
                  <button className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg">
                    <Calendar className="w-5 h-5" />
                    Schedule Meeting
                  </button>
                  <button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg">
                    <Mail className="w-5 h-5" />
                    Send Email
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

export default ClientsPage;
