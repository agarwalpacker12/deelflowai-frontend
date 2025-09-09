import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Sparkles,
} from "lucide-react";
import { propertiesAPI, propertySaveAPI } from "../../services/api";
import Table from "./Table";

const PropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [minAiScore, setMinAiScore] = useState("");
  const [error, setError] = useState(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState([]);

  // Fetch saved properties
  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const response = await propertySaveAPI.getPropertySave({
          per_page: 100,
        }); // adjust per_page as needed
        if (response.data.status === "success") {
          setSavedPropertyIds(
            response.data.data.data.map((item) => item.property_id)
          );
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchSavedProperties();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          per_page: perPage,
        };
        if (searchTerm) params.search = searchTerm;
        if (statusFilter) params.status = statusFilter;
        if (cityFilter) params.city = cityFilter;
        // if (zipFilter) params.zip = zipFilter;
        if (priceMin) params.price_min = priceMin;
        // if (priceMax) params.price_max = priceMax;
        if (bedrooms) params.bedrooms = bedrooms;
        // if (bathrooms) params.bathrooms = bathrooms;
        if (transactionType) params.transaction_type = transactionType;
        if (minAiScore) params.ai_score_min = minAiScore;

        const response = await propertiesAPI.getProperties(params);
        if (response.data.status === "success") {
          setProperties(response.data.data);
          // If meta exists, use it for pagination
          if (response.data.meta) {
            setTotal(response.data.meta.total);
            setTotalPages(response.data.meta.last_page);
          } else {
            setTotal(response.data.data.length);
            setTotalPages(1);
          }
        } else {
          setError("Failed to fetch properties");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [
    searchTerm,
    statusFilter,
    cityFilter,
    // zipFilter,
    priceMin,
    //  priceMax,
    bedrooms,
    //  bathrooms,
    transactionType,
    minAiScore,
    perPage,
    currentPage,
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "sold":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
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
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCityFilter("");
    // setZipFilter("");
    setPriceMin("");
    // setPriceMax("");
    setBedrooms("");
    // setBathrooms("");
    setTransactionType("");
    setMinAiScore("");
    setCurrentPage(1);
  };

  // Delete property handler
  const handleDelete = async (property) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    try {
      await propertiesAPI.deleteProperty(property.id);
      // Refetch properties after delete
      const params = {
        page: currentPage,
        per_page: perPage,
      };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (cityFilter) params.city = cityFilter;
      if (priceMin) params.price_min = priceMin;
      if (bedrooms) params.bedrooms = bedrooms;
      if (transactionType) params.transaction_type = transactionType;
      if (minAiScore) params.ai_score_min = minAiScore;
      const response = await propertiesAPI.getProperties(params);
      if (response.data.status === "success") {
        setProperties(response.data.data);
        if (response.data.meta) {
          setTotal(response.data.meta.total);
          setTotalPages(response.data.meta.last_page);
        } else {
          setTotal(response.data.data.length);
          setTotalPages(1);
        }
      } else {
        setError("Failed to fetch properties");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete property");
    }
  };

  // Add handler for saving property (to update savedPropertyIds)
  const handlePropertySaved = async (propertyId) => {
    // Refetch saved properties and properties list
    try {
      // Refetch saved properties
      const savedResponse = await propertySaveAPI.getPropertySave({
        per_page: 100,
      });
      if (savedResponse.data.status === "success") {
        setSavedPropertyIds(
          savedResponse.data.data.data.map((item) => item.property_id)
        );
      }
      // Refetch properties
      const params = {
        page: currentPage,
        per_page: perPage,
      };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (cityFilter) params.city = cityFilter;
      if (priceMin) params.price_min = priceMin;
      if (bedrooms) params.bedrooms = bedrooms;
      if (transactionType) params.transaction_type = transactionType;
      if (minAiScore) params.ai_score_min = minAiScore;
      const response = await propertiesAPI.getProperties(params);
      if (response.data.status === "success") {
        setProperties(response.data.data);
        if (response.data.meta) {
          setTotal(response.data.meta.total);
          setTotalPages(response.data.meta.last_page);
        } else {
          setTotal(response.data.data.length);
          setTotalPages(1);
        }
      } else {
        setError("Failed to fetch properties");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to refresh after saving property"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Properties</h1>
          <div className="text-sm text-gray-400 mt-1">
            Total: {total} properties
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Smart Add Button */}
          <button
            onClick={() => navigate("/app/properties/add")}
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 overflow-hidden"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Sparkle effect */}
            <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
            <Plus className="h-5 w-5" />
            <span className="relative z-10">Add Property</span>

            {/* Hover effect line */}
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
          </button>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
              Active: {properties.filter((p) => p.status === "active").length}
            </div>
            <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300">
              Pending: {properties.filter((p) => p.status === "pending").length}
            </div>
            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300">
              Sold: {properties.filter((p) => p.status === "sold").length}
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
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
              <option value="sold">Sold</option>
            </select>
          </div>
          {/* City Filter */}
          <div>
            <input
              type="text"
              placeholder="City"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price Min */}
          <div>
            <input
              type="number"
              placeholder="Min Price"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <input
              type="number"
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transaction Type */}
          <div>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
            >
              <option value="">All Transactions</option>
              <option value="assignment">Assignment</option>
              <option value="purchase">Purchase</option>
              <option value="sale">Sale</option>
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
      {/* Table */}
      <Table
        properties={properties}
        loading={loading}
        formatCurrency={formatCurrency}
        getScoreColor={getScoreColor}
        getStatusColor={getStatusColor}
        onDelete={handleDelete}
        savedPropertyIds={savedPropertyIds}
        onPropertySaved={handlePropertySaved}
      />
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * perPage + 1} to{" "}
              {Math.min(currentPage * perPage, total)} of {total} properties
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

export default PropertiesPage;
