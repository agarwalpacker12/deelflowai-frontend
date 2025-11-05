import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { PaymentAPI } from "../../services/api";

const PricingTable = () => {
  const pricingTiers = [
    {
      name: "Starter",
      originalPrice: "$997",
      currentPrice: "$297",
      features: [
        { text: "50 AI Lead Analyses/Month", highlight: false },
        { text: "Basic Blockchain Escrow", highlight: false },
        { text: "Email & SMS Automation", highlight: false },
        { text: "Standard Reporting", highlight: false },
        { text: "Mobile App Access", highlight: false },
        { text: "Email Support", highlight: false },
      ],
      buttonText: "Start Free Trial",
      isPopular: false,
      isLoading: true,
    },
    {
      name: "Professional",
      originalPrice: "$2,997",
      currentPrice: "$797",
      features: [
        { text: "Unlimited AI Analyses", highlight: false },
        { text: "Advanced Blockchain", highlight: false },
        { text: "Voice AI Agents", highlight: false },
        { text: "Transactional Funding Access", highlight: false },
        { text: "Custom Marketing Funnels", highlight: false },
        { text: "Priority Support", highlight: false },
        { text: "White-Label Options", highlight: false },
        { text: "API Access", highlight: false },
      ],
      buttonText: "Start Free Trial",
      isPopular: true,
      isLoading: true,
    },
    {
      name: "Enterprise",
      originalPrice: "$4,997",
      currentPrice: "$1,997",
      features: [
        { text: "Everything in Professional", highlight: false },
        { text: "Custom AI Model Training", highlight: false },
        { text: "Dedicated Success Manager", highlight: false },
        { text: "Custom Integrations", highlight: false },
        { text: "Advanced Analytics", highlight: false },
        { text: "Team Collaboration", highlight: false },
        { text: "99.9% SLA Guarantee", highlight: false },
      ],
      buttonText: "Contact Sales",
      isPopular: false,
      isLoading: true,
    },
  ];

  const [countdownTime, setCountdownTime] = useState(4 * 3600 + 23 * 60 + 17);
  const [professionalSpots, setProfessionalSpots] = useState(15);
  const [subscriptionPackState, setSubscriptionPackState] = useState([]);

  useEffect(() => {
    const fetchSubscriptionPacks = async () => {
      try {
        const response = await PaymentAPI.getSubscriptionPack();
        if (response.data.status === "success") {
          setSubscriptionPackState(response.data.data.packages || []);
        }
      } catch (err) {
        console.error("Error fetching subscription packs:", err);
      }
    };

    fetchSubscriptionPacks();
  }, []);

  const handlePayment = async (price_id) => {
    try {
      // Check user authentication before proceeding
      const userData = localStorage.getItem("user");

      if (!userData) {
        // If user not logged in, show auth modal / popup
        if (onAuthRequired) onAuthRequired();
        return;
      }

      // Proceed with payment creation
      const response = await PaymentAPI.createCheckout({ price_id });

      if (response?.data?.data?.url) {
        window.location.href = response.data.data.url;
      } else {
        console.error("Checkout URL not found in response:", response);
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });

      if (Math.random() < 0.05) {
        setProfessionalSpots((prev) => Math.max(1, prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const checkUserAuth = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.is_verified === false || !user.id) {
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return false;
      }
    }
    return false;
  };
  const checkUser = () => {
    if (checkUserAuth && !checkUserAuth()) {
      onAuthRequired && onAuthRequired();
      return;
    }
  };

  const hours = Math.floor(countdownTime / 3600);
  const minutes = Math.floor((countdownTime % 3600) / 60);
  const seconds = countdownTime % 60;
  const timeString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                tier.isPopular
                  ? "ring-4 ring-emerald-500 transform scale-105"
                  : ""
              }`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}

              <div className={`p-6 ${tier.isPopular ? "pt-12" : ""}`}>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                  {tier.name}
                </h3>

                <div className="text-center mb-6">
                  <div className="text-gray-500 line-through text-sm mb-1">
                    {tier.originalPrice}
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {tier.currentPrice}
                    </span>
                    <span className="text-gray-600 ml-2">per month</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {tier.name === "Enterprise" ? (
                    <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                      {tier.buttonText}
                    </button>
                  ) : (
                    <button className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                      {tier.buttonText}
                    </button>
                  )}

                  {tier.isLoading && (
                    <div
                      className={`w-full py-2 px-4 rounded-lg text-center text-sm ${
                        tier.isPopular
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      Loading pricing...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
