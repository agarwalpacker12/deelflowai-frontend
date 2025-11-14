import React, { useState } from "react";
import { X } from "lucide-react";

const CreateListModal = ({ listType, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("List name is required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: formData.name.trim(),
        list_type: listType,
        description: formData.description.trim() || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-purple-800/30 shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-purple-800/30">
          <h2 className="text-xl font-bold text-white">Create {listType === "email" ? "Email" : "Phone"} List</h2>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-purple-300 text-sm font-medium mb-2">
              List Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-purple-800/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Q4 Marketing List"
              required
            />
          </div>

          <div>
            <label className="block text-purple-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700/50 border border-purple-800/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Optional description for this list"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-purple-300 hover:text-purple-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create List"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListModal;

