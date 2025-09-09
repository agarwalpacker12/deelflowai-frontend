import React, { useState } from "react";
import { Activity, Users, DollarSign, X } from "lucide-react";

export default function NotificationBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-blue-600 text-white py-2 shadow-md relative">
      <div className="mx-auto flex items-center justify-between px-2">
        <div className="flex items-center space-x-6">
          {/* Live Activity */}
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Live Activity</span>
          </div>

          {/* Users Count */}
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              35 logged 57% search fund for Main St. in Austin, TX
            </span>
          </div>
        </div>

        <div className="flex space-x-6">
          {/* items-center */}
          {/* Active Users */}
          <div className="flex items-center space-x-1">
            <span className="text-sm">247 active users</span>
          </div>

          {/* Revenue */}
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">$2,499 in revenue</span>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="hover:bg-blue-700 p-1 rounded-full transition-colors duration-200"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
