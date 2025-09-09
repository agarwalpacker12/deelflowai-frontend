import { Target, BarChart3 } from "lucide-react";
function AnchoringEffects({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span>Price Anchoring Strategy</span>
          </h3>
          <div className="space-y-4">
            {data.priceAnchors.map((anchor, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  anchor.purpose === "sweet_spot"
                    ? "bg-green-500/20 border-green-500/50"
                    : anchor.purpose === "anchor"
                    ? "bg-blue-500/20 border-blue-500/50"
                    : "bg-gray-500/20 border-gray-500/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">
                    {anchor.label}
                  </span>
                  {anchor.purpose === "sweet_spot" && (
                    <span className="px-2 py-1 bg-green-500/30 text-green-300 text-xs rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-white">
                  ${anchor.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 capitalize">
                  {anchor.purpose.replace("_", " ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <span>Performance Benchmarks</span>
          </h3>
          <div className="space-y-4">
            {data.metricBenchmarks.map((benchmark, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">
                    {benchmark.metric}
                  </span>
                  <span className="text-green-400 font-bold">
                    {benchmark.yours}
                    {benchmark.metric.includes("Rate") ||
                    benchmark.metric.includes("Margin")
                      ? "%"
                      : benchmark.metric.includes("Days")
                      ? " days"
                      : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Industry: {benchmark.industry}
                    {benchmark.metric.includes("Rate") ||
                    benchmark.metric.includes("Margin")
                      ? "%"
                      : benchmark.metric.includes("Days")
                      ? " days"
                      : ""}
                  </span>
                  <span className="text-blue-400">
                    Elite: {benchmark.elite}
                    {benchmark.metric.includes("Rate") ||
                    benchmark.metric.includes("Margin")
                      ? "%"
                      : benchmark.metric.includes("Days")
                      ? " days"
                      : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
        <h3 className="text-lg font-bold mb-4 text-blue-300">
          Social Anchoring Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {data.socialAnchors.totalUsers}
            </div>
            <div className="text-sm text-gray-300">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {data.socialAnchors.dealsProcessed}
            </div>
            <div className="text-sm text-gray-300">Deals Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {data.socialAnchors.avgProfit}
            </div>
            <div className="text-sm text-gray-300">Avg Profit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {data.socialAnchors.topPerformer}
            </div>
            <div className="text-sm text-gray-300">Top Performer</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnchoringEffects;
