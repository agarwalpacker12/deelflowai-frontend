import React, { useState } from "react";

const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Payment methods data with initial status
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "paypal",
      name: "PayPal",
      logo: "💳",
      bgColor: "bg-blue-50",
      status: "active",
    },
    {
      id: "stripe",
      name: "Stripe",
      logo: "💰",
      bgColor: "bg-purple-50",
      status: "active",
    },
    {
      id: "paytm",
      name: "Paytm",
      logo: "📱",
      bgColor: "bg-blue-50",
      status: "inactive",
    },
    {
      id: "razorpay",
      name: "Razorpay",
      logo: "⚡",
      bgColor: "bg-blue-50",
      status: "active",
    },
    {
      id: "iyzico",
      name: "Iyzico",
      logo: "🔷",
      bgColor: "bg-orange-50",
      status: "inactive",
    },
    {
      id: "paystack",
      name: "Paystack",
      logo: "📊",
      bgColor: "bg-teal-50",
      status: "active",
    },
    {
      id: "flutterwave",
      name: "Flutterwave",
      logo: "🌊",
      bgColor: "bg-yellow-50",
      status: "active",
    },
    {
      id: "duitku",
      name: "Duitku",
      logo: "💎",
      bgColor: "bg-blue-50",
      status: "inactive",
    },
    {
      id: "yoomoney",
      name: "YooMoney",
      logo: "💰",
      bgColor: "bg-purple-50",
      status: "active",
    },
    {
      id: "mollie",
      name: "Mollie",
      logo: "🔵",
      bgColor: "bg-gray-50",
      status: "active",
    },
    {
      id: "mercadopago",
      name: "Mercado Pago",
      logo: "🛒",
      bgColor: "bg-blue-50",
      status: "active",
    },
    {
      id: "midtrans",
      name: "Midtrans",
      logo: "📈",
      bgColor: "bg-blue-50",
      status: "inactive",
    },
  ]);

  const [offlineMethod, setOfflineMethod] = useState({
    id: "manual",
    name: "Manual Payment",
    logo: "📄",
    bgColor: "bg-gray-50",
    status: "active",
  });

  const handleMethodClick = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handleStatusToggle = (methodId, e) => {
    e.stopPropagation(); // Prevent card selection when clicking checkbox

    if (methodId === "manual") {
      setOfflineMethod((prev) => ({
        ...prev,
        status: prev.status === "active" ? "inactive" : "active",
      }));
    } else {
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === methodId
            ? {
                ...method,
                status: method.status === "active" ? "inactive" : "active",
              }
            : method
        )
      );
    }
  };

  const StatusToggle = ({ status, methodId }) => (
    <label>
      <input
        type="checkbox"
        onChange={(e) => handleStatusToggle(methodId, e)}
        className="sr-only peer"
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <div className="min-h-screen bg-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Payment Methods
          </h1>
          <p className="text-purple-300">
            Configure and manage your payment gateway integrations
          </p>
        </div>

        {/* Online Payment Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleMethodClick(method.id)}
              className={`relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                selectedMethod === method.id
                  ? "border-purple-500 ring-4 ring-purple-500 ring-opacity-20"
                  : "border-transparent hover:border-purple-300"
              } group`}
            >
              {/* Status indicator */}
              <div className="absolute top-4 right-4">
                <StatusToggle status={method.status} methodId={method.id} />
              </div>

              {/* Logo area */}
              <div
                className={`w-16 h-16 ${method.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-2xl">{method.logo}</span>
              </div>

              {/* Method name */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {method.name}
              </h3>

              {/* Status badge */}
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    method.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {method.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-purple-500 bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Offline Payment Method Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Offline Payment Method
          </h2>

          <div className="max-w-md">
            <div
              onClick={() => handleMethodClick(offlineMethod.id)}
              className={`relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                selectedMethod === offlineMethod.id
                  ? "border-purple-500 ring-4 ring-purple-500 ring-opacity-20"
                  : "border-transparent hover:border-purple-300"
              } group`}
            >
              {/* Status indicator */}
              <div className="absolute top-4 right-4">
                <StatusToggle
                  status={offlineMethod.status}
                  methodId={offlineMethod.id}
                />
              </div>

              {/* Logo area */}
              <div
                className={`w-16 h-16 ${offlineMethod.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-2xl">{offlineMethod.logo}</span>
              </div>

              {/* Method name */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {offlineMethod.name}
              </h3>

              {/* Status badge */}
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    offlineMethod.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {offlineMethod.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-purple-500 bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all duration-300"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 shadow-lg">
            Add New Payment Method
          </button>
          <button className="bg-purple-800 hover:bg-purple-900 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 shadow-lg">
            Configure Settings
          </button>
          {selectedMethod && (
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 shadow-lg">
              Configure{" "}
              {paymentMethods.find((m) => m.id === selectedMethod)?.name ||
                offlineMethod.name}
            </button>
          )}
        </div>

        {/* Selected Method Info */}
        {selectedMethod && (
          <div className="mt-8 bg-purple-900 bg-opacity-50 rounded-xl p-6 border border-purple-700">
            <h3 className="text-xl font-bold text-white mb-3">
              Selected:{" "}
              {paymentMethods.find((m) => m.id === selectedMethod)?.name ||
                offlineMethod.name}
            </h3>
            <p className="text-purple-200 mb-4">
              Configure integration settings, API keys, and webhook endpoints
              for this payment method.
            </p>
            <div className="flex space-x-3">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                Edit Configuration
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                Test Connection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
