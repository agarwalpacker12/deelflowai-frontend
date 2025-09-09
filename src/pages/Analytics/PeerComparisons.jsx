import { ArrowUp, Users } from "lucide-react";
import React from "react";

function PeerComparisons({ comparisons }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
        <Users className="w-5 h-5 text-blue-400" />
        <span>Peer Comparisons</span>
      </h3>
      <div className="space-y-4">
        {comparisons.map((comp, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">{comp.metric}</span>
              <span className="text-xs text-gray-400">
                {comp.percentile}th percentile
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">
                  You:{" "}
                  {typeof comp.you === "number" && comp.you > 1000
                    ? comp.you.toLocaleString()
                    : comp.you}
                </span>
                <ArrowUp className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-gray-400">
                Peers:{" "}
                {typeof comp.peers === "number" && comp.peers > 1000
                  ? comp.peers.toLocaleString()
                  : comp.peers}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PeerComparisons;
