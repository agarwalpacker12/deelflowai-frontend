import React from "react";
import { Eye, Edit, Trash2, Upload, Calendar } from "lucide-react";

const ListTable = ({ lists, loading, listType, onView, onDelete, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-300 text-lg">No {listType} lists found</p>
        <p className="text-purple-400 text-sm mt-2">Create your first list to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-purple-800/30">
            <th className="text-left py-3 px-4 text-purple-300 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-purple-300 font-medium">Description</th>
            <th className="text-left py-3 px-4 text-purple-300 font-medium">Entries</th>
            <th className="text-left py-3 px-4 text-purple-300 font-medium">Created</th>
            <th className="text-right py-3 px-4 text-purple-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lists.map((list) => (
            <tr
              key={list.id}
              className="border-b border-purple-800/20 hover:bg-purple-900/20 transition-colors"
            >
              <td className="py-4 px-4 text-white font-medium">{list.name}</td>
              <td className="py-4 px-4 text-purple-300 text-sm">
                {list.description || "-"}
              </td>
              <td className="py-4 px-4 text-purple-300">
                <span className="bg-purple-900/30 px-2 py-1 rounded text-sm">
                  {list.entry_count || 0}
                </span>
              </td>
              <td className="py-4 px-4 text-purple-400 text-sm">
                {list.created_at
                  ? new Date(list.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                  : "-"}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onView(list)}
                    className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 rounded transition-all"
                    title="View entries"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(list.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-all"
                    title="Delete list"
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
  );
};

export default ListTable;

