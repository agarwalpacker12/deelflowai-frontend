import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  RefreshCw,
  Sparkles,
  Plus,
} from "lucide-react";
import { leadsAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const LeadsPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minAiScore, setMinAiScore] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError(null);

      try {
        // Prepare API parameters
        const params = {
          page: currentPage,
          per_page: perPage,
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (statusFilter) {
          params.status = statusFilter;
        }

        if (minAiScore) {
          params.ai_score_min = parseInt(minAiScore);
        }

        const response = await leadsAPI.getLeads(params);

        // Handle the API response format
        if (response.data.status === "success") {
          setLeads(response.data.data.data); // leads array
          setTotal(response.data.data.meta.total);
          setTotalPages(response.data.data.meta.last_page);
        } else {
          setError("Failed to fetch leads");
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError(err.response?.data?.message || "Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [searchTerm, statusFilter, minAiScore, perPage, currentPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case "hot":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "qualified":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "new":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "cold":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
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

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setMinAiScore("");
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await leadsAPI.deleteLead(id);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
      setSuccess("Lead deleted successfully");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete lead");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Leads Management</h1>
        <div className="flex items-center gap-3">
          {/* Add Lead Button */}
          <button
            onClick={() => navigate("/app/leads/add")}
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 overflow-hidden"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Sparkle effect */}
            <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
            <Plus className="h-5 w-5" />
            <span className="relative z-10">Add Lead</span>
            {/* Hover effect line */}
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
          </button>
          <div className="text-sm text-gray-400">Total: {total} leads</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
            </select>
          </div>

          {/* AI Score Filter */}
          <div>
            <input
              type="number"
              placeholder="Min AI Score"
              value={minAiScore}
              onChange={(e) => setMinAiScore(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Per Page */}
          <div>
            <select
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>

          {/* Refresh Button */}
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
          <div className="p-8 text-center text-gray-400">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-white font-semibold">
                    Lead Info
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Property
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Scores
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Financial
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Status
                  </th>
                  {/* <th    */}
                  <th className="text-left p-4 text-white font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 &&
                  leads?.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="text-white font-medium">
                            {lead.first_name} {lead.last_name}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </div>
                          <div className="text-xs text-gray-500">
                            Source: {lead.source}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <MapPin className="h-3 w-3" />
                            {lead.property_address}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {lead.property_city}, {lead.property_state}{" "}
                            {lead.property_zip}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {lead.property_type?.replace("_", " ")}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">AI:</span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                lead.ai_score
                              )}`}
                            >
                              {lead.ai_score}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              Motivation:
                            </span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                lead.motivation_score
                              )}`}
                            >
                              {lead.motivation_score}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              Urgency:
                            </span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                lead.urgency_score
                              )}`}
                            >
                              {lead.urgency_score}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              Financial:
                            </span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                lead.financial_score
                              )}`}
                            >
                              {lead.financial_score}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(lead.estimated_value)}
                          </div>
                          <div className="text-gray-400 text-xs">
                            Mortgage: {formatCurrency(lead.mortgage_balance)}
                          </div>
                          <div className="text-gray-400 text-xs">
                            Asking: {formatCurrency(lead.asking_price)}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>
                          <div className="text-xs text-gray-500">
                            Contact: {lead.preferred_contact_method}
                          </div>
                        </div>
                      </td>
                      {/* <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-300">
                            {lead.next_action}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Calendar className="h-3 w-3" />
                            {formatDate(lead.next_action_date)}
                          </div>
                        </div>
                      </td> */}
                      <td className="p-4">
                        <div className="flex gap-2">
                          {/* <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button> */}
                          <button
                            className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                            onClick={() => navigate(`/app/leads/${lead.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            onClick={() => handleDelete(lead.id)}
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
              {Math.min(currentPage * perPage, total)} of {total} leads
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

export default LeadsPage;
