import React, { useState, useEffect } from "react";
import { X, Upload, Search, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { communicationsAPI } from "../../../../services/api";
import toast from "react-hot-toast";
import UploadFileModal from "./UploadFileModal";

const ListEntriesView = ({ list, onClose, onRefresh }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, [list, currentPage, searchTerm]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await communicationsAPI.getEntries(list.id, params);
      if (response.data.status === "success") {
        setEntries(response.data.data.entries || []);
        setTotalPages(response.data.data.pagination?.total_pages || 1);
        setTotalCount(response.data.data.pagination?.total_count || 0);
      } else {
        toast.error("Failed to fetch entries");
        setEntries([]);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast.error(error.response?.data?.detail || "Failed to fetch entries");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }
    try {
      const response = await communicationsAPI.deleteEntry(list.id, entryId);
      if (response.data.status === "success") {
        toast.success("Entry deleted successfully");
        fetchEntries();
        if (onRefresh) onRefresh();
      } else {
        toast.error(response.data.message || "Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error(error.response?.data?.detail || "Failed to delete entry");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEntries.length === 0) {
      toast.error("Please select entries to delete");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedEntries.length} entries?`)) {
      return;
    }
    try {
      const response = await communicationsAPI.bulkDeleteEntries(list.id, selectedEntries);
      if (response.data.status === "success") {
        toast.success(`Deleted ${response.data.data.deleted_count} entries successfully`);
        setSelectedEntries([]);
        fetchEntries();
        if (onRefresh) onRefresh();
      } else {
        toast.error(response.data.message || "Failed to delete entries");
      }
    } catch (error) {
      console.error("Error bulk deleting entries:", error);
      toast.error(error.response?.data?.detail || "Failed to delete entries");
    }
  };

  const toggleEntrySelection = (entryId) => {
    setSelectedEntries((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEntries.length === entries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(entries.map((e) => e.id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300 mb-2 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Lists
          </button>
          <h2 className="text-2xl font-bold text-white">{list.name}</h2>
          <p className="text-purple-300 text-sm mt-1">
            {list.description || "No description"}
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload {list.list_type === "email" ? "Emails" : "Phones"}
        </button>
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${list.list_type === "email" ? "emails" : "phones"}...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-purple-800/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {selectedEntries.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedEntries.length})
          </button>
        )}
      </div>

      {/* Entries Table */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-800/30 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-purple-300 text-lg">No entries found</p>
            <p className="text-purple-400 text-sm mt-2">Upload a file to add entries</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-800/30">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedEntries.length === entries.length && entries.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-purple-600 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">
                      {list.list_type === "email" ? "Email" : "Phone"}
                    </th>
                    <th className="text-left py-3 px-4 text-purple-300 font-medium">Name</th>
                    <th className="text-right py-3 px-4 text-purple-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-purple-800/20 hover:bg-purple-900/20 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedEntries.includes(entry.id)}
                          onChange={() => toggleEntrySelection(entry.id)}
                          className="rounded border-purple-600 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="py-4 px-4 text-white">
                        {list.list_type === "email" ? entry.email : entry.phone}
                      </td>
                      <td className="py-4 px-4 text-purple-300">
                        {entry.name || "-"}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-all"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-purple-800/30">
                <div className="text-purple-300 text-sm">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-purple-300 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadFileModal
          list={list}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchEntries();
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default ListEntriesView;

