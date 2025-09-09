import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PaymentAPI } from "../../services/api";
import { useEffect } from "react";

function PaymentSuccess() {
  // { selectedPlan }
  const navigate = useNavigate();

  const createCustomerPortalHandler = async () => {
    try {
      const response = await PaymentAPI.createCustomerPortal();
      console.log("response", response.data.data);
      if (response.data.data.redirect_url) {
        window.location.href = response.data.data.redirect_url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Set a timeout to call the function after 40 seconds
    const timer = setTimeout(() => {
      createCustomerPortalHandler();
    }, 10000); // 10 seconds = 10,000 milliseconds

    // Cleanup function to clear the timeout if component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="flex items-center justify-center min-h-full">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>

            <p className="text-gray-600 mb-2">
              Welcome to WholesaleAI Beta! Your account has been
            </p>
            <p className="text-gray-600 mb-6">
              upgraded to the{" "}
              <span className="font-semibold text-purple-600">
                {/* {selectedPlan?.name}  */}
                Plan
              </span>
              .
            </p>

            <p className="text-gray-500 text-sm mb-8">
              Get started by exploring your new dashboard and tools
            </p>

            {/* Dashboard Button */}
            <button
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
              onClick={() => navigate("/app/dashboard")}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
