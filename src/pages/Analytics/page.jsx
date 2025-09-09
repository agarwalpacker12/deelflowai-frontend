import { useState } from "react";
import {
  Brain,
  Target,
  Users,
  Calculator,
  TrendingDown,
  Timer,
} from "lucide-react";
import AIDealsAssessment from "./AIDealsAssessment";
import SocialProofSystem from "./SocialProofSystem";
import UrgencyScarcityTools from "./UrgencyScarcityTools";
import BehavioralAutomation from "./BehavioralAutomation";
import AnchoringEffects from "./AnchoringEffects";
import LossAversionTriggers from "./LossAversionTriggers";
import UrgencyIndicator from "./UrgencyIndicator";
import SocialProofIndicator from "./SocialProofIndicator";

// ==================== ENHANCED PSYCHOLOGICAL DASHBOARD WITH AI DEAL ASSESSMENT ====================

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState("deals");
  const [dealData, setDealData] = useState({
    currentDeal: {
      id: "DEAL-2024-001",
      address: "1247 Oak Street, Dallas, TX 75201",
      listPrice: 85000,
      estimatedARV: 158000,
      repairEstimate: 23000,
      potentialProfit: 38500,
      roi: 127,
      capRate: 8.2,
      cashFlow: 450,
      confidence: 94,
      marketComps: 12,
      daysOnMarket: 87,
      priceReductions: 2,
      lastReduction: "15 days ago",
      motivation: "High - Divorce Settlement",
      distressLevel: 8.5,
      timeline: "30-45 days",
      repairs: [
        {
          category: "HVAC",
          cost: 4500,
          urgency: "High",
          description: "Replace entire system",
        },
        {
          category: "Plumbing",
          cost: 3200,
          urgency: "Medium",
          description: "Update main line",
        },
        {
          category: "Electrical",
          cost: 2800,
          urgency: "High",
          description: "Panel upgrade",
        },
        {
          category: "Roofing",
          cost: 6500,
          urgency: "High",
          description: "Replace shingles",
        },
        {
          category: "Flooring",
          cost: 4000,
          urgency: "Low",
          description: "Hardwood refinish",
        },
        {
          category: "Kitchen",
          cost: 2000,
          urgency: "Medium",
          description: "Cosmetic updates",
        },
      ],
      recentActivity: [
        {
          date: "2 days ago",
          activity: "Price reduced by $5,000",
          impact: "positive",
        },
        {
          date: "1 week ago",
          activity: "New roof installed",
          impact: "positive",
        },
        {
          date: "2 weeks ago",
          activity: "HVAC system serviced",
          impact: "neutral",
        },
        { date: "1 month ago", activity: "Listed for sale", impact: "neutral" },
      ],
      neighborhood: {
        appreciation: 3.2,
        crimeRate: "Low",
        schools: "Good",
        walkability: 7.2,
        rentability: "High",
      },
    },
  });

  const [socialProofData, setSocialProofData] = useState({
    liveActivity: [
      {
        user: "Sarah M.",
        action: "closed $47K assignment",
        location: "Dallas, TX",
        time: "2 min ago",
        type: "success",
      },
      {
        user: "Mike T.",
        action: "found lead with 95% AI score",
        location: "Austin, TX",
        time: "5 min ago",
        type: "opportunity",
      },
      {
        user: "Jennifer L.",
        action: "deposited $15K escrow",
        location: "Houston, TX",
        time: "8 min ago",
        type: "transaction",
      },
      {
        user: "David Chen",
        action: "completed double close",
        location: "San Antonio, TX",
        time: "12 min ago",
        type: "success",
      },
      {
        user: "Lisa R.",
        action: "AI found perfect buyer match",
        location: "Fort Worth, TX",
        time: "15 min ago",
        type: "opportunity",
      },
    ],
    peerComparisons: [
      { metric: "Monthly Deals", you: 8, peers: 5.2, percentile: 85 },
      { metric: "Avg Profit", you: 28500, peers: 18200, percentile: 92 },
      { metric: "Close Rate", you: 73, peers: 45, percentile: 88 },
      { metric: "Days to Close", you: 2.3, peers: 18.5, percentile: 96 },
    ],
    testimonials: [
      {
        name: "John D.",
        location: "Dallas",
        quote: "Generated $180K in 6 months using AI lead scoring",
        rating: 5,
      },
      {
        name: "Maria S.",
        location: "Austin",
        quote: "The behavioral triggers increased my conversion by 340%",
        rating: 5,
      },
      {
        name: "Robert K.",
        location: "Houston",
        quote: "Closed 23 deals in 90 days with psychological automation",
        rating: 5,
      },
    ],
    trustSignals: {
      totalDeals: 47823,
      totalVolume: 2340000000,
      activeUsers: 12847,
      avgRating: 4.9,
      successRate: 94.2,
    },
  });

  const [urgencyScarcity, setUrgencyScarcity] = useState({
    limitedSpots: 23,
    timeRemaining: "4:23:17",
    dealsClosingToday: 47,
    opportunitiesExpiring: 12,
    priceIncreaseIn: "2 days",
    exclusiveAccess: true,
    currentPromotion: "Early Bird Special - 40% Off",
    usersViewing: 127,
    recentSignups: 8,
  });

  const [behavioralData, setBehavioralData] = useState({
    userProfile: {
      decisionStyle: "analytical",
      riskTolerance: "moderate",
      responsePattern: "evening_active",
      preferredChannel: "email",
      conversionTriggers: ["social_proof", "urgency", "authority"],
      engagementScore: 87,
      lifetimeValue: 15600,
      churnRisk: "low",
    },
    automationTriggers: [
      {
        name: "Welcome Sequence",
        status: "active",
        completion: 95,
        conversions: 34,
      },
      {
        name: "Abandoned Cart",
        status: "active",
        completion: 78,
        conversions: 12,
      },
      {
        name: "Re-engagement",
        status: "paused",
        completion: 45,
        conversions: 8,
      },
      {
        name: "Upsell Sequence",
        status: "active",
        completion: 82,
        conversions: 23,
      },
    ],
  });

  const [anchoringData, setAnchoringData] = useState({
    priceAnchors: [
      {
        label: "Enterprise Plan",
        price: 2997,
        position: "high",
        purpose: "anchor",
      },
      {
        label: "Professional Plan",
        price: 797,
        position: "target",
        purpose: "sweet_spot",
      },
      { label: "Starter Plan", price: 297, position: "low", purpose: "entry" },
    ],
    metricBenchmarks: [
      { metric: "AI Accuracy", yours: 94, industry: 67, elite: 89 },
      { metric: "Deal Velocity", yours: 2.3, industry: 18.5, elite: 5.2 },
      { metric: "Profit Margin", yours: 28.5, industry: 15.2, elite: 22.1 },
      { metric: "Success Rate", yours: 87, industry: 45, elite: 78 },
    ],
    socialAnchors: {
      totalUsers: "47,000+",
      dealsProcessed: "$2.3B+",
      avgProfit: "$28,500",
      topPerformer: "$180K/month",
    },
  });

  const [lossAversionData, setLossAversionData] = useState({
    opportunityCost: {
      dailyLoss: 2340,
      weeklyLoss: 16380,
      monthlyLoss: 70200,
      yearlyLoss: 842400,
    },
    competitorAdvantage: {
      dealsLost: 23,
      revenueGap: 145000,
      marketShare: 15.3,
      timeWasted: 340,
    },
    riskFactors: [
      {
        risk: "Market Downturn",
        probability: 30,
        impact: "High",
        mitigation: "AI Prediction",
      },
      {
        risk: "Competition",
        probability: 75,
        impact: "Medium",
        mitigation: "Speed Advantage",
      },
      {
        risk: "Regulatory Changes",
        probability: 20,
        impact: "Low",
        mitigation: "Compliance Tracking",
      },
    ],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Enhanced Header with Real-time Triggers */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  AI Deal Assessment & Psychology Center
                </h1>
                <div className="flex items-center space-x-6 text-sm text-gray-300">
                  <span className="flex items-center space-x-1">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <span>AI Analysis: 94% Accuracy</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>
                      {socialProofData.trustSignals.activeUsers.toLocaleString()}{" "}
                      Active
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Timer className="w-4 h-4 text-orange-400" />
                    <span>
                      Next price increase: {urgencyScarcity.priceIncreaseIn}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <UrgencyIndicator data={urgencyScarcity} />
              <SocialProofIndicator data={socialProofData.trustSignals} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-black/20 rounded-lg p-1">
          {[
            { id: "deals", label: "AI Deal Assessment", icon: Calculator },
            { id: "social", label: "Social Proof System", icon: Users },
            { id: "urgency", label: "Urgency & Scarcity", icon: Timer },
            { id: "behavioral", label: "Behavioral Automation", icon: Brain },
            { id: "anchoring", label: "Anchoring Effects", icon: Target },
            { id: "loss", label: "Loss Aversion", icon: TrendingDown },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {activeTab === "deals" && <AIDealsAssessment data={dealData} />}
        {activeTab === "social" && <SocialProofSystem data={socialProofData} />}
        {activeTab === "urgency" && (
          <UrgencyScarcityTools data={urgencyScarcity} />
        )}
        {activeTab === "behavioral" && (
          <BehavioralAutomation data={behavioralData} />
        )}
        {activeTab === "anchoring" && <AnchoringEffects data={anchoringData} />}
        {activeTab === "loss" && (
          <LossAversionTriggers data={lossAversionData} />
        )}
      </div>
    </div>
  );
};

// ==================== AI DEALS ASSESSMENT COMPONENT ====================

// const AIDealsAssessment = ({ data }) => {
//   const deal = data.currentDeal;

//   return (
//     <div className="space-y-6">
//       {/* Deal Overview */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold flex items-center space-x-2">
//                 <Home className="w-6 h-6 text-emerald-400" />
//                 <span>Property Analysis</span>
//               </h2>
//               <div className="flex items-center space-x-2">
//                 <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-sm text-gray-400">
//                   AI Confidence: {deal.confidence}%
//                 </span>
//               </div>
//             </div>

//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">{deal.address}</h3>
//               <div className="flex items-center space-x-4 text-sm text-gray-300">
//                 <span>{deal.daysOnMarket} days on market</span>
//                 <span>•</span>
//                 <span>{deal.priceReductions} price reductions</span>
//                 <span>•</span>
//                 <span>Last reduction: {deal.lastReduction}</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//               <div className="bg-blue-500/20 rounded-lg p-4 text-center">
//                 <div className="text-2xl font-bold text-blue-400">
//                   ${deal.listPrice.toLocaleString()}
//                 </div>
//                 <div className="text-sm text-gray-300">List Price</div>
//               </div>
//               <div className="bg-green-500/20 rounded-lg p-4 text-center">
//                 <div className="text-2xl font-bold text-green-400">
//                   ${deal.estimatedARV.toLocaleString()}
//                 </div>
//                 <div className="text-sm text-gray-300">Estimated ARV</div>
//               </div>
//               <div className="bg-orange-500/20 rounded-lg p-4 text-center">
//                 <div className="text-2xl font-bold text-orange-400">
//                   ${deal.repairEstimate.toLocaleString()}
//                 </div>
//                 <div className="text-sm text-gray-300">Repair Estimate</div>
//               </div>
//               <div className="bg-purple-500/20 rounded-lg p-4 text-center">
//                 <div className="text-2xl font-bold text-purple-400">
//                   ${deal.potentialProfit.toLocaleString()}
//                 </div>
//                 <div className="text-sm text-gray-300">Potential Profit</div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white/5 rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-gray-300">ROI</span>
//                   <span className="text-emerald-400 font-bold">
//                     {deal.roi}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-600 rounded-full h-2">
//                   <div
//                     className="h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
//                     style={{ width: "85%" }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="bg-white/5 rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-gray-300">Cap Rate</span>
//                   <span className="text-blue-400 font-bold">
//                     {deal.capRate}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-600 rounded-full h-2">
//                   <div
//                     className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
//                     style={{ width: "70%" }}
//                   ></div>
//                 </div>
//               </div>
//               <div className="bg-white/5 rounded-lg p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-gray-300">Cash Flow</span>
//                   <span className="text-yellow-400 font-bold">
//                     ${deal.cashFlow}/mo
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-600 rounded-full h-2">
//                   <div
//                     className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
//                     style={{ width: "60%" }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div>
//           <MotivationAnalysis deal={deal} />
//         </div>
//       </div>

//       {/* Detailed Analysis */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <RepairAnalysis repairs={deal.repairs} />
//         <RecentActivity activity={deal.recentActivity} />
//       </div>

//       {/* Neighborhood & Comparables */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <NeighborhoodAnalysis neighborhood={deal.neighborhood} />
//         <ComparableAnalysis comparables={deal.marketComps} />
//       </div>
//     </div>
//   );
// };

// ==================== SOCIAL PROOF SYSTEM ====================

// const SocialProofSystem = ({ data }) => {
//   return (
//     <div className="space-y-6">
//       {/* Trust Signals Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
//           <div className="text-3xl font-bold text-blue-400 mb-2">
//             {data.trustSignals.totalDeals.toLocaleString()}
//           </div>
//           <div className="text-sm text-gray-300">Total Deals Closed</div>
//         </div>
//         <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
//           <div className="text-3xl font-bold text-green-400 mb-2">
//             ${(data.trustSignals.totalVolume / 1000000).toFixed(1)}B
//           </div>
//           <div className="text-sm text-gray-300">Total Volume Processed</div>
//         </div>
//         <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30">
//           <div className="text-3xl font-bold text-orange-400 mb-2">
//             {data.trustSignals.activeUsers.toLocaleString()}
//           </div>
//           <div className="text-sm text-gray-300">Active Users Today</div>
//         </div>
//         <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
//           <div className="text-3xl font-bold text-purple-400 mb-2">
//             {data.trustSignals.successRate}%
//           </div>
//           <div className="text-sm text-gray-300">Success Rate</div>
//         </div>
//       </div>

//       {/* Live Activity Feed & Peer Comparisons */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <LiveActivityFeed activity={data.liveActivity} />
//         <PeerComparisons comparisons={data.peerComparisons} />
//       </div>

//       {/* Testimonials */}
//       <TestimonialsSection testimonials={data.testimonials} />
//     </div>
//   );
// };

// ==================== HELPER COMPONENTS ====================

// const UrgencyIndicator = ({ data }) => (
//   <div className="flex items-center space-x-4">
//     <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-2">
//       <div className="flex items-center space-x-2">
//         <Timer className="w-4 h-4 text-red-400 animate-pulse" />
//         <span className="text-sm font-bold text-red-300">
//           {data.timeRemaining}
//         </span>
//       </div>
//       <div className="text-xs text-gray-400">Early Bird Ends</div>
//     </div>
//     <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg px-3 py-2">
//       <div className="text-sm font-bold text-orange-300">
//         {data.limitedSpots} spots left
//       </div>
//       <div className="text-xs text-gray-400">Limited Access</div>
//     </div>
//   </div>
// );

// const SocialProofIndicator = ({ data }) => (
//   <div className="flex items-center space-x-4">
//     <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-2">
//       <div className="flex items-center space-x-2">
//         <UserCheck className="w-4 h-4 text-green-400" />
//         <span className="text-sm font-bold text-green-300">
//           {data.avgRating}/5
//         </span>
//       </div>
//       <div className="text-xs text-gray-400">User Rating</div>
//     </div>
//     <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg px-3 py-2">
//       <div className="text-sm font-bold text-blue-300">{data.successRate}%</div>
//       <div className="text-xs text-gray-400">Success Rate</div>
//     </div>
//   </div>
// );

// const MotivationAnalysis = ({ deal }) => (
//   <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//     <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//       <Brain className="w-5 h-5 text-purple-400" />
//       <span>Seller Motivation</span>
//     </h3>
//     <div className="space-y-4">
//       <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
//         <div className="flex items-center justify-between mb-2">
//           <span className="font-semibold text-red-300">Distress Level</span>
//           <span className="text-red-400 font-bold">
//             {deal.distressLevel}/10
//           </span>
//         </div>
//         <div className="w-full bg-gray-600 rounded-full h-2">
//           <div
//             className="h-2 bg-gradient-to-r from-red-600 to-red-400 rounded-full"
//             style={{ width: `${deal.distressLevel * 10}%` }}
//           ></div>
//         </div>
//       </div>
//       <div className="bg-white/5 rounded-lg p-4">
//         <div className="text-sm text-gray-300 mb-1">Motivation</div>
//         <div className="text-white font-semibold">{deal.motivation}</div>
//       </div>
//       <div className="bg-white/5 rounded-lg p-4">
//         <div className="text-sm text-gray-300 mb-1">Timeline</div>
//         <div className="text-white font-semibold">{deal.timeline}</div>
//       </div>
//     </div>
//   </div>
// );

// const RepairAnalysis = ({ repairs }) => (
//   <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//     <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//       <Hammer className="w-5 h-5 text-orange-400" />
//       <span>Repair Analysis</span>
//     </h3>
//     <div className="space-y-3">
//       {repairs.map((repair, index) => (
//         <div
//           key={index}
//           className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
//         >
//           <div className="flex-1">
//             <div className="flex items-center space-x-2 mb-1">
//               <span className="font-semibold text-white">
//                 {repair.category}
//               </span>
//               <span
//                 className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                   repair.urgency === "High"
//                     ? "bg-red-500/20 text-red-300"
//                     : repair.urgency === "Medium"
//                     ? "bg-yellow-500/20 text-yellow-300"
//                     : "bg-green-500/20 text-green-300"
//                 }`}
//               >
//                 {repair.urgency}
//               </span>
//             </div>
//             <div className="text-sm text-gray-400">{repair.description}</div>
//           </div>
//           <div className="text-lg font-bold text-orange-400">
//             ${repair.cost.toLocaleString()}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const RecentActivity = ({ activity }) => (
//   <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//     <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//       <Activity className="w-5 h-5 text-blue-400" />
//       <span>Recent Activity</span>
//     </h3>
//     <div className="space-y-3">
//       {activity.map((item, index) => (
//         <div
//           key={index}
//           className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
//         >
//           <div
//             className={`w-3 h-3 rounded-full ${
//               item.impact === "positive"
//                 ? "bg-green-400"
//                 : item.impact === "negative"
//                 ? "bg-red-400"
//                 : "bg-gray-400"
//             }`}
//           ></div>
//           <div className="flex-1">
//             <div className="text-white font-medium">{item.activity}</div>
//             <div className="text-sm text-gray-400">{item.date}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const NeighborhoodAnalysis = ({ neighborhood }) => (
//   <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//     <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//       <MapPin className="w-5 h-5 text-green-400" />
//       <span>Neighborhood Analysis</span>
//     </h3>
//     <div className="grid grid-cols-2 gap-4">
//       <div className="bg-white/5 rounded-lg p-3">
//         <div className="text-sm text-gray-300 mb-1">Appreciation</div>
//         <div className="text-lg font-bold text-green-400">
//           +{neighborhood.appreciation}%
//         </div>
//       </div>
//       <div className="bg-white/5 rounded-lg p-3">
//         <div className="text-sm text-gray-300 mb-1">Crime Rate</div>
//         <div className="text-lg font-bold text-blue-400">
//           {neighborhood.crimeRate}
//         </div>
//       </div>
//       <div className="bg-white/5 rounded-lg p-3">
//         <div className="text-sm text-gray-300 mb-1">Schools</div>
//         <div className="text-lg font-bold text-yellow-400">
//           {neighborhood.schools}
//         </div>
//       </div>
//       <div className="bg-white/5 rounded-lg p-3">
//         <div className="text-sm text-gray-300 mb-1">Walkability</div>
//         <div className="text-lg font-bold text-purple-400">
//           {neighborhood.walkability}/10
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const ComparableAnalysis = ({ comparables }) => (
//   <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//     <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//       <BarChart3 className="w-5 h-5 text-cyan-400" />
//       <span>Market Comparables</span>
//     </h3>
//     <div className="text-center">
//       <div className="text-4xl font-bold text-cyan-400 mb-2">{comparables}</div>
//       <div className="text-gray-300">Similar Properties Found</div>
//       <div className="mt-4 p-3 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
//         <div className="text-sm text-cyan-300">AI Confidence: 94%</div>
//         <div className="text-xs text-gray-400 mt-1">
//           Based on recent sales within 0.5 miles
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const LiveActivityFeed = ({ activity }) => (
//   <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//     <div className="flex items-center justify-between mb-4">
//       <h3 className="text-lg font-bold flex items-center space-x-2">
//         <Activity className="w-5 h-5 text-green-400" />
//         <span>Live Activity Feed</span>
//       </h3>
//       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//     </div>
//     <div className="space-y-3">
//       {activity.map((item, index) => (
//         <div
//           key={index}
//           className={`p-3 rounded-lg border transition-all ${
//             item.type === "success"
//               ? "bg-green-500/20 border-green-500/30"
//               : item.type === "opportunity"
//               ? "bg-blue-500/20 border-blue-500/30"
//               : "bg-orange-500/20 border-orange-500/30"
//           }`}
//         >
//           <div className="flex items-center justify-between mb-1">
//             <span className="font-semibold text-white">{item.user}</span>
//             <span className="text-xs text-gray-400">{item.time}</span>
//           </div>
//           <div className="text-sm text-gray-300">{item.action}</div>
//           <div className="text-xs text-gray-400">{item.location}</div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const PeerComparisons = ({ comparisons }) => (
//   <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//     <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//       <Users className="w-5 h-5 text-blue-400" />
//       <span>Peer Comparisons</span>
//     </h3>
//     <div className="space-y-4">
//       {comparisons.map((comp, index) => (
//         <div key={index} className="p-4 bg-white/5 rounded-lg">
//           <div className="flex items-center justify-between mb-2">
//             <span className="font-semibold text-white">{comp.metric}</span>
//             <span className="text-xs text-gray-400">
//               {comp.percentile}th percentile
//             </span>
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center space-x-2">
//               <span className="text-green-400">
//                 You:{" "}
//                 {typeof comp.you === "number" && comp.you > 1000
//                   ? comp.you.toLocaleString()
//                   : comp.you}
//               </span>
//               <ArrowUp className="w-4 h-4 text-green-400" />
//             </div>
//             <span className="text-gray-400">
//               Peers:{" "}
//               {typeof comp.peers === "number" && comp.peers > 1000
//                 ? comp.peers.toLocaleString()
//                 : comp.peers}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const TestimonialsSection = ({ testimonials }) => (
//   <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//     <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//       <Star className="w-5 h-5 text-yellow-400" />
//       <span>Success Stories</span>
//     </h3>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       {testimonials.map((testimonial, index) => (
//         <div
//           key={index}
//           className="p-4 bg-white/5 rounded-lg border border-white/10"
//         >
//           <div className="flex items-center mb-3">
//             {[...Array(testimonial.rating)].map((_, i) => (
//               <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
//             ))}
//           </div>
//           <p className="text-sm text-gray-300 mb-3">"{testimonial.quote}"</p>
//           <div className="flex items-center justify-between">
//             <span className="font-semibold text-white">{testimonial.name}</span>
//             <span className="text-xs text-gray-400">
//               {testimonial.location}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// ==================== URGENCY & SCARCITY TOOLS ====================

// const UrgencyScarcityTools = ({ data }) => (
//   <div className="space-y-6">
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-red-500/30">
//         <Timer className="w-8 h-8 text-red-400 mb-3" />
//         <div className="text-2xl font-bold text-red-400 mb-2">
//           {data.timeRemaining}
//         </div>
//         <div className="text-sm text-gray-300">Early Bird Expires</div>
//       </div>
//       <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-6 border border-orange-500/30">
//         <Users className="w-8 h-8 text-orange-400 mb-3" />
//         <div className="text-2xl font-bold text-orange-400 mb-2">
//           {data.limitedSpots}
//         </div>
//         <div className="text-sm text-gray-300">Spots Remaining</div>
//       </div>
//       <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
//         <Eye className="w-8 h-8 text-purple-400 mb-3" />
//         <div className="text-2xl font-bold text-purple-400 mb-2">
//           {data.usersViewing}
//         </div>
//         <div className="text-sm text-gray-300">Users Viewing Now</div>
//       </div>
//       <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
//         <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
//         <div className="text-2xl font-bold text-green-400 mb-2">
//           {data.dealsClosingToday}
//         </div>
//         <div className="text-sm text-gray-300">Deals Closing Today</div>
//       </div>
//     </div>

//     <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl p-6 border border-red-500/30">
//       <h3 className="text-lg font-bold mb-4 text-red-300">
//         🔥 Limited Time Offer
//       </h3>
//       <div className="text-3xl font-bold text-white mb-2">
//         {data.currentPromotion}
//       </div>
//       <div className="text-gray-300 mb-4">
//         Don't miss out on this exclusive opportunity - only {data.limitedSpots}{" "}
//         spots left!
//       </div>
//       <div className="bg-red-500/30 rounded-lg p-4 border border-red-500/50">
//         <div className="text-sm text-red-200">
//           ⚠️ Price increases to $997 in {data.priceIncreaseIn}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// ==================== BEHAVIORAL AUTOMATION ====================

// const BehavioralAutomation = ({ data }) => (
//   <div className="space-y-6">
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//         <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//           <Brain className="w-5 h-5 text-purple-400" />
//           <span>User Behavioral Profile</span>
//         </h3>
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-white/5 rounded-lg p-3">
//               <div className="text-sm text-gray-300 mb-1">Decision Style</div>
//               <div className="text-lg font-bold text-purple-400 capitalize">
//                 {data.userProfile.decisionStyle}
//               </div>
//             </div>
//             <div className="bg-white/5 rounded-lg p-3">
//               <div className="text-sm text-gray-300 mb-1">Risk Tolerance</div>
//               <div className="text-lg font-bold text-blue-400 capitalize">
//                 {data.userProfile.riskTolerance}
//               </div>
//             </div>
//             <div className="bg-white/5 rounded-lg p-3">
//               <div className="text-sm text-gray-300 mb-1">Engagement Score</div>
//               <div className="text-lg font-bold text-green-400">
//                 {data.userProfile.engagementScore}%
//               </div>
//             </div>
//             <div className="bg-white/5 rounded-lg p-3">
//               <div className="text-sm text-gray-300 mb-1">Lifetime Value</div>
//               <div className="text-lg font-bold text-yellow-400">
//                 ${data.userProfile.lifetimeValue.toLocaleString()}
//               </div>
//             </div>
//           </div>
//           <div className="bg-white/5 rounded-lg p-3">
//             <div className="text-sm text-gray-300 mb-2">
//               Top Conversion Triggers
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {data.userProfile.conversionTriggers.map((trigger, index) => (
//                 <span
//                   key={index}
//                   className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded"
//                 >
//                   {trigger.replace("_", " ")}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//         <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//           <Zap className="w-5 h-5 text-yellow-400" />
//           <span>Automation Triggers</span>
//         </h3>
//         <div className="space-y-3">
//           {data.automationTriggers.map((trigger, index) => (
//             <div key={index} className="p-3 bg-white/5 rounded-lg">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="font-semibold text-white">{trigger.name}</span>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                     trigger.status === "active"
//                       ? "bg-green-500/20 text-green-300"
//                       : "bg-gray-500/20 text-gray-300"
//                   }`}
//                 >
//                   {trigger.status}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-gray-300">
//                   Completion: {trigger.completion}%
//                 </span>
//                 <span className="text-blue-400">
//                   Conversions: {trigger.conversions}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// ==================== ANCHORING EFFECTS ====================

// const AnchoringEffects = ({ data }) => (
//   <div className="space-y-6">
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//         <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//           <Target className="w-5 h-5 text-blue-400" />
//           <span>Price Anchoring Strategy</span>
//         </h3>
//         <div className="space-y-4">
//           {data.priceAnchors.map((anchor, index) => (
//             <div
//               key={index}
//               className={`p-4 rounded-lg border ${
//                 anchor.purpose === "sweet_spot"
//                   ? "bg-green-500/20 border-green-500/50"
//                   : anchor.purpose === "anchor"
//                   ? "bg-blue-500/20 border-blue-500/50"
//                   : "bg-gray-500/20 border-gray-500/50"
//               }`}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <span className="font-semibold text-white">{anchor.label}</span>
//                 {anchor.purpose === "sweet_spot" && (
//                   <span className="px-2 py-1 bg-green-500/30 text-green-300 text-xs rounded-full">
//                     Most Popular
//                   </span>
//                 )}
//               </div>
//               <div className="text-2xl font-bold text-white">
//                 ${anchor.price.toLocaleString()}
//               </div>
//               <div className="text-sm text-gray-400 capitalize">
//                 {anchor.purpose.replace("_", " ")}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//         <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//           <BarChart3 className="w-5 h-5 text-green-400" />
//           <span>Performance Benchmarks</span>
//         </h3>
//         <div className="space-y-4">
//           {data.metricBenchmarks.map((benchmark, index) => (
//             <div key={index} className="p-3 bg-white/5 rounded-lg">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="font-semibold text-white">
//                   {benchmark.metric}
//                 </span>
//                 <span className="text-green-400 font-bold">
//                   {benchmark.yours}
//                   {benchmark.metric.includes("Rate") ||
//                   benchmark.metric.includes("Margin")
//                     ? "%"
//                     : benchmark.metric.includes("Days")
//                     ? " days"
//                     : ""}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-gray-400">
//                   Industry: {benchmark.industry}
//                   {benchmark.metric.includes("Rate") ||
//                   benchmark.metric.includes("Margin")
//                     ? "%"
//                     : benchmark.metric.includes("Days")
//                     ? " days"
//                     : ""}
//                 </span>
//                 <span className="text-blue-400">
//                   Elite: {benchmark.elite}
//                   {benchmark.metric.includes("Rate") ||
//                   benchmark.metric.includes("Margin")
//                     ? "%"
//                     : benchmark.metric.includes("Days")
//                     ? " days"
//                     : ""}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>

//     <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
//       <h3 className="text-lg font-bold mb-4 text-blue-300">
//         Social Anchoring Metrics
//       </h3>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="text-center">
//           <div className="text-2xl font-bold text-blue-400">
//             {data.socialAnchors.totalUsers}
//           </div>
//           <div className="text-sm text-gray-300">Total Users</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-green-400">
//             {data.socialAnchors.dealsProcessed}
//           </div>
//           <div className="text-sm text-gray-300">Deals Processed</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-yellow-400">
//             {data.socialAnchors.avgProfit}
//           </div>
//           <div className="text-sm text-gray-300">Avg Profit</div>
//         </div>
//         <div className="text-center">
//           <div className="text-2xl font-bold text-purple-400">
//             {data.socialAnchors.topPerformer}
//           </div>
//           <div className="text-sm text-gray-300">Top Performer</div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// ==================== LOSS AVERSION TRIGGERS ====================

// const LossAversionTriggers = ({ data }) => (
//   <div className="space-y-6">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-red-500/30">
//         <h3 className="text-lg font-bold mb-4 text-red-300 flex items-center space-x-2">
//           <TrendingDown className="w-5 h-5" />
//           <span>Opportunity Cost Analysis</span>
//         </h3>
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <span className="text-gray-300">Daily Loss</span>
//             <span className="text-red-400 font-bold">
//               ${data.opportunityCost.dailyLoss.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-300">Weekly Loss</span>
//             <span className="text-red-400 font-bold">
//               ${data.opportunityCost.weeklyLoss.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-300">Monthly Loss</span>
//             <span className="text-red-400 font-bold">
//               ${data.opportunityCost.monthlyLoss.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center justify-between border-t border-red-500/30 pt-3">
//             <span className="text-gray-300 font-semibold">Annual Loss</span>
//             <span className="text-red-400 font-bold text-lg">
//               ${data.opportunityCost.yearlyLoss.toLocaleString()}
//             </span>
//           </div>
//         </div>
//         <div className="mt-4 p-3 bg-red-500/30 rounded-lg">
//           <div className="text-sm text-red-200">
//             💸 Every day you wait costs you $
//             {data.opportunityCost.dailyLoss.toLocaleString()} in lost
//             opportunities
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-6 border border-orange-500/30">
//         <h3 className="text-lg font-bold mb-4 text-orange-300 flex items-center space-x-2">
//           <AlertTriangle className="w-5 h-5" />
//           <span>Competitive Disadvantage</span>
//         </h3>
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <span className="text-gray-300">Deals Lost</span>
//             <span className="text-orange-400 font-bold">
//               {data.competitorAdvantage.dealsLost}
//             </span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-300">Revenue Gap</span>
//             <span className="text-orange-400 font-bold">
//               ${data.competitorAdvantage.revenueGap.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-300">Market Share Lost</span>
//             <span className="text-orange-400 font-bold">
//               {data.competitorAdvantage.marketShare}%
//             </span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-300">Time Wasted</span>
//             <span className="text-orange-400 font-bold">
//               {data.competitorAdvantage.timeWasted} hours
//             </span>
//           </div>
//         </div>
//         <div className="mt-4 p-3 bg-orange-500/30 rounded-lg">
//           <div className="text-sm text-orange-200">
//             ⚠️ Competitors are gaining ground while you hesitate
//           </div>
//         </div>
//       </div>
//     </div>

//     <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
//       <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
//         <Shield className="w-5 h-5 text-blue-400" />
//         <span>Risk Mitigation Analysis</span>
//       </h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {data.riskFactors.map((risk, index) => (
//           <div
//             key={index}
//             className="p-4 bg-white/5 rounded-lg border border-white/10"
//           >
//             <div className="flex items-center justify-between mb-2">
//               <span className="font-semibold text-white">{risk.risk}</span>
//               <span
//                 className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                   risk.impact === "High"
//                     ? "bg-red-500/20 text-red-300"
//                     : risk.impact === "Medium"
//                     ? "bg-yellow-500/20 text-yellow-300"
//                     : "bg-green-500/20 text-green-300"
//                 }`}
//               >
//                 {risk.impact}
//               </span>
//             </div>
//             <div className="text-sm text-gray-300 mb-2">
//               Probability: {risk.probability}%
//             </div>
//             <div className="text-sm text-blue-400">
//               Mitigation: {risk.mitigation}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

export default AnalyticsPage;
