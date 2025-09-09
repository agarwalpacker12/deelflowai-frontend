import MainContentWrapper from "../../components/Layout/MainContentWrapper";
import Table from "./Table";
import CurrentPack from "./CurrentPAck";
import { PaymentAPI } from "../../services/api";

const BillingSubscription = () => {
  const redirectStripeHandler = async () => {
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

  return (
    <MainContentWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Billing & Subscription
          </h1>
          <p className="text-slate-300">
            Manage your subscription, invoices, and payment methods
          </p>
        </div>

        {/* Current Subscription Card && card details */}

        <CurrentPack redirectStripeHandler={redirectStripeHandler} />

        {/* Recent Invoices Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group mt-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-white">
              Recent Invoices
            </h2>
            <button
              onClick={() => redirectStripeHandler()}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors duration-200"
            >
              View All
            </button>
          </div>

          {/* Invoice Table */}
          <Table />
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default BillingSubscription;
