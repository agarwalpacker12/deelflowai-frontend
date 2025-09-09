import React, { useEffect, useState } from "react";
import { PaymentAPI } from "../../services/api";

// Billing Management Component
function BillingManagement({ subscriptionPackState, redirectStripeHandler }) {
  // Helper functions
  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatCardDisplay = (last4, brand) => {
    if (!last4) return "•••• ••••";
    return `•••• ${last4} (${capitalizeFirst(brand) || "Card"})`;
  };

  // Extract data from subscription state
  const { card_last4, card_brand } = subscriptionPackState || {};

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-white">Billing Management</h2>
        <button
          onClick={() => redirectStripeHandler()}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-purple-500/25"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Manage Billing Settings
        </button>
      </div>

      {/* Payment Method Section */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-slate-300 text-sm font-medium mb-2">
              Payment Method
            </h3>
            <div className="flex items-center gap-3">
              {/* Card Brand Icon */}
              <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {card_brand
                    ? capitalizeFirst(card_brand).slice(0, 4).toUpperCase()
                    : "CARD"}
                </span>
              </div>
              <span className="text-white font-semibold text-lg">
                {formatCardDisplay(card_last4, card_brand)}
              </span>
              {subscriptionPackState?.status === "active" && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                  Active
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => redirectStripeHandler()}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Update
          </button>
        </div>

        {/* Additional Payment Info */}
        {subscriptionPackState && (
          <div className="mt-4 pt-4 border-t border-slate-600/30">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Customer ID:</span>
                <span className="text-slate-300 ml-2">
                  {subscriptionPackState.stripe_customer_id || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Subscription ID:</span>
                <span className="text-slate-300 ml-2">
                  {subscriptionPackState.stripe_subscription_id
                    ? `...${subscriptionPackState.stripe_subscription_id.slice(
                        -8
                      )}`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Billing Details and Tax Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Details Card */}
        <div
          onClick={() => redirectStripeHandler()}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors duration-300">
              <svg
                className="w-8 h-8 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Billing Details
            </h3>
            <p className="text-slate-400 text-sm mb-3">
              Update billing information
            </p>
            {subscriptionPackState?.organization && (
              <div className="text-xs text-slate-500">
                <p>Organization: {subscriptionPackState.organization.name}</p>
                {subscriptionPackState.organization.business_email && (
                  <p>
                    Email: {subscriptionPackState.organization.business_email}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tax Settings Card */}
        <div
          onClick={() => redirectStripeHandler()}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors duration-300">
              <svg
                className="w-8 h-8 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Tax Settings
            </h3>
            <p className="text-slate-400 text-sm mb-3">
              Manage tax information
            </p>
            {subscriptionPackState?.organization && (
              <div className="text-xs text-slate-500">
                <p>
                  Country:{" "}
                  {subscriptionPackState.organization.country || "Not set"}
                </p>
                <p>
                  State:{" "}
                  {subscriptionPackState.organization.state_province ||
                    "Not set"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrentPack({ redirectStripeHandler }) {
  const [subscriptionPackState, setSubscriptionPackState] = useState();

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await PaymentAPI.getCurrentPack();
        console.log(response.data.data);
        if (response.data.status == "success") {
          setSubscriptionPackState(response.data.data); // Use actual API response
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
        // Fallback to currentData if API fails
        setSubscriptionPackState(currentData);
      }
    };

    fetchInvitation();
  }, []);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled":
      case "canceled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "past_due":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Show loading state if data is not loaded
  if (!subscriptionPackState) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-white/10 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-white/10 rounded mb-2 w-2/3"></div>
        </div>
      </div>
    );
  }

  const {
    package: packageInfo,
    status,
    current_period_end,
    card_last4,
    card_brand,
  } = subscriptionPackState;

  return (
    <div>
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-xl font-semibold text-white">
            Current Subscription
          </h2>
          {/* <button
            onClick={() => redirectStripeHandler()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            Change Plan
          </button> */}
        </div>

        {/* Subscription Plan Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {packageInfo?.name || "N/A"} Plan
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                    status
                  )}`}
                >
                  {capitalizeFirst(status) || "Unknown"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {packageInfo?.amount
                  ? formatCurrency(packageInfo.amount, packageInfo.currency)
                  : "N/A"}
              </div>
              <div className="text-slate-400 text-sm">
                per {packageInfo?.interval || "month"}, billed{" "}
                {packageInfo?.interval === "year" ? "annually" : "monthly"}
              </div>
            </div>
          </div>

          {/* User Licenses Progress - keeping the static data for now */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-300 font-medium">User Licenses</span>
              <span className="text-slate-400 text-sm">24 of 50 used</span>
            </div>
            <div className="relative">
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: "48%" }}
                ></div>
              </div>
              <div className="text-right mt-2">
                <span className="text-slate-400 text-xs">
                  26 seats available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Details */}
        <div className="border-t border-slate-700/50 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-300">Next billing date</span>
                <span className="text-white font-medium">
                  {formatDate(current_period_end)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-300">Billing cycle</span>
                <span className="text-white font-medium">
                  {capitalizeFirst(packageInfo?.interval || "monthly")}
                </span>
              </div>
            </div>
            <div>
              {/* Payment Method */}
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-300">Payment method</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {capitalizeFirst(card_brand) || "CARD"}
                    </span>
                  </div>
                  <span className="text-white font-medium">
                    •••• {card_last4 || "****"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-300">Plan description</span>
                <span className="text-white font-medium">
                  {packageInfo?.description || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Management Section */}
      <BillingManagement
        subscriptionPackState={subscriptionPackState}
        redirectStripeHandler={redirectStripeHandler}
      />
    </div>
  );
}

export default CurrentPack;
