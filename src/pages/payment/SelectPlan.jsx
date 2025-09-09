import { Shield } from "lucide-react";

function SelectPlan({ handlePayment, selectedPlan }) {
  return (
    <>
      <div className="flex items-center justify-center min-h-full">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl p-8">
            {/* Security Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-purple-100 p-4 rounded-full">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Subscription
              </h1>
              <p className="text-gray-600 text-sm">
                You'll be redirected to our secure payment provider
              </p>
            </div>

            {/* Plan Details */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">
                  Selected Plan:
                </span>
                <span className="text-purple-900 font-semibold">
                  {selectedPlan.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Price:</span>
                <span className="text-purple-900 font-semibold">
                  {selectedPlan.price}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
              >
                Proceed to Payment
              </button>

              <button
                onClick={() => setSelectedPlan(null)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
            </div>

            {/* Security Notice */}
            <div className="text-center mt-6">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-2" />
                <span>Secure payment processed by Stripe</span>
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
    </>
  );
}

export default SelectPlan;
