import React from "react";

const StatusBadge = ({ status, children }) => {
  const colors = {
    active: "bg-green-500/20 text-green-300 border border-green-500/30",
    paused: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    draft: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
    hot: "bg-red-500/20 text-red-300 border border-red-500/30",
    qualified: "bg-green-500/20 text-green-300 border border-green-500/30",
    nurturing: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        colors[status] || colors.draft
      }`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
