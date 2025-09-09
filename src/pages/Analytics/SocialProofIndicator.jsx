import React from "react";
import { UserCheck } from "lucide-react";

function SocialProofIndicator({ data }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-2">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-green-400" />
          <span className="text-sm font-bold text-green-300">
            {data.avgRating}/5
          </span>
        </div>
        <div className="text-xs text-gray-400">User Rating</div>
      </div>
      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg px-3 py-2">
        <div className="text-sm font-bold text-blue-300">
          {data.successRate}%
        </div>
        <div className="text-xs text-gray-400">Success Rate</div>
      </div>
    </div>
  );
}

export default SocialProofIndicator;
