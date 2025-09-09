import React from "react";

const AddAchievementForm = () => {
  const achievementTypes = [
    { value: "deal_milestone", label: "Deal Milestone" },
    { value: "performance_metric", label: "Performance Metric" },
    { value: "activity_milestone", label: "Activity Milestone" },
    { value: "engagement_reward", label: "Engagement Reward" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-8">
            {/* Achievement Basic Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Achievement Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achievement Type *
                  </label>
                  <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300">
                    {achievementTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points Earned *
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    placeholder="100"
                    min="1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achievement Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    placeholder="e.g., First Deal Closed"
                  />
                </div>
              </div>
            </div>

            {/* Achievement Metadata */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Achievement Details
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Add specific metadata based on the achievement type selected
                above.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal ID
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Value ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    placeholder="15000.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign ID
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conversion Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    placeholder="15.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaigns Completed
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Streak Count
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    placeholder="3"
                  />
                </div>
              </div>
            </div>

            {/* Achievement Description */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Additional Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    placeholder="Describe what this achievement represents..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge Icon (emoji or text)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    placeholder="🏆"
                  />
                </div>
              </div>
            </div>

            {/* Achievement Settings */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Achievement Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_repeatable"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="is_repeatable"
                    className="text-sm font-medium text-gray-700"
                  >
                    Repeatable Achievement
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Allow users to earn this achievement multiple times
                </p>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="is_featured"
                    className="text-sm font-medium text-gray-700"
                  >
                    Featured Achievement
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Highlight this achievement in the achievements gallery
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button className="px-8 py-4 rounded-lg font-semibold text-white transition-all transform hover:scale-105 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl">
                Create Achievement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAchievementForm;
