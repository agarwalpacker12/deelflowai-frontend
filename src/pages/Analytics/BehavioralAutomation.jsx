import { Brain, Zap } from "lucide-react";
function BehavioralAutomation({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>User Behavioral Profile</span>
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-gray-300 mb-1">Decision Style</div>
                <div className="text-lg font-bold text-purple-400 capitalize">
                  {data.userProfile.decisionStyle}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-gray-300 mb-1">Risk Tolerance</div>
                <div className="text-lg font-bold text-blue-400 capitalize">
                  {data.userProfile.riskTolerance}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-gray-300 mb-1">
                  Engagement Score
                </div>
                <div className="text-lg font-bold text-green-400">
                  {data.userProfile.engagementScore}%
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-sm text-gray-300 mb-1">Lifetime Value</div>
                <div className="text-lg font-bold text-yellow-400">
                  ${data.userProfile.lifetimeValue.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-sm text-gray-300 mb-2">
                Top Conversion Triggers
              </div>
              <div className="flex flex-wrap gap-2">
                {data.userProfile.conversionTriggers.map((trigger, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded"
                  >
                    {trigger.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Automation Triggers</span>
          </h3>
          <div className="space-y-3">
            {data.automationTriggers.map((trigger, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">
                    {trigger.name}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      trigger.status === "active"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {trigger.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">
                    Completion: {trigger.completion}%
                  </span>
                  <span className="text-blue-400">
                    Conversions: {trigger.conversions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BehavioralAutomation;
