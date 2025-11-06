import React, { useEffect, useState } from "react";
import { Mail, X, Check, Crown, Zap, Star, Shield } from "lucide-react";
import SavedPropertiesPage from "../PropertiesSave/Table";
import DealsPage from "../Deals/DealsPage";
import PricingTable from "../pricing/page";
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Investor",
  phone: "+1 234 567 890",
  currentPlan: "free",
};
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Get user details from localStorage
  let userDetails = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      userDetails = JSON.parse(userStr);
    }
  } catch (e) {
    userDetails = null;
  }

  const user = userDetails
    ? {
        name: `${userDetails.first_name || ""} ${
          userDetails.last_name || ""
        }`.trim(),
        email: userDetails.email || "",
        role: userDetails.role || "",
        phone: userDetails.phone || "",
        currentPlan: userDetails.plan || "free",
      }
    : mockUser;

  const handleBackNavigation = () => {
    window.history.back();
  };

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    // Handle upgrade logic here
    console.log("Upgrading to:", selectedPlan);
    setShowUpgradeModal(false);
    // Update user plan in localStorage
    if (userDetails) {
      userDetails.plan = selectedPlan.id;
      localStorage.setItem("user", JSON.stringify(userDetails));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Account</h1>
        <button
          onClick={handleBackNavigation}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
          aria-label="Go back"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/20 mb-8">
        <ul className="flex flex-wrap gap-2">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-white/10 text-white border-b-2 border-purple-400"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
                activeTab === "subscription"
                  ? "bg-white/10 text-white border-b-2 border-purple-400"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Subscription
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("property")}
              className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
                activeTab === "property"
                  ? "bg-white/10 text-white border-b-2 border-purple-400"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Properties
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("deal-property")}
              className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
                activeTab === "deal-property"
                  ? "bg-white/10 text-white border-b-2 border-purple-400"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Deals
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <div className="flex justify-center">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/10">
            <div className="flex flex-col items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-1">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
                  <Star className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                {user.role && (
                  <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    {user.role}
                  </span>
                )}
              </div>

              {/* Current Plan Badge */}
              <div className="w-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-2">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Current Plan</p>
                      <p className="text-white font-semibold text-lg capitalize">
                        {user.currentPlan}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("subscription")}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all transform hover:scale-105"
                  >
                    Upgrade
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-xs">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                    <div>
                      <p className="text-gray-400 text-xs">Phone</p>
                      <p className="text-white">{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3 mt-4">
                <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all transform hover:scale-105">
                  Edit Profile
                </button>
                <button
                  className="w-full px-6 py-3 rounded-xl bg-red-600/80 hover:bg-red-700 text-white font-semibold transition-all"
                  onClick={async () => {
                    try {
                      // await authAPI.logout();
                    } catch (e) {}
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        // <div className="max-w-7xl mx-auto">
        //   {/* Header */}
        //   <div className="text-center mb-12">
        //     <h2 className="text-4xl font-bold text-white mb-4">
        //       Choose Your Plan
        //     </h2>
        //     <p className="text-gray-300 text-lg">
        //       Unlock premium features and take your investment journey to the
        //       next level
        //     </p>
        //   </div>

        //   {/* Plans Grid */}
        //   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        //     {subscriptionPlans.map((plan) => {
        //       const Icon = plan.icon;
        //       const isCurrentPlan = user.currentPlan === plan.id;

        //       return (
        //         <div
        //           key={plan.id}
        //           className={`relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border transition-all transform hover:scale-105 ${
        //             plan.popular
        //               ? "border-purple-500 shadow-2xl shadow-purple-500/20"
        //               : "border-white/10 hover:border-white/20"
        //           } ${isCurrentPlan ? "ring-2 ring-green-500" : ""}`}
        //         >
        //           {plan.popular && (
        //             <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        //               <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
        //                 MOST POPULAR
        //               </span>
        //             </div>
        //           )}

        //           {isCurrentPlan && (
        //             <div className="absolute -top-4 right-8">
        //               <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
        //                 CURRENT
        //               </span>
        //             </div>
        //           )}

        //           {/* Icon */}
        //           <div
        //             className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}
        //           >
        //             <Icon className="w-8 h-8 text-white" />
        //           </div>

        //           {/* Plan Name */}
        //           <h3 className="text-2xl font-bold text-white mb-2">
        //             {plan.name}
        //           </h3>
        //           <p className="text-gray-400 text-sm mb-6">{plan.limits}</p>

        //           {/* Price */}
        //           <div className="mb-8">
        //             <span className="text-5xl font-bold text-white">
        //               {plan.price}
        //             </span>
        //             <span className="text-gray-400">/ {plan.period}</span>
        //           </div>

        //           {/* Features */}
        //           <ul className="space-y-4 mb-8">
        //             {plan.features.map((feature, index) => (
        //               <li key={index} className="flex items-start gap-3">
        //                 <div className="mt-1 bg-green-500/20 rounded-full p-1">
        //                   <Check className="w-4 h-4 text-green-400" />
        //                 </div>
        //                 <span className="text-gray-300">{feature}</span>
        //               </li>
        //             ))}
        //           </ul>

        //           {/* CTA Button */}
        //           <button
        //             onClick={() => handleUpgrade(plan)}
        //             disabled={isCurrentPlan}
        //             className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${
        //               isCurrentPlan
        //                 ? "bg-gray-600 text-gray-400 cursor-not-allowed"
        //                 : plan.popular
        //                 ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
        //                 : "bg-white/10 hover:bg-white/20 text-white"
        //             }`}
        //           >
        //             {isCurrentPlan
        //               ? "Current Plan"
        //               : plan.id === "free"
        //               ? "Downgrade"
        //               : "Upgrade Now"}
        //           </button>
        //         </div>
        //       );
        //     })}
        //   </div>

        //   {/* FAQ or Additional Info */}
        //   <div className="mt-16 text-center">
        //     <p className="text-gray-400">
        //       Need a custom plan?{" "}
        //       <a
        //         href="#"
        //         className="text-purple-400 hover:text-purple-300 font-semibold"
        //       >
        //         Contact us
        //       </a>
        //     </p>
        //   </div>
        // </div>
        <PricingTable />
      )}

      {activeTab === "property" && <SavedPropertiesPage />}

      {activeTab === "deal-property" && <DealsPage />}

      {/* Upgrade Confirmation Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div
                className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${selectedPlan.color} flex items-center justify-center mb-4`}
              >
                {React.createElement(selectedPlan.icon, {
                  className: "w-10 h-10 text-white",
                })}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Upgrade to {selectedPlan.name}?
              </h3>
              <p className="text-gray-300">
                You'll be charged{" "}
                <span className="font-bold text-white">
                  {selectedPlan.price}
                </span>{" "}
                {selectedPlan.period}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-gray-300 text-sm mb-3">
                You'll get access to:
              </p>
              <ul className="space-y-2">
                {selectedPlan.features.slice(0, 3).map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-300 text-sm"
                  >
                    <Check className="w-4 h-4 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpgrade}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all transform hover:scale-105"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
