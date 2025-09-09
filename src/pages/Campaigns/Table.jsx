import React, { useState, useEffect } from "react";
import { campaignsAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

const CampaignsTable = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: currentPage,
          per_page: perPage,
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (typeFilter) {
          params.campaign_type = typeFilter;
        }

        if (statusFilter) {
          params.status = statusFilter;
        }

        if (channelFilter) {
          params.channel = channelFilter;
        }

        const response = await campaignsAPI.getCampaigns(params);

        if (response.data.status === "success") {
          setCampaigns(response.data.data.data);
          setTotal(response.data.data.meta.total);
          setTotalPages(response.data.data.meta.last_page);
        } else {
          setError("Failed to fetch campaigns");
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError(err.response?.data?.message || "Failed to fetch campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [
    searchTerm,
    typeFilter,
    statusFilter,
    channelFilter,
    perPage,
    currentPage,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setStatusFilter("");
    setChannelFilter("");
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "paused":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "draft":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const calculateOpenRate = (open_count, sent_count) => {
    if (sent_count === 0) return 0;
    return ((open_count / sent_count) * 100).toFixed(1);
  };

  const calculateClickRate = (click_count, sent_count) => {
    if (sent_count === 0) return 0;
    return ((click_count / sent_count) * 100).toFixed(1);
  };

  const calculateConversionRate = (conversion_count, sent_count) => {
    if (sent_count === 0) return 0;
    return ((conversion_count / sent_count) * 100).toFixed(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;
    try {
      await campaignsAPI.deleteCampaign(id);
      setCampaigns((prevCampaigns) =>
        prevCampaigns.filter((campaign) => campaign.id !== id)
      );
      // setSuccess("Campaign deleted successfully");
      toast.success("Campaign deleted successfully");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete campaign");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Campaign Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
            >
              <option value="">All Types</option>
              <option value="seller_finder">Seller Finder</option>
              <option value="buyer_finder">Buyer Finder</option>
            </select>
          </div>

          {/* Reset Button */}
          <div>
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
          <p className="text-green-300">{success}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No campaigns found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-white font-semibold">
                    Campaign Info
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Details
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Performance
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Budget & Spend
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Status
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Schedule
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length > 0 &&
                  campaigns?.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="text-white font-medium">
                            {campaign.name}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {campaign.target_criteria?.location}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {campaign.campaign_type?.replace("_", " ")}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Mail className="h-3 w-3" />
                            {campaign.channel?.replace("_", " ")}
                          </div>
                          <div className="text-gray-400 text-sm capitalize">
                            {campaign.target_criteria?.property_type?.replace(
                              "_",
                              " "
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            Min Equity:{" "}
                            {formatCurrency(
                              campaign.target_criteria?.equity_min || 0
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-white">
                              {campaign.sent_count}/{campaign.total_recipients}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-green-400" />
                            <span className="text-sm text-green-400">
                              {calculateOpenRate(
                                campaign.open_count,
                                campaign.sent_count
                              )}
                              % open
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {calculateClickRate(
                              campaign.click_count,
                              campaign.sent_count
                            )}
                            % click
                          </div>
                          <div className="text-xs text-gray-400">
                            {calculateConversionRate(
                              campaign.conversion_count,
                              campaign.sent_count
                            )}
                            % convert
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-white text-sm">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(campaign.budget)}
                          </div>
                          <div className="text-gray-400 text-sm">
                            Spent: {formatCurrency(campaign.spent)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {((campaign.spent / campaign.budget) * 100).toFixed(
                              0
                            )}
                            % used
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (campaign.spent / campaign.budget) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(
                              campaign.status
                            )}`}
                          >
                            {campaign.status}
                          </span>
                          {campaign.use_ai_personalization && (
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-purple-400" />
                              <span className="text-xs text-purple-400">
                                AI Enhanced
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Calendar className="h-3 w-3" />
                            {formatDate(campaign.scheduled_at)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Created: {formatDate(campaign.created_at)}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          {/* <button
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            onClick={() =>
                              navigate(`/app/campaigns/${campaign.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </button> */}
                          <button
                            className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                            onClick={() =>
                              navigate(`/app/campaigns/${campaign.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * perPage + 1} to{" "}
              {Math.min(currentPage * perPage, total)} of {total} campaigns
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsTable;
