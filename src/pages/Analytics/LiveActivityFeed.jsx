import { Activity } from "lucide-react";
import React from "react";

function LiveActivityFeed({ activity }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center space-x-2">
          <Activity className="w-5 h-5 text-green-400" />
          <span>Live Activity Feed</span>
        </h3>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      <div className="space-y-3">
        {activity.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border transition-all ${
              item.type === "success"
                ? "bg-green-500/20 border-green-500/30"
                : item.type === "opportunity"
                ? "bg-blue-500/20 border-blue-500/30"
                : "bg-orange-500/20 border-orange-500/30"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-white">{item.user}</span>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
            <div className="text-sm text-gray-300">{item.action}</div>
            <div className="text-xs text-gray-400">{item.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveActivityFeed;
