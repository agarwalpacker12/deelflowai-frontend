import LiveActivityFeed from "./LiveActivityFeed";
import PeerComparisons from "./PeerComparisons";
import TestimonialsSection from "./TestimonialsSection";

function SocialProofSystem({ data }) {
  return (
    <div className="space-y-6">
      {/* Trust Signals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {data.trustSignals.totalDeals.toLocaleString()}
          </div>
          <div className="text-sm text-gray-300">Total Deals Closed</div>
        </div>
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
          <div className="text-3xl font-bold text-green-400 mb-2">
            ${(data.trustSignals.totalVolume / 1000000).toFixed(1)}B
          </div>
          <div className="text-sm text-gray-300">Total Volume Processed</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
          <div className="text-3xl font-bold text-orange-400 mb-2">
            {data.trustSignals.activeUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-300">Active Users Today</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {data.trustSignals.successRate}%
          </div>
          <div className="text-sm text-gray-300">Success Rate</div>
        </div>
      </div>

      {/* Live Activity Feed & Peer Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveActivityFeed activity={data.liveActivity} />
        <PeerComparisons comparisons={data.peerComparisons} />
      </div>

      {/* Testimonials */}
      <TestimonialsSection testimonials={data.testimonials} />
    </div>
  );
}

export default SocialProofSystem;
