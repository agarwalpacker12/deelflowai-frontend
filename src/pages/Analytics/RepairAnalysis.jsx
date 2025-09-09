import { Hammer } from "lucide-react";
import React from "react";

function RepairAnalysis({ repairs }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
        <Hammer className="w-5 h-5 text-orange-400" />
        <span>Repair Analysis</span>
      </h3>
      <div className="space-y-3">
        {repairs.map((repair, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-white">
                  {repair.category}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    repair.urgency === "High"
                      ? "bg-red-500/20 text-red-300"
                      : repair.urgency === "Medium"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {repair.urgency}
                </span>
              </div>
              <div className="text-sm text-gray-400">{repair.description}</div>
            </div>
            <div className="text-lg font-bold text-orange-400">
              ${repair.cost.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RepairAnalysis;
