import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Building,
  User,
  Clock,
  TrendingUp,
} from "lucide-react";
import { dealsAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";

const DealsPage = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dealTypeFilter, setDealTypeFilter] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchDeals = async () => {
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

        if (dealTypeFilter) {
          params.deal_type = dealTypeFilter;
        }

        const response = await dealsAPI.getDeals(params);

        // Handle the API response format
        if (response.data.status === "success") {
          setDeals(response.data.data.data); // deals array
          setTotal(response.data.data.meta.total);
          setTotalPages(response.data.data.meta.last_page);
          // Do NOT setCurrentPage here to avoid infinite loop
        } else {
          setError("Failed to fetch deals");
        }
      } catch (err) {
        console.error("Error fetching deals:", err);
        setError(err.response?.data?.message || "Failed to fetch deals");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [searchTerm, statusFilter, dealTypeFilter, perPage, currentPage]);

  // Add a guard to prevent currentPage from being out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "closed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getDealTypeColor = (dealType) => {
    switch (dealType) {
      case "assignment":
        return "text-purple-400";
      case "wholesale":
        return "text-blue-400";
      case "fix_and_flip":
        return "text-orange-400";
      case "buy_and_hold":
        return "text-green-400";
      case "direct_sale":
        return "text-indigo-400";
      default:
        return "text-gray-400";
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateProfit = (deal) => {
    const salePrice = parseFloat(deal.sale_price) || 0;
    const purchasePrice = parseFloat(deal.purchase_price) || 0;
    const assignmentFee = parseFloat(deal.assignment_fee) || 0;
    return salePrice - purchasePrice + assignmentFee;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDealTypeFilter("");
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;
    try {
      await dealsAPI.deleteDeal(id);
      setDeals((prevDeals) => prevDeals.filter((deal) => deal.id !== id));
      setSuccess("Deal deleted successfully");
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete deal");
    }
  };

  return (
    <MainContentWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Deals Management</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">Total: {total} deals</div>
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
                placeholder="Search deals..."
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
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Deal Type Filter */}
            <div>
              <select
                value={dealTypeFilter}
                onChange={(e) => setDealTypeFilter(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
              >
                <option value="">All Types</option>
                <option value="assignment">Assignment</option>
                <option value="wholesale">Wholesale</option>
                <option value="fix_and_flip">Fix & Flip</option>
                <option value="buy_and_hold">Buy & Hold</option>
                <option value="direct_sale">Direct Sale</option>
              </select>
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
            <div className="p-8 text-center text-gray-400">
              Loading deals...
            </div>
          ) : deals.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No deals found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-white font-semibold">
                      Deal Info
                    </th>
                    <th className="text-left p-4 text-white font-semibold">
                      Property & Lead
                    </th>
                    <th className="text-left p-4 text-white font-semibold">
                      Financial Details
                    </th>
                    <th className="text-left p-4 text-white font-semibold">
                      Timeline
                    </th>
                    <th className="text-left p-4 text-white font-semibold">
                      Status
                    </th>
                    <th className="text-left p-4 text-white font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr
                      key={deal.id}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="text-white font-medium">
                            Deal #{deal?.id}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Building className="h-3 w-3" />
                            <span className={getDealTypeColor(deal?.deal_type)}>
                              {deal?.deal_type?.replace("_", " ")}
                            </span>
                          </div>
                          <div className="text-md text-gray-50">
                            Property ID: {deal?.property_id}
                          </div>
                          <div className="text-xs text-gray-300">
                            Lead ID: {deal?.lead_id}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <User className="h-3 w-3" />
                            Buyer ID: {deal?.buyer_id}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <User className="h-3 w-3" />
                            Seller ID: {deal?.seller_id}
                          </div>
                          {deal?.inspection_period && (
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                              <Clock className="h-3 w-3" />
                              Inspection: {deal?.inspection_period} days
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <DollarSign className="h-3 w-3" />
                            Purchase: {formatCurrency(deal?.purchase_price)}
                          </div>
                          <div className="flex items-center gap-2 text-blue-400 text-sm">
                            <DollarSign className="h-3 w-3" />
                            Sale: {formatCurrency(deal?.sale_price)}
                          </div>
                          {deal?.assignment_fee && (
                            <div className="flex items-center gap-2 text-purple-400 text-xs">
                              <DollarSign className="h-3 w-3" />
                              Assignment: {formatCurrency(deal?.assignment_fee)}
                            </div>
                          )}
                          {deal?.earnest_money && (
                            <div className="flex items-center gap-2 text-yellow-400 text-xs">
                              <DollarSign className="h-3 w-3" />
                              Earnest: {formatCurrency(deal?.earnest_money)}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-green-400 text-xs font-medium">
                            <TrendingUp className="h-3 w-3" />
                            Profit: {formatCurrency(calculateProfit(deal))}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Calendar className="h-3 w-3" />
                            Contract: {formatDate(deal?.contract_date)}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Calendar className="h-3 w-3" />
                            Closing: {formatDate(deal?.closing_date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {deal?.financing_contingency && "Financing ✓"}
                            {deal?.inspection_contingency && " Inspection ✓"}
                            {deal?.appraisal_contingency && " Appraisal ✓"}
                            {deal?.title_contingency && " Title ✓"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              deal?.status
                            )}`}
                          >
                            {deal?.status}
                          </span>
                          {deal?.notes && (
                            <div className="text-xs text-gray-500 truncate max-w-32">
                              {deal?.notes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                            onClick={() => navigate(`/app/deals/${deal.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            onClick={() => handleDelete(deal.id)}
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
                {Math.min(currentPage * perPage, total)} of {total} deals
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
    </MainContentWrapper>
  );
};

export default DealsPage;
