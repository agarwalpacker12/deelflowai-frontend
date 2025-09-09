import { TrendingDown, AlertTriangle, Shield } from "lucide-react";
function LossAversionTriggers({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-red-500/30">
          <h3 className="text-lg font-bold mb-4 text-red-300 flex items-center space-x-2">
            <TrendingDown className="w-5 h-5" />
            <span>Opportunity Cost Analysis</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Daily Loss</span>
              <span className="text-red-400 font-bold">
                ${data.opportunityCost.dailyLoss.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Weekly Loss</span>
              <span className="text-red-400 font-bold">
                ${data.opportunityCost.weeklyLoss.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Monthly Loss</span>
              <span className="text-red-400 font-bold">
                ${data.opportunityCost.monthlyLoss.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-red-500/30 pt-3">
              <span className="text-gray-300 font-semibold">Annual Loss</span>
              <span className="text-red-400 font-bold text-lg">
                ${data.opportunityCost.yearlyLoss.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-500/30 rounded-lg">
            <div className="text-sm text-red-200">
              💸 Every day you wait costs you $
              {data.opportunityCost.dailyLoss.toLocaleString()} in lost
              opportunities
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-6 border border-orange-500/30">
          <h3 className="text-lg font-bold mb-4 text-orange-300 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Competitive Disadvantage</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Deals Lost</span>
              <span className="text-orange-400 font-bold">
                {data.competitorAdvantage.dealsLost}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Revenue Gap</span>
              <span className="text-orange-400 font-bold">
                ${data.competitorAdvantage.revenueGap.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Market Share Lost</span>
              <span className="text-orange-400 font-bold">
                {data.competitorAdvantage.marketShare}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Time Wasted</span>
              <span className="text-orange-400 font-bold">
                {data.competitorAdvantage.timeWasted} hours
              </span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-orange-500/30 rounded-lg">
            <div className="text-sm text-orange-200">
              ⚠️ Competitors are gaining ground while you hesitate
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span>Risk Mitigation Analysis</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.riskFactors.map((risk, index) => (
            <div
              key={index}
              className="p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{risk.risk}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    risk.impact === "High"
                      ? "bg-red-500/20 text-red-300"
                      : risk.impact === "Medium"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {risk.impact}
                </span>
              </div>
              <div className="text-sm text-gray-300 mb-2">
                Probability: {risk.probability}%
              </div>
              <div className="text-sm text-blue-400">
                Mitigation: {risk.mitigation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LossAversionTriggers;
