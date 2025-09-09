import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dealMilestonesAPI } from "../../services/api";
import { Sparkles, Plus } from "lucide-react";
// import a Table component if you create one for milestones, or use inline table rendering

const DealsMileStonePage = () => {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [milestoneType, setMilestoneType] = useState("");
  const [dueDateFrom, setDueDateFrom] = useState("");
  const [isCritical, setIsCritical] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          per_page: perPage,
        };
        if (milestoneType) params.milestone_type = milestoneType;
        if (isCritical !== "") params.is_critical = isCritical;
        if (dueDateFrom) params.due_date_from = dueDateFrom;
        // Add more filters as needed
        const response = await dealMilestonesAPI.getMilestones(params);
        if (response.data.status === "success") {
          setMilestones(response.data.data);
          if (response.data.meta) {
            setTotal(response.data.meta.total);
            setTotalPages(response.data.meta.last_page);
          } else {
            setTotal(response.data.data.length);
            setTotalPages(1);
          }
        } else {
          setError("Failed to fetch milestones");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch milestones");
      } finally {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, [milestoneType, isCritical, dueDateFrom, perPage, currentPage]);

  const resetFilters = () => {
    setMilestoneType("");
    setDueDateFrom("");
    setIsCritical("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Deal Milestones</h1>
        <div className="flex items-center gap-3">
          {/* Add Deal Milestone Button */}
          <button
            onClick={() => navigate("/app/milestone/add")}
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 overflow-hidden"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Sparkle effect */}
            <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
            <Plus className="h-5 w-5" />
            <span className="relative z-10">Add Deal Milestone</span>
            {/* Hover effect line */}
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
          </button>
          <div className="text-sm text-gray-400">Total: {total} Milestones</div>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Milestone Type */}
          <div>
            <select
              value={milestoneType}
              onChange={(e) => setMilestoneType(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
            >
              <option value="">All Types</option>
              <option value="contract">Contract</option>
              <option value="inspection">Inspection</option>
              <option value="financing">Financing</option>
              <option value="appraisal">Appraisal</option>
              <option value="closing">Closing</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {/* Due Date From */}
          <div>
            <input
              type="date"
              value={dueDateFrom}
              onChange={(e) => setDueDateFrom(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-60"
            />
          </div>
          {/* Is Critical */}
          <div>
            <select
              value={isCritical}
              onChange={(e) => setIsCritical(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
            >
              <option value="">All</option>
              <option value="true">Critical</option>
              <option value="false">Normal</option>
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
          {/* Reset Button */}
          <div>
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              <span>↻</span>
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
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading milestones...
          </div>
        ) : milestones.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No milestones found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Deal ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Milestone Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Critical
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {milestones.map((milestone) => (
                  <tr
                    key={milestone.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white text-xs">
                      {milestone?.deal_id}
                    </td>
                    <td className="px-6 py-4 text-white text-xs capitalize">
                      {milestone?.milestone_type}
                    </td>
                    <td className="px-6 py-4 text-white text-xs font-medium">
                      {milestone?.title}
                    </td>
                    <td className="px-6 py-4 text-white text-xs max-w-xs truncate">
                      {milestone?.description}
                    </td>
                    <td className="px-6 py-4 text-white text-xs">
                      {milestone?.due_date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                          milestone?.is_critical
                            ? "bg-red-500/20 text-red-300 border-red-500/30"
                            : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                        }`}
                      >
                        {milestone?.is_critical ? "Critical" : "Normal"}
                      </span>
                    </td>
                    ?
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded text-xs">
                          View
                        </button>
                        <button className="text-green-400 hover:text-green-300 transition-colors px-2 py-1 rounded text-xs">
                          Edit
                        </button>
                        <button className="text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded text-xs">
                          Delete
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
              {Math.min(currentPage * perPage, total)} of {total} milestones
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>‹</span>
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
                <span>›</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsMileStonePage;
