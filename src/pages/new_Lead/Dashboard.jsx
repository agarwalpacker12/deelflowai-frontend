import React, { useState, useEffect, useRef } from "react";
import ChannelCard from "./ChannelCard";
import MetricBox from "./MetricBox";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";
import { campaignsAPI } from "../../services/api";

const DashboardView = ({
  heatMapData,
  getHeatColor,
  heatMapHover,
  roiData,
  setHeatMapHover, // Add this as a prop
}) => {
  const [activeCampaignData, setActiveCampaignData] = useState({
    totalActive: 0,
    leadsToday: 0,
    leadsTrend: "0%",
    responseRate: 0,
    loading: true,
    error: null,
  });

  // Add state for lead conversion funnel data
  const [leadFunnelData, setLeadFunnelData] = useState({
    leads: 0,
    qualified: 0,
    converted: 0,
    loading: true,
    error: null,
  });

  // Add state for channel response rates
  const [channelResponseData, setChannelResponseData] = useState({
    channels: [],
    loading: true,
    error: null,
  });

  // Add state for performance overview data
  const [performanceOverviewData, setPerformanceOverviewData] = useState({
    campaigns: [],
    loading: true,
    error: null,
  });

  // Add ref to prevent double API calls
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;
    // Combined function to fetch all data
    const fetchAllData = async () => {
      console.log("Fetching all dashboard data...");

      // Fetch active campaigns
      try {
        setActiveCampaignData((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        const response = await campaignsAPI.getActiveCampaigns();
        console.log("Active campaigns response:", response);

        setActiveCampaignData({
          totalActive: response.data?.data?.total_active || 0,
          leadsToday: response.data?.data?.leads_today || 0,
          leadsTrend: `${response.data?.data?.leads_today_change_pct || 0}%`,
          responseRate: response.data?.data?.response_rate || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching active campaigns:", error);
        setActiveCampaignData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load campaign data",
        }));
      }

      // Fetch lead conversion funnel
      try {
        setLeadFunnelData((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        const response = await campaignsAPI.getLeadConversionFunnel();
        console.log("Lead funnel response:", response);

        setLeadFunnelData({
          leads: response.data?.data?.leads || 0,
          qualified: response.data?.data?.qualified || 0,
          converted: response.data?.data?.converted || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching lead conversion funnel:", error);
        setLeadFunnelData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load funnel data",
        }));
      }

      // Fetch channel response rates
      try {
        setChannelResponseData((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        const response = await campaignsAPI.getChannelResponseRates();
        console.log("Channel response rates:", response);

        setChannelResponseData({
          channels: response.data?.data || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching channel response rates:", error);
        setChannelResponseData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load channel response rates",
        }));
      }

      // Fetch performance overview
      try {
        setPerformanceOverviewData((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }));

        const response = await campaignsAPI.getPerformanceOverview();
        console.log("Performance overview response:", response);

        // Handle the specific response format from your API
        const campaignData = response.data?.data || response.data || [];

        setPerformanceOverviewData({
          campaigns: campaignData,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching performance overview:", error);
        setPerformanceOverviewData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load performance overview",
        }));
      }
    };

    // Call the combined function
    fetchAllData();

    // Cleanup function
    return () => {
      hasInitialized.current = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Campaign Dashboard Overview */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 -m-8 mb-8 p-8 rounded-t-2xl">
          <h2 className="text-3xl font-bold text-white mb-2">
            Campaign Dashboard
          </h2>
          <p className="text-purple-100">
            Central hub for managing all marketing campaigns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Active Campaigns Card - Updated with API data */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-1">
                Active Campaigns
              </h3>
              <p className="text-sm text-white/70">
                Real-time performance tracking
              </p>
            </div>

            {activeCampaignData.loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white/70">Total Active</div>
                    <div className="h-8 w-12 bg-white/20 rounded mt-1"></div>
                  </div>
                  <div className="h-6 w-16 bg-white/20 rounded"></div>
                </div>
                <div className="h-16 bg-white/10 rounded-lg"></div>
                <div className="h-20 bg-white/5 rounded-lg"></div>
              </div>
            ) : activeCampaignData.error ? (
              <div className="space-y-4">
                <div className="text-red-300 text-sm">
                  {activeCampaignData.error}
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-purple-300 hover:text-white text-sm underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white/70">Total Active</div>
                    <div className="text-2xl font-bold text-white">
                      {activeCampaignData.totalActive}
                    </div>
                  </div>
                  <StatusBadge status="active">
                    <span className="animate-pulse">LIVE</span>
                  </StatusBadge>
                </div>

                <MetricBox
                  label="Leads Today"
                  value={activeCampaignData.leadsToday.toString()}
                  trend={activeCampaignData.leadsTrend}
                />

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm text-white/70">Response Rate</div>
                      <div className="text-2xl font-bold text-white">
                        {activeCampaignData.responseRate}%
                      </div>
                    </div>
                  </div>
                  <ProgressBar percentage={activeCampaignData.responseRate} />
                </div>
              </div>
            )}
          </div>

          {/* Lead Funnel Visualization - Updated with API data */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-1">
                Lead Conversion Funnel
              </h3>
              <p className="text-sm text-white/70">
                Track progress through stages
              </p>
            </div>

            {leadFunnelData.loading ? (
              <div className="flex items-center justify-between animate-pulse">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mb-2"></div>
                  <div className="h-3 w-10 bg-white/20 rounded"></div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mb-2"></div>
                  <div className="h-3 w-12 bg-white/20 rounded"></div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full mb-2"></div>
                  <div className="h-3 w-14 bg-white/20 rounded"></div>
                </div>
              </div>
            ) : leadFunnelData.error ? (
              <div className="text-center">
                <div className="text-red-300 text-sm mb-2">
                  {leadFunnelData.error}
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-purple-300 hover:text-white text-sm underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                    {leadFunnelData.leads}
                  </div>
                  <div className="text-xs font-semibold text-white/70">
                    Leads
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                    {leadFunnelData.qualified}
                  </div>
                  <div className="text-xs font-semibold text-white/70">
                    Qualified
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                    {leadFunnelData.converted}
                  </div>
                  <div className="text-xs font-semibold text-white/70">
                    Converted
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Channel Overview */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-1">
                Multi-Channel Outreach
              </h3>
              <p className="text-sm text-white/70">
                Automated communication channels
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <ChannelCard icon="📧" name="Email" status="Active" />
              <ChannelCard icon="💬" name="SMS" status="Active" />
              <ChannelCard icon="📱" name="Voice" status="Active" />
              <ChannelCard icon="💬" name="WhatsApp" status="Setup" />
            </div>
            <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all">
              Configure Channels
            </button>
          </div>
        </div>

        {/* Heat Map Visualization */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-xl">
            <h3 className="text-xl font-semibold text-white mb-1">
              Opportunity Heat Map - Florida Market
            </h3>
            <p className="text-sm text-purple-100">
              Real-time market analysis with AI scoring
            </p>
          </div>
          <div className="p-6">
            <div className="bg-white/5 rounded-xl p-6 h-96 relative overflow-hidden">
              <div className="grid grid-cols-10 grid-rows-8 gap-1 h-full">
                {heatMapData.map((cell) => (
                  <div
                    key={cell.id}
                    className={`${getHeatColor(
                      cell.score
                    )} rounded cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10 hover:shadow-lg ${
                      cell.score >= 80
                        ? "opacity-80"
                        : cell.score >= 50
                        ? "opacity-60"
                        : "opacity-40"
                    }`}
                    title={`${cell.county}: Score ${cell.score}`}
                    onMouseEnter={() => setHeatMapHover(cell)}
                    onMouseLeave={() => setHeatMapHover(null)}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg">
                <div className="font-semibold mb-2 text-white">
                  Opportunity Score
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-white/80">High (80-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-white/80">Medium (50-79)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-white/80">Low (0-49)</span>
                  </div>
                </div>
              </div>

              {heatMapHover && (
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg">
                  <div className="font-semibold text-white">
                    {heatMapHover.county}
                  </div>
                  <div className="text-sm text-white/70">
                    Score: {heatMapHover.score}
                  </div>
                </div>
              )}
            </div>

            {/* Metrics Below Map */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <MetricBox label="Total Properties" value="2,847" />
              <MetricBox label="Distressed" value="423" color="text-red-300" />
              <MetricBox
                label="Competition"
                value="Medium"
                color="text-yellow-300"
              />
              <MetricBox label="Avg ROI" value="287%" color="text-green-300" />
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-xl">
            <h3 className="text-xl font-semibold text-white mb-1">
              Performance Overview
            </h3>
            <p className="text-sm text-purple-100">Last 30 days</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ROI Chart - Updated with API data */}
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-white">
                  ROI by Campaign Type
                </h4>

                {performanceOverviewData.loading ? (
                  <div className="space-y-4 animate-pulse">
                    {[...Array(4)].map((_, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <div className="h-4 w-24 bg-white/20 rounded"></div>
                          <div className="h-4 w-12 bg-white/20 rounded"></div>
                        </div>
                        <div className="h-2 bg-white/10 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : performanceOverviewData.error ? (
                  <div className="text-center text-red-300 text-sm">
                    {performanceOverviewData.error}
                    <br />
                    <button
                      onClick={() => window.location.reload()}
                      className="text-purple-300 hover:text-white underline mt-2"
                    >
                      Try again
                    </button>
                  </div>
                ) : performanceOverviewData.campaigns.length > 0 ? (
                  <div className="space-y-4">
                    {performanceOverviewData.campaigns.map((item, index) => {
                      // Handle both object format {campaign_type: "Name", roi: 287}
                      // and key-value format {"Heat Mapping": 287}
                      let campaignName, roiValue;

                      if (
                        typeof item === "object" &&
                        (item.campaign_type || item.name)
                      ) {
                        // Standard object format
                        campaignName = item.campaign_type || item.name;
                        roiValue = item.roi || item.value || 0;
                      } else if (typeof item === "object") {
                        // Key-value pair format like {"Heat Mapping": 287}
                        const entries = Object.entries(item);
                        if (entries.length > 0) {
                          [campaignName, roiValue] = entries[0];
                        }
                      } else {
                        // Fallback
                        campaignName = `Campaign ${index + 1}`;
                        roiValue = 0;
                      }

                      // Parse percentage value (remove % if present)
                      const numericROI =
                        typeof roiValue === "string"
                          ? parseInt(roiValue.replace("%", ""))
                          : roiValue || 0;

                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-white/80">
                              {campaignName}
                            </span>
                            <span className="font-semibold text-white">
                              {numericROI}%
                            </span>
                          </div>
                          <ProgressBar
                            percentage={Math.min(numericROI / 3, 100)}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Fallback to static roiData if no API data
                  <div className="space-y-4">
                    {roiData.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-white/80">
                            {item.name}
                          </span>
                          <span className="font-semibold text-white">
                            {item.value}%
                          </span>
                        </div>
                        <ProgressBar percentage={item.value / 3} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Channel Performance - Updated with API data */}
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4 text-white">
                  Channel Response Rates
                </h4>

                {channelResponseData.loading ? (
                  <div className="grid grid-cols-2 gap-4 animate-pulse">
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-white/10 rounded-lg"
                      >
                        <div className="h-8 w-12 bg-white/20 rounded mx-auto mb-2"></div>
                        <div className="h-4 w-16 bg-white/20 rounded mx-auto"></div>
                      </div>
                    ))}
                  </div>
                ) : channelResponseData.error ? (
                  <div className="text-center text-red-300 text-sm">
                    {channelResponseData.error}
                    <br />
                    <button
                      onClick={() => window.location.reload()}
                      className="text-purple-300 hover:text-white underline mt-2"
                    >
                      Try again
                    </button>
                  </div>
                ) : channelResponseData.channels.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {channelResponseData.channels.map((channel, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-white/10 rounded-lg"
                      >
                        <div className="text-3xl font-bold text-white">
                          {channel.response_rate || channel.rate || 0}%
                        </div>
                        <div className="text-sm text-white/70">
                          {channel.channel_name ||
                            channel.name ||
                            `Channel ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-white/70 text-sm">
                    No channel data available
                  </div>
                )}
              </div>
            </div>

            {/* Conversion Funnel - Updated with API data */}
            <div className="mt-8 bg-white/5 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 text-white">
                Conversion Funnel Analysis
              </h4>

              {leadFunnelData.loading ? (
                <div className="flex items-center justify-between animate-pulse">
                  {[...Array(5)].map((_, index) => (
                    <React.Fragment key={index}>
                      <div className="text-center flex-1">
                        <div className="h-8 w-16 bg-white/20 rounded mb-2 mx-auto"></div>
                        <div className="h-4 w-20 bg-white/20 rounded mx-auto"></div>
                        <div className="mt-2 h-1 bg-white/20 rounded"></div>
                      </div>
                      {index < 4 && <div className="text-white/40">→</div>}
                    </React.Fragment>
                  ))}
                </div>
              ) : leadFunnelData.error ? (
                <div className="text-center text-red-300">
                  {leadFunnelData.error}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-white">
                      {leadFunnelData.leads}
                    </div>
                    <div className="text-sm text-white/70">Leads Generated</div>
                    <div className="mt-2 h-1 bg-blue-400 rounded"></div>
                  </div>
                  <div className="text-white/40">→</div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-white">
                      {Math.floor(leadFunnelData.leads * 0.43) || 0}
                    </div>
                    <div className="text-sm text-white/70">Contacted</div>
                    <div className="mt-2 h-1 bg-purple-400 rounded"></div>
                  </div>
                  <div className="text-white/40">→</div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-white">
                      {Math.floor(leadFunnelData.leads * 0.15) || 0}
                    </div>
                    <div className="text-sm text-white/70">Responded</div>
                    <div className="mt-2 h-1 bg-yellow-400 rounded"></div>
                  </div>
                  <div className="text-white/40">→</div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-white">
                      {leadFunnelData.qualified}
                    </div>
                    <div className="text-sm text-white/70">Qualified</div>
                    <div className="mt-2 h-1 bg-green-400 rounded"></div>
                  </div>
                  <div className="text-white/40">→</div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-green-300">
                      {leadFunnelData.converted}
                    </div>
                    <div className="text-sm text-white/70">Converted</div>
                    <div className="mt-2 h-1 bg-green-400 rounded"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
