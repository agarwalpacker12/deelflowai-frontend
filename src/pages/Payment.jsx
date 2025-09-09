import React, { useState, useEffect, useRef } from "react";

const VycentraPaymentGateway = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "", show: false });
  const [checkout, setCheckout] = useState(null);
  const dropinContainerRef = useRef(null);
  const dropinRef = useRef(null);

  // Initialize Adyen Checkout
  useEffect(() => {
    const initializeAdyen = async () => {
      try {
        // Load Adyen script dynamically
        if (!window.AdyenCheckout) {
          const script = document.createElement("script");
          script.src =
            "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/5.68.0/adyen.js";
          script.async = true;
          document.head.appendChild(script);

          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href =
            "https://checkoutshopper-test.cdn.adyen.com/checkoutshopper/sdk/5.68.0/adyen.css";
          document.head.appendChild(link);

          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        // Mock payment methods (in real implementation, fetch from your server)
        const paymentMethodsResponse = {
          paymentMethods: [
            {
              name: "Credit Card",
              type: "scheme",
            },
            {
              name: "PayPal",
              type: "paypal",
            },
            {
              name: "Apple Pay",
              type: "applepay",
            },
            {
              name: "Google Pay",
              type: "googlepay",
            },
          ],
        };

        const checkoutInstance = await window.AdyenCheckout({
          environment: "test",
          clientKey: "test_VXKDA6HEEZGBTGNBMN5G53BK54NOVLK2",
          paymentMethodsResponse: paymentMethodsResponse,
          onSubmit: handlePaymentSubmit,
          onAdditionalDetails: handleAdditionalDetails,
          onError: handlePaymentError,
        });

        setCheckout(checkoutInstance);
        console.log("Adyen Checkout initialized successfully");
      } catch (error) {
        console.error("Error initializing Adyen:", error);
        showStatus(
          "Error initializing payment system. Please try again later.",
          "error"
        );
      }
    };

    initializeAdyen();
  }, []);

  // Mock payment submission
  const mockPaymentSubmit = async (paymentData) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      resultCode: "Authorised",
      pspReference: "mock-psp-reference-" + Date.now(),
    };
  };

  // Mock payment details
  const mockPaymentDetails = async (detailsData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      resultCode: "Authorised",
      pspReference: "mock-psp-reference-" + Date.now(),
    };
  };

  // Handle payment submission
  const handlePaymentSubmit = async (state, dropin) => {
    try {
      showStatus("Processing payment...", "info");

      const response = await mockPaymentSubmit(state.data);

      if (response.resultCode === "Authorised") {
        showStatus(
          "Payment successful! Thank you for your purchase.",
          "success"
        );
        closePaymentWindow();
      } else if (
        response.resultCode === "Pending" ||
        response.resultCode === "RedirectShopper"
      ) {
        dropin.handleAction(response.action);
      } else {
        showStatus("Payment failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Payment error:", error);
      showStatus("Payment failed. Please try again.", "error");
    }
  };

  // Handle additional payment details
  const handleAdditionalDetails = async (state, dropin) => {
    try {
      const response = await mockPaymentDetails(state.data);

      if (response.resultCode === "Authorised") {
        showStatus(
          "Payment successful! Thank you for your purchase.",
          "success"
        );
        closePaymentWindow();
      } else {
        showStatus("Payment failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Payment details error:", error);
      showStatus("Payment failed. Please try again.", "error");
    }
  };

  // Handle payment errors
  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    showStatus("Payment error occurred. Please try again.", "error");
  };

  // Show status message
  const showStatus = (message, type) => {
    setStatus({ message, type, show: true });

    if (type === "success") {
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  // Open payment window
  const openPaymentWindow = () => {
    setShowPaymentModal(true);

    // Initialize the drop-in component
    setTimeout(() => {
      if (checkout && dropinContainerRef.current) {
        try {
          dropinRef.current = checkout
            .create("dropin")
            .mount(dropinContainerRef.current);
        } catch (error) {
          console.error("Error mounting dropin:", error);
          showStatus(
            "Payment system not ready. Please refresh the page.",
            "error"
          );
        }
      } else {
        showStatus(
          "Payment system not ready. Please refresh the page.",
          "error"
        );
      }
    }, 100);
  };

  // Close payment window
  const closePaymentWindow = () => {
    setShowPaymentModal(false);

    // Cleanup dropin
    if (dropinRef.current) {
      try {
        dropinRef.current.unmount();
      } catch (error) {
        console.error("Error unmounting dropin:", error);
      }
      dropinRef.current = null;
    }

    // Clear the dropin container
    if (dropinContainerRef.current) {
      dropinContainerRef.current.innerHTML = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 p-5 flex justify-center items-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center">
        <h1 className="text-4xl font-light text-gray-800 mb-3">
          Secure Checkout
        </h1>

        <div className="bg-gray-50 p-5 rounded-2xl my-5">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Premium Subscription
          </h3>
          <p className="text-gray-600 mb-4">
            Make easy payment to get lifetime membership
          </p>
          <div className="text-3xl font-bold text-green-600">$2500.00</div>
        </div>

        <button
          onClick={openPaymentWindow}
          className="bg-gradient-to-r from-green-500 to-green-400 text-white border-none px-10 py-4 text-xl rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 mt-5"
        >
          💳 Pay Now
        </button>

        {status.show && (
          <div
            className={`mt-5 p-3 rounded-lg ${
              status.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : status.type === "error"
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-blue-100 text-blue-800 border border-blue-300"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePaymentWindow();
            }
          }}
        >
          <div className="bg-white p-8 rounded-2xl w-11/12 max-w-md relative">
            <button
              onClick={closePaymentWindow}
              className="absolute top-3 right-4 bg-none border-none text-2xl cursor-pointer text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-5">
              Complete Your Payment
            </h3>
            <div ref={dropinContainerRef} className="mt-5"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VycentraPaymentGateway;
