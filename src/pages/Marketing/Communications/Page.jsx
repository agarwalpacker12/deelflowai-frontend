import React, { useState, useEffect } from "react";
import { communicationsAPI } from "../../../services/api";
import toast from "react-hot-toast";
import { Mail, Phone, Plus, Search } from "lucide-react";
import ListTable from "./components/ListTable";
import CreateListModal from "./components/CreateListModal";
import ListEntriesView from "./components/ListEntriesView";

const CommunicationsPage = () => {
  const [activeTab, setActiveTab] = useState("email"); // 'email' or 'phone'
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [showEntriesView, setShowEntriesView] = useState(false);

  useEffect(() => {
    fetchLists();
  }, [activeTab, searchTerm]);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const params = {
        list_type: activeTab,
      };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await communicationsAPI.getLists(params);
      if (response.data.status === "success") {
        setLists(response.data.data || []);
      } else {
        toast.error("Failed to fetch lists");
        setLists([]);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
      toast.error(error.response?.data?.detail || "Failed to fetch lists");
      setLists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (listData) => {
    try {
      const response = await communicationsAPI.createList(listData);
      if (response.data.status === "success") {
        toast.success("List created successfully");
        setShowCreateModal(false);
        fetchLists();
      } else {
        toast.error(response.data.message || "Failed to create list");
      }
    } catch (error) {
      console.error("Error creating list:", error);
      toast.error(error.response?.data?.detail || "Failed to create list");
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm("Are you sure you want to delete this list? All entries will be deleted.")) {
      return;
    }
    try {
      const response = await communicationsAPI.deleteList(listId);
      if (response.data.status === "success") {
        toast.success("List deleted successfully");
        fetchLists();
        if (selectedList?.id === listId) {
          setSelectedList(null);
          setShowEntriesView(false);
        }
      } else {
        toast.error(response.data.message || "Failed to delete list");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
      toast.error(error.response?.data?.detail || "Failed to delete list");
    }
  };

  const handleViewEntries = (list) => {
    setSelectedList(list);
    setShowEntriesView(true);
  };

  const handleCloseEntriesView = () => {
    setShowEntriesView(false);
    setSelectedList(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Communications Management</h1>
          <p className="text-purple-300">Manage your email and phone lists for marketing campaigns</p>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 shadow-xl mb-6">
          <div className="flex items-center justify-between p-4 border-b border-purple-800/30">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab("email");
                  setSearchTerm("");
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "email"
                    ? "bg-purple-600 text-white"
                    : "text-purple-300 hover:bg-purple-900/30"
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email Lists
              </button>
              <button
                onClick={() => {
                  setActiveTab("phone");
                  setSearchTerm("");
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "phone"
                    ? "bg-purple-600 text-white"
                    : "text-purple-300 hover:bg-purple-900/30"
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Lists
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search lists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-700/50 border border-purple-800/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create List
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {showEntriesView ? (
              <ListEntriesView
                list={selectedList}
                onClose={handleCloseEntriesView}
                onRefresh={fetchLists}
              />
            ) : (
              <ListTable
                lists={lists}
                loading={loading}
                listType={activeTab}
                onView={handleViewEntries}
                onDelete={handleDeleteList}
                onRefresh={fetchLists}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <CreateListModal
          listType={activeTab}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateList}
        />
      )}
    </div>
  );
};

export default CommunicationsPage;

