import { useState, useEffect } from "react";
import { Zap, Users, Check } from "lucide-react";
import ShowPrice from "./ShowPrice";
import SelectPlan from "./SelectPlan";
import PaymentSuccess from "./PaymentSuccess";
import { PaymentAPI } from "../../services/api";

export default function PaymentAfterLogin() {
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [packageId, setPackageId] = useState();

  // Check for payment success on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment_status");
    const sessionId = urlParams.get("session_id");

    // Check if payment was successful
    if (paymentStatus === "success" || sessionId) {
      // Optionally verify the payment with your backend
      verifyPayment(sessionId);
    }
  }, []);

  const verifyPayment = async (sessionId) => {
    try {
      // Call your backend to verify the payment
      const response = await PaymentAPI.verifyPayment(sessionId);
      if (response.data.success) {
        setPaymentSuccess(true);
        // Optionally get plan details from the response
        setSelectedPlan(response.data.planDetails);

        // Clean up URL parameters
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    } catch (error) {
      console.log("Payment verification failed:", error);
    }
  };

  const handlePlanSelect = (id, planName, price) => {
    setPackageId(id);
    setSelectedPlan({ planId: id, name: planName, price: price });
  };

  const handlePayment = async () => {
    try {
      const formattedData = {
        package_id: packageId,
      };
      const response = await PaymentAPI.createCheckout(formattedData);
      console.log("response", response.data.data);
      if (response.data.data.redirect_url) {
        window.location.href = response.data.data.redirect_url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Payment success screen
  // if (paymentSuccess) {
  //   return <PaymentSuccess selectedPlan={selectedPlan} />;
  // }

  // Subscription completion screen
  if (selectedPlan) {
    return (
      <SelectPlan handlePayment={handlePayment} selectedPlan={selectedPlan} />
    );
  }

  if (showPricing) {
    return (
      <ShowPrice
        handlePlanSelect={handlePlanSelect}
        setPackageId={setPackageId}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-6 px-6 rounded-t-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome to WholesaleAI!</h1>
          <p className="text-purple-100">
            Choose how you'd like to proceed with your account
          </p>
        </div>

        {/* Content Cards */}
        <div className="bg-white/95 backdrop-blur-sm rounded-b-xl shadow-xl border border-white/20 overflow-hidden">
          {/* Beta Tester Option */}
          <div
            className="p-6 border-b border-purple-200/50 cursor-pointer hover:bg-purple-50/50 transition-colors"
            onClick={() => setShowPricing(true)}
          >
            <div className="flex items-start mb-4">
              <div className="bg-purple-100 p-2 rounded-lg mr-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Become a Beta Tester
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Get immediate access to all features and help shape the future
                  of WholesaleAI with your feedback.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="text-sm text-gray-700">
                      Immediate access
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="text-sm text-gray-700">
                      Special beta pricing
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="text-sm text-gray-700">
                      Priority support
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="text-sm text-gray-700">
                      Influence product roadmap
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Waitlist Option */}
          <div className="p-6">
            <div className="flex items-start mb-4">
              <div className="bg-purple-100 p-2 rounded-lg mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Join the Waitlist
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Sign up to be notified when we're ready for more users. No
                  payment required.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="text-sm text-gray-700">
                      Stay updated on launch
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="text-sm text-gray-700">
                      Early access opportunity
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="text-sm text-gray-700">
                      No payment required
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="text-sm text-gray-700">
                      Special launch offers
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
  );
}
