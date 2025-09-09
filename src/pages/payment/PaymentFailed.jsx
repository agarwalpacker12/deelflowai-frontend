import React, { useState } from "react";
import { X, AlertCircle, CreditCard, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-center min-h-full">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <X className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>

            <p className="text-gray-600 mb-2">
              We couldn't process your payment for the
            </p>
            <p className="text-gray-600 mb-6">
              <span className="font-semibold text-purple-600">
                {/* {selectedPlan?.name} */}
                Plan
              </span>
              . Don't worry, no charges were made.
            </p>

            {/* Error Details */}
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 text-sm font-medium mb-1">
                    Card Declined
                  </p>
                  <p className="text-red-700 text-xs">
                    Please check your card details or try a different payment
                    method.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-8">
              You can try again or contact our support team for assistance
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Secondary Actions */}

              <button
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
                onClick={() => navigate("/app/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentFailed;
