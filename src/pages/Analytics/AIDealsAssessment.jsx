import { Home } from "lucide-react";
import MotivationAnalysis from "./MotivationAnalysis";
import RepairAnalysis from "./RepairAnalysis";
import RecentActivity from "./RecentActivity";
import NeighborhoodAnalysis from "./NeighborhoodAnalysis";
import ComparableAnalysis from "./ComparableAnalysis";

function AIDealsAssessment({ data }) {
  const deal = data.currentDeal;
  return (
    <div className="space-y-6">
      {/* Deal Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <Home className="w-6 h-6 text-emerald-400" />
                <span>Property Analysis</span>
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">
                  AI Confidence: {deal.confidence}%
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{deal.address}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span>{deal.daysOnMarket} days on market</span>
                <span>•</span>
                <span>{deal.priceReductions} price reductions</span>
                <span>•</span>
                <span>Last reduction: {deal.lastReduction}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  ${deal.listPrice.toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">List Price</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  ${deal.estimatedARV.toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">Estimated ARV</div>
              </div>
              <div className="bg-orange-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">
                  ${deal.repairEstimate.toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">Repair Estimate</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  ${deal.potentialProfit.toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">Potential Profit</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">ROI</span>
                  <span className="text-emerald-400 font-bold">
                    {deal.roi}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Cap Rate</span>
                  <span className="text-blue-400 font-bold">
                    {deal.capRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Cash Flow</span>
                  <span className="text-yellow-400 font-bold">
                    ${deal.cashFlow}/mo
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <MotivationAnalysis deal={deal} />
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RepairAnalysis repairs={deal.repairs} />
        <RecentActivity activity={deal.recentActivity} />
      </div>

      {/* Neighborhood & Comparables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeighborhoodAnalysis neighborhood={deal.neighborhood} />
        <ComparableAnalysis comparables={deal.marketComps} />
      </div>
    </div>
  );
}

export default AIDealsAssessment;
