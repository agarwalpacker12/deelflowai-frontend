import React, { useEffect, useState } from "react";
import { Check, CheckCircle } from "lucide-react";
import { PaymentAPI } from "../../services/api";

const PricingTable = () => {
  const [countdownTime, setCountdownTime] = useState(4 * 3600 + 23 * 60 + 17);
  const [professionalSpots, setProfessionalSpots] = useState(15);
  const [subscriptionPackState, setSubscriptionPackState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionPacks = async () => {
      try {
        setLoading(true);
        const response = await PaymentAPI.getSubscriptionPack();
        if (response.data.status === "success") {
          setSubscriptionPackState(response.data.data.packages);
        }
      } catch (err) {
        console.error("Error fetching subscription packs:", err);
      } finally {
        setLoading(false);
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
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {/* Loading State */}
          {subscriptionPackState.length > 0 ? (
            subscriptionPackState.map((pack, index) => {
              const isProfessional = pack.name === "Professional";
              const isEnterprise = pack.name === "Enterprise";

              return (
                <div
                  key={pack.id}
                  className={`bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full relative ${
                    isProfessional ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {isProfessional && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {pack.name}
                    </h3>

                    {/* Original Price - Crossed Out */}
                    <div className="text-gray-400 text-lg line-through mb-1">
                      ${Math.ceil(pack.amount * 1.5).toLocaleString()}
                    </div>

                    {/* Current Price */}
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {pack.currency == "usd" ? "$" : "₹"}
                      </span>
                      <span className="text-5xl font-bold text-gray-900">
                        {pack.amount.toLocaleString()}
                      </span>
                      <span className="text-gray-600 text-lg ml-2">
                        per {pack.interval}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {pack.name === "Starter" && (
                      <>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">50</span> AI Lead
                            Analyses/Month
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Basic</span>{" "}
                            Blockchain Escrow
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Email</span> & SMS
                            Automation
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Standard</span>{" "}
                            Reporting
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Mobile</span> App
                            Access
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Email</span> Support
                          </span>
                        </div>
                      </>
                    )}

                    {pack.name === "Professional" && (
                      <>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Unlimited</span> AI
                            Analyses
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Advanced</span>{" "}
                            Blockchain
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Voice</span> AI
                            Agents
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Transactional</span>{" "}
                            Funding Access
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Custom</span>{" "}
                            Marketing Funnels
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Priority</span>{" "}
                            Support
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">White-Label</span>{" "}
                            Options
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">API</span> Access
                          </span>
                        </div>
                      </>
                    )}

                    {pack.name === "Enterprise" && (
                      <>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Everything</span> in
                            Professional
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Custom</span> AI
                            Model Training
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Dedicated</span>{" "}
                            Success Manager
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Custom</span>{" "}
                            Integrations
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Advanced</span>{" "}
                            Analytics
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">Team</span>{" "}
                            Collaboration
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0"
                            size={20}
                          />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold">99.9%</span> SLA
                            Guarantee
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full font-semibold py-4 px-6 rounded-lg transition duration-200 mb-4 ${
                      pack.name === "Starter"
                        ? "bg-gray-700 hover:bg-gray-800 text-white"
                        : isProfessional
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                    onClick={() => handlePayment(pack.price_id)}
                  >
                    {isEnterprise ? "Contact Sales" : "Start Free Trial"}
                  </button>

                  {/* Notice */}
                  <div
                    className={`rounded-lg p-3 text-center ${
                      pack.name === "Starter"
                        ? "bg-red-50 border border-red-200"
                        : isProfessional
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-purple-50 border border-purple-200"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        pack.name === "Starter"
                          ? "text-red-600"
                          : isProfessional
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    >
                      {pack.name === "Starter" &&
                        "Price increases to $597 tomorrow"}
                      {isProfessional && (
                        <>
                          Only{" "}
                          <span id="professional-spots">
                            {professionalSpots}
                          </span>{" "}
                          spots left at this price!
                        </>
                      )}
                      {isEnterprise && "🎁 Exclusive - invitation only"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              {/* Dummy Starter Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Starter
                  </h3>
                  <div className="text-gray-400 text-lg line-through mb-1">
                    $997
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">$</span>
                    <span className="text-5xl font-bold text-gray-900">
                      297
                    </span>
                    <span className="text-gray-600 text-lg ml-2">
                      per month
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">50</span> AI Lead
                      Analyses/Month
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Basic</span> Blockchain
                      Escrow
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Email</span> & SMS
                      Automation
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Standard</span> Reporting
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Mobile</span> App Access
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Email</span> Support
                    </span>
                  </div>
                </div>

                <button
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 mb-4"
                  onClick={() => checkUser()}
                >
                  Start Free Trial
                </button>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-red-600 text-sm font-medium">
                    Loading pricing...
                  </p>
                </div>
              </div>

              {/* Dummy Professional Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full relative ring-2 ring-blue-500">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Professional
                  </h3>
                  <div className="text-gray-400 text-lg line-through mb-1">
                    $2,997
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">$</span>
                    <span className="text-5xl font-bold text-gray-900">
                      797
                    </span>
                    <span className="text-gray-600 text-lg ml-2">
                      per month
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Unlimited</span> AI
                      Analyses
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Advanced</span> Blockchain
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Voice</span> AI Agents
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Transactional</span>{" "}
                      Funding Access
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Custom</span> Marketing
                      Funnels
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Priority</span> Support
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">White-Label</span> Options
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">API</span> Access
                    </span>
                  </div>
                </div>

                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 mb-4"
                  onClick={() => checkUser()}
                >
                  Start Free Trial
                </button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-blue-600 text-sm font-medium">
                    Loading pricing...
                  </p>
                </div>
              </div>

              {/* Dummy Enterprise Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Enterprise
                  </h3>
                  <div className="text-gray-400 text-lg line-through mb-1">
                    $4,997
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">$</span>
                    <span className="text-5xl font-bold text-gray-900">
                      1,997
                    </span>
                    <span className="text-gray-600 text-lg ml-2">
                      per month
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Everything</span> in
                      Professional
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Custom</span> AI Model
                      Training
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Dedicated</span> Success
                      Manager
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Custom</span> Integrations
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Advanced</span> Analytics
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">Team</span> Collaboration
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      <span className="font-semibold">99.9%</span> SLA Guarantee
                    </span>
                  </div>
                </div>

                <button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 mb-4"
                  onClick={() => checkUser()}
                >
                  Contact Sales
                </button>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                  <p className="text-purple-600 text-sm font-medium">
                    Loading pricing...
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
