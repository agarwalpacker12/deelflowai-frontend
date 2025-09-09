import React, { useState } from "react";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";

const AchievementsTable = () => {
  // Mock achievement data based on the provided JSON
  const mockAchievements = [
    {
      id: 1,
      user_id: 1,
      achievement_type: "deal_milestone",
      achievement_name: "First Deal Closed",
      points_earned: 100,
      metadata: {
        deal_id: 1,
        deal_value: 15000.0,
      },
      earned_at: "2025-06-26T20:00:00.000000Z",
    },
    {
      id: 2,
      user_id: 1,
      achievement_type: "performance_metric",
      achievement_name: "High Conversion Rate",
      points_earned: 75,
      metadata: {
        conversion_rate: 15.5,
        campaign_id: 3,
      },
      earned_at: "2025-06-28T14:30:00.000000Z",
    },
    {
      id: 3,
      user_id: 1,
      achievement_type: "activity_milestone",
      achievement_name: "Campaign Master",
      points_earned: 50,
      metadata: {
        campaigns_completed: 5,
      },
      earned_at: "2025-07-01T09:15:00.000000Z",
    },
    {
      id: 4,
      user_id: 1,
      achievement_type: "deal_milestone",
      achievement_name: "Deal Streak",
      points_earned: 125,
      metadata: {
        streak_count: 3,
        total_value: 45000.0,
      },
      earned_at: "2025-07-05T16:45:00.000000Z",
    },
  ];

  const summary = {
    total_points: 350,
    current_level: 2,
    points_to_next_level: 150,
    total_achievements: 5,
  };

  const [filterType, setFilterType] = useState("");
  const [perPage, setPerPage] = useState(10);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAchievementTypeColor = (type) => {
    switch (type) {
      case "deal_milestone":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "performance_metric":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "activity_milestone":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "engagement_reward":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getMetadataDisplay = (metadata, achievementType) => {
    if (!metadata) return "-";

    switch (achievementType) {
      case "deal_milestone":
        if (metadata.deal_value) {
          return `Deal: ${formatCurrency(metadata.deal_value)}`;
        }
        if (metadata.total_value) {
          return `Total: ${formatCurrency(metadata.total_value)}`;
        }
        return "-";
      case "performance_metric":
        if (metadata.conversion_rate) {
          return `${metadata.conversion_rate}% conversion`;
        }
        return "-";
      case "activity_milestone":
        if (metadata.campaigns_completed) {
          return `${metadata.campaigns_completed} campaigns`;
        }
        return "-";
      default:
        return "-";
    }
  };

  const filteredAchievements = filterType
    ? mockAchievements.filter(
        (achievement) => achievement.achievement_type === filterType
      )
    : mockAchievements;

  const getLevelProgress = () => {
    const totalPointsForNextLevel =
      summary.total_points + summary.points_to_next_level;
    const progress = (summary.total_points / totalPointsForNextLevel) * 100;
    return Math.min(progress, 100);
  };

  return (
    <MainContentWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">User Achievements</h1>
          <div className="text-sm text-gray-400">
            Total: {summary.total_achievements} Achievements
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="text-2xl font-bold text-white">
              {summary.total_points}
            </div>
            <div className="text-sm text-gray-400">Total Points</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="text-2xl font-bold text-blue-400">
              Level {summary.current_level}
            </div>
            <div className="text-sm text-gray-400">Current Level</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">
              {summary.points_to_next_level}
            </div>
            <div className="text-sm text-gray-400">Points to Next Level</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="text-2xl font-bold text-green-400">
              {summary.total_achievements}
            </div>
            <div className="text-sm text-gray-400">Total Achievements</div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">
              Level {summary.current_level} Progress
            </span>
            <span className="text-gray-400 text-sm">
              {summary.total_points} /{" "}
              {summary.total_points + summary.points_to_next_level} points
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getLevelProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Achievement Type Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Achievement Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
              >
                <option value="">All Types</option>
                <option value="deal_milestone">Deal Milestone</option>
                <option value="performance_metric">Performance Metric</option>
                <option value="activity_milestone">Activity Milestone</option>
                <option value="engagement_reward">Engagement Reward</option>
              </select>
            </div>

            {/* Per Page */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Per Page
              </label>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Actions
              </label>
              <button
                onClick={() => setFilterType("")}
                className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>↻</span>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Achievements Table */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Achievement
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Earned At
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredAchievements.slice(0, perPage).map((achievement) => (
                  <tr
                    key={achievement.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            🏆
                          </span>
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">
                            {achievement.achievement_name}
                          </div>
                          <div className="text-gray-400 text-xs">
                            ID: {achievement.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border capitalize ${getAchievementTypeColor(
                          achievement.achievement_type
                        )}`}
                      >
                        {achievement.achievement_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-white text-sm font-bold">
                        +{achievement.points_earned}
                      </div>
                      <div className="text-gray-400 text-xs">points</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-white text-xs">
                        {getMetadataDisplay(
                          achievement.metadata,
                          achievement.achievement_type
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-white text-xs">
                        {formatDate(achievement.earned_at)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded text-xs">
                          View
                        </button>
                        <button className="text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 rounded text-xs">
                          Share
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing 1 to {Math.min(perPage, filteredAchievements.length)} of{" "}
              {filteredAchievements.length} achievements
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span>‹</span>
              </button>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 rounded-lg text-sm transition-colors bg-blue-500 text-white">
                  1
                </button>
              </div>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span>›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default AchievementsTable;
