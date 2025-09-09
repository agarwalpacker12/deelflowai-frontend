import { Brain } from "lucide-react";
import React from "react";

function MotivationAnalysis({ deal }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
        <Brain className="w-5 h-5 text-purple-400" />
        <span>Seller Motivation</span>
      </h3>
      <div className="space-y-4">
        <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-red-300">Distress Level</span>
            <span className="text-red-400 font-bold">
              {deal.distressLevel}/10
            </span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-red-600 to-red-400 rounded-full"
              style={{ width: `${deal.distressLevel * 10}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-gray-300 mb-1">Motivation</div>
          <div className="text-white font-semibold">{deal.motivation}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-gray-300 mb-1">Timeline</div>
          <div className="text-white font-semibold">{deal.timeline}</div>
        </div>
      </div>
    </div>
  );
}

export default MotivationAnalysis;
