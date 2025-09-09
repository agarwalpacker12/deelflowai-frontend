import { Check, ArrowLeft } from "lucide-react";
import { PaymentAPI } from "../../services/api";
import { useEffect, useState } from "react";

function ShowPrice({ handlePlanSelect }) {
  const [subscriptionPackState, setSubscriptionPackState] = useState();

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await PaymentAPI.getSubscriptionPack();
        if (response.data.status == "success") {
          console.log(
            "subscriptionPackState",
            JSON.stringify(response.data.data)
          );
          setSubscriptionPackState(response?.data?.data);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchInvitation();
  }, []);

  // Helper function to get plan features based on plan name
  const getPlanFeatures = (planName) => {
    const features = {
      Basic: [
        "100 API Requests",
        "Basic Workflow Creation",
        "Email Support",
        "Standard Support",
      ],
      Professional: [
        "Everything in Basic",
        "Advanced Workflow Creation",
        "Priority Support",
        "Custom Requests",
        "Multiple User Access",
        "Advanced Analytics",
        "API Access",
      ],
      Enterprise: [
        "Everything in Professional",
        "White Label Solution",
        "Custom AI Training",
        "Dedicated Account Manager",
        "Custom Integrations",
        "Unlimited API Requests",
      ],
    };
    return features[planName] || [];
  };

  // Helper function to determine if plan is most popular
  const isMostPopular = (planName) => {
    return planName.toLowerCase() === "professional";
  };

  // Helper function to get button text
  const getButtonText = (planName) => {
    return planName.toLowerCase() === "enterprise"
      ? "Contact Sales"
      : "Select Plan";
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-full">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-6 px-6 rounded-t-xl shadow-lg relative">
            <button
              onClick={() => setShowPricing(false)}
              className="absolute left-4 top-6 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold mb-2">Choose Your Plan</h1>
            <p className="text-purple-100">
              Select a subscription plan that works for you
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="bg-white/95 backdrop-blur-sm rounded-b-xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-4 space-y-4">
              {subscriptionPackState &&
                subscriptionPackState.map((plan) => {
                  const isPopular = isMostPopular(plan.name);
                  const features = getPlanFeatures(plan.name);

                  return (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-4 relative ${
                        isPopular
                          ? "border-2 border-purple-500 bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                          : "border-purple-200 bg-purple-50/50"
                      }`}
                    >
                      {/* Most Popular Badge */}
                      {isPopular && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                            MOST POPULAR
                          </span>
                        </div>
                      )}

                      <div
                        className={`flex justify-between items-center mb-3 ${
                          isPopular ? "mt-2" : ""
                        }`}
                      >
                        <h3
                          className={`text-lg font-semibold ${
                            isPopular ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {plan.name}
                        </h3>
                      </div>

                      <div className="mb-4">
                        <span
                          className={`text-3xl font-bold ${
                            isPopular ? "text-white" : "text-purple-800"
                          }`}
                        >
                          ${plan.amount}
                        </span>
                        <span
                          className={`ml-2 ${
                            isPopular ? "text-purple-100" : "text-gray-600"
                          }`}
                        >
                          per {plan.interval}
                        </span>
                      </div>

                      {plan.description && (
                        <p
                          className={`text-sm mb-4 ${
                            isPopular ? "text-purple-100" : "text-gray-600"
                          }`}
                        >
                          {plan.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-4">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <Check
                              className={`w-4 h-4 mr-3 ${
                                isPopular
                                  ? "text-purple-200"
                                  : "text-purple-600"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isPopular ? "text-white" : "text-gray-700"
                              }`}
                            >
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          handlePlanSelect(
                            plan.id,
                            plan.name,
                            `$${plan.amount}/${plan.interval}`
                          )
                        }
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          isPopular
                            ? "bg-white text-purple-600 hover:bg-purple-50"
                            : "bg-purple-200 text-purple-800 hover:bg-purple-300"
                        }`}
                      >
                        {getButtonText(plan.name)}
                      </button>
                    </div>
                  );
                })}
            </div>

            {/* Footer Link */}
            <div className="text-center py-4 border-t border-purple-200">
              <button
                onClick={() => setShowPricing(false)}
                className="text-purple-600 text-sm hover:underline"
              >
                Go back to previous step
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-white/70">
              © 2025 WholesaleAI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowPrice;
