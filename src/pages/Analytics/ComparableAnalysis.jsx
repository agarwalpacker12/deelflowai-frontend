import { BarChart3 } from "lucide-react";
import React from "react";

function ComparableAnalysis({ comparables }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        <span>Market Comparables</span>
      </h3>
      <div className="text-center">
        <div className="text-4xl font-bold text-cyan-400 mb-2">
          {comparables}
        </div>
        <div className="text-gray-300">Similar Properties Found</div>
        <div className="mt-4 p-3 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
          <div className="text-sm text-cyan-300">AI Confidence: 94%</div>
          <div className="text-xs text-gray-400 mt-1">
            Based on recent sales within 0.5 miles
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparableAnalysis;
