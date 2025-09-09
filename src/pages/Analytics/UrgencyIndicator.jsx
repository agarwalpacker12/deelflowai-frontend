import { Timer } from "lucide-react";
function UrgencyIndicator({ data }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-2">
        <div className="flex items-center space-x-2">
          <Timer className="w-4 h-4 text-red-400 animate-pulse" />
          <span className="text-sm font-bold text-red-300">
            {data.timeRemaining}
          </span>
        </div>
        <div className="text-xs text-gray-400">Early Bird Ends</div>
      </div>
      <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg px-3 py-2">
        <div className="text-sm font-bold text-orange-300">
          {data.limitedSpots} spots left
        </div>
        <div className="text-xs text-gray-400">Limited Access</div>
      </div>
    </div>
  );
}

export default UrgencyIndicator;
