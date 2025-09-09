import { MapPin } from "lucide-react";
import React from "react";

function NeighborhoodAnalysis({ neighborhood }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
        <MapPin className="w-5 h-5 text-green-400" />
        <span>Neighborhood Analysis</span>
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-sm text-gray-300 mb-1">Appreciation</div>
          <div className="text-lg font-bold text-green-400">
            +{neighborhood.appreciation}%
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-sm text-gray-300 mb-1">Crime Rate</div>
          <div className="text-lg font-bold text-blue-400">
            {neighborhood.crimeRate}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-sm text-gray-300 mb-1">Schools</div>
          <div className="text-lg font-bold text-yellow-400">
            {neighborhood.schools}
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-sm text-gray-300 mb-1">Walkability</div>
          <div className="text-lg font-bold text-purple-400">
            {neighborhood.walkability}/10
          </div>
        </div>
      </div>
    </div>
  );
}

export default NeighborhoodAnalysis;
