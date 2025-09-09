const CampaignsRecipientPage = () => {
  // Sample engagement data based on your structure
  const engagementData = [
    {
      id: 1,
      campaign_id: 1,
      lead_id: 1,
      sent_at: "2025-06-27T10:00:00.000000Z",
      opened_at: "2025-06-27T10:15:00.000000Z",
      clicked_at: "2025-06-27T10:20:00.000000Z",
      responded_at: null,
      open_count: 2,
      click_count: 1,
      response_count: 0,
      created_at: "2025-06-27T20:00:00.000000Z",
      updated_at: "2025-06-27T20:00:00.000000Z",
    },
    {
      id: 2,
      campaign_id: 1,
      lead_id: 2,
      sent_at: "2025-06-27T10:00:00.000000Z",
      opened_at: "2025-06-27T10:25:00.000000Z",
      clicked_at: null,
      responded_at: null,
      open_count: 1,
      click_count: 0,
      response_count: 0,
      created_at: "2025-06-27T20:00:00.000000Z",
      updated_at: "2025-06-27T20:00:00.000000Z",
    },
    {
      id: 3,
      campaign_id: 2,
      lead_id: 3,
      sent_at: "2025-06-27T11:00:00.000000Z",
      opened_at: "2025-06-27T11:30:00.000000Z",
      clicked_at: "2025-06-27T11:35:00.000000Z",
      responded_at: "2025-06-27T12:00:00.000000Z",
      open_count: 3,
      click_count: 2,
      response_count: 1,
      created_at: "2025-06-27T20:00:00.000000Z",
      updated_at: "2025-06-27T20:00:00.000000Z",
    },
    {
      id: 4,
      campaign_id: 2,
      lead_id: 4,
      sent_at: "2025-06-27T11:00:00.000000Z",
      opened_at: null,
      clicked_at: null,
      responded_at: null,
      open_count: 0,
      click_count: 0,
      response_count: 0,
      created_at: "2025-06-27T20:00:00.000000Z",
      updated_at: "2025-06-27T20:00:00.000000Z",
    },
    {
      id: 5,
      campaign_id: 3,
      lead_id: 5,
      sent_at: "2025-06-27T12:00:00.000000Z",
      opened_at: "2025-06-27T12:45:00.000000Z",
      clicked_at: "2025-06-27T12:50:00.000000Z",
      responded_at: null,
      open_count: 1,
      click_count: 1,
      response_count: 0,
      created_at: "2025-06-27T20:00:00.000000Z",
      updated_at: "2025-06-27T20:00:00.000000Z",
    },
  ];

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEngagementStatus = (engagement) => {
    if (engagement.responded_at) {
      return {
        status: "responded",
        color: "bg-green-500/20 text-green-300 border-green-500/30",
      };
    } else if (engagement.clicked_at) {
      return {
        status: "clicked",
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      };
    } else if (engagement.opened_at) {
      return {
        status: "opened",
        color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      };
    } else if (engagement.sent_at) {
      return {
        status: "sent",
        color: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      };
    } else {
      return {
        status: "pending",
        color: "bg-red-500/20 text-red-300 border-red-500/30",
      };
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            Campaign Recipients Tracking
          </h1>
          <div className="text-sm text-gray-400">
            Total: {engagementData.length} Interactions
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Campaign Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Campaign ID
              </label>
              <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white">
                <option value="">All Campaigns</option>
                <option value="1">Campaign 1</option>
                <option value="2">Campaign 2</option>
                <option value="3">Campaign 3</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Status</label>
              <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white">
                <option value="">All Statuses</option>
                <option value="responded">Responded</option>
                <option value="clicked">Clicked</option>
                <option value="opened">Opened</option>
                <option value="sent">Sent Only</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Date Range
              </label>
              <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white">
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Actions
              </label>
              <button className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 transition-colors flex items-center justify-center gap-2">
                <span>↻</span>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Campaign ID
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Lead ID
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Sent At
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Opened At
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Clicked At
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Responded At
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {engagementData.map((engagement) => {
                  const statusInfo = getEngagementStatus(engagement);
                  return (
                    <tr
                      key={engagement.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-4 text-white text-sm">
                        {engagement.id}
                      </td>
                      <td className="px-4 py-4 text-white text-sm">
                        {engagement.campaign_id}
                      </td>
                      <td className="px-4 py-4 text-white text-sm">
                        {engagement.lead_id}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border capitalize ${statusInfo.color}`}
                        >
                          {statusInfo.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-white text-xs">
                        {formatDateTime(engagement.sent_at)}
                      </td>
                      <td className="px-4 py-4 text-white text-xs">
                        {formatDateTime(engagement.opened_at)}
                      </td>
                      <td className="px-4 py-4 text-white text-xs">
                        {formatDateTime(engagement.clicked_at)}
                      </td>
                      <td className="px-4 py-4 text-white text-xs">
                        {formatDateTime(engagement.responded_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="text-white text-xs">
                            Opens: {engagement.open_count}
                          </div>
                          <div className="text-white text-xs">
                            Clicks: {engagement.click_count}
                          </div>
                          <div className="text-white text-xs">
                            Responses: {engagement.response_count}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded text-xs">
                            View
                          </button>
                          <button className="text-green-400 hover:text-green-300 transition-colors px-2 py-1 rounded text-xs">
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm">Total Sent</div>
            <div className="text-white text-2xl font-bold">
              {engagementData.filter((e) => e.sent_at).length}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm">Total Opens</div>
            <div className="text-white text-2xl font-bold">
              {engagementData.filter((e) => e.opened_at).length}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm">Total Clicks</div>
            <div className="text-white text-2xl font-bold">
              {engagementData.filter((e) => e.clicked_at).length}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="text-gray-400 text-sm">Total Responses</div>
            <div className="text-white text-2xl font-bold">
              {engagementData.filter((e) => e.responded_at).length}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing 1 to {engagementData.length} of {engagementData.length}{" "}
              interactions
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
    </div>
  );
};

export default CampaignsRecipientPage;
