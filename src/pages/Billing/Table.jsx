import React from "react";
import { useState, useEffect } from "react";
import { PaymentAPI } from "../../services/api";

function Table() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Replace with your actual API call
        const response = await PaymentAPI.getTransactionList();

        // Handle the API response format
        if (response.data.status == "success") {
          setTransactions(response.data.data);
        } else {
          console.log("Failed to fetch transactions");
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "-";
    // Convert from cents to dollars for Stripe amounts
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "open":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "void":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "draft":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-white/10 border-b border-white/10">
          <tr>
            <th className="text-left p-4 text-white font-semibold">Invoice</th>
            <th className="text-left p-4 text-white font-semibold">Customer</th>

            <th className="text-left p-4 text-white font-semibold">Amount</th>
            <th className="text-left p-4 text-white font-semibold">Status</th>

            <th className="text-left p-4 text-white font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-b border-white/10 hover:bg-white/5"
            >
              <td className="p-4">
                <div className="space-y-1">
                  <div className="text-white font-medium">{invoice.number}</div>
                  <div className="text-xs text-gray-400">{invoice.id}</div>
                </div>
              </td>
              <td className="p-4">
                <div className="space-y-1">
                  <div className="text-white text-sm">
                    {invoice.customer_name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {invoice.customer_email}
                  </div>
                </div>
              </td>

              <td className="p-4">
                <div className="space-y-1">
                  <div className="text-green-400 font-semibold">
                    {formatCurrency(invoice.total)}
                  </div>
                  {invoice.amount_remaining > 0 && (
                    <div className="text-xs text-red-400">
                      Due: {formatCurrency(invoice.amount_remaining)}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>
              </td>

              <td className="p-4 text-gray-300 text-sm">
                {formatDate(invoice.created)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
