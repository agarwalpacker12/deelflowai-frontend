import { Activity } from "lucide-react";
import React from "react";

function RecentActivity({ activity }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
        <Activity className="w-5 h-5 text-blue-400" />
        <span>Recent Activity</span>
      </h3>
      <div className="space-y-3">
        {activity.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                item.impact === "positive"
                  ? "bg-green-400"
                  : item.impact === "negative"
                  ? "bg-red-400"
                  : "bg-gray-400"
              }`}
            ></div>
            <div className="flex-1">
              <div className="text-white font-medium">{item.activity}</div>
              <div className="text-sm text-gray-400">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;
