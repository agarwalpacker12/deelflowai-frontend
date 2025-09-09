import { TrendingUp, Users, Eye, Timer } from "lucide-react";
function UrgencyScarcityTools({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-red-500/30">
          <Timer className="w-8 h-8 text-red-400 mb-3" />
          <div className="text-2xl font-bold text-red-400 mb-2">
            {data.timeRemaining}
          </div>
          <div className="text-sm text-gray-300">Early Bird Expires</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-6 border border-orange-500/30">
          <Users className="w-8 h-8 text-orange-400 mb-3" />
          <div className="text-2xl font-bold text-orange-400 mb-2">
            {data.limitedSpots}
          </div>
          <div className="text-sm text-gray-300">Spots Remaining</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
          <Eye className="w-8 h-8 text-purple-400 mb-3" />
          <div className="text-2xl font-bold text-purple-400 mb-2">
            {data.usersViewing}
          </div>
          <div className="text-sm text-gray-300">Users Viewing Now</div>
        </div>
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
          <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
          <div className="text-2xl font-bold text-green-400 mb-2">
            {data.dealsClosingToday}
          </div>
          <div className="text-sm text-gray-300">Deals Closing Today</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl p-6 border border-red-500/30">
        <h3 className="text-lg font-bold mb-4 text-red-300">
          🔥 Limited Time Offer
        </h3>
        <div className="text-3xl font-bold text-white mb-2">
          {data.currentPromotion}
        </div>
        <div className="text-gray-300 mb-4">
          Don't miss out on this exclusive opportunity - only{" "}
          {data.limitedSpots} spots left!
        </div>
        <div className="bg-red-500/30 rounded-lg p-4 border border-red-500/50">
          <div className="text-sm text-red-200">
            ⚠️ Price increases to $997 in {data.priceIncreaseIn}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrgencyScarcityTools;
