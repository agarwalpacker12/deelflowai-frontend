import React, { useState } from "react";
import { Printer, Download, Mail, Plus, X } from "lucide-react";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "INV-2025-001",
    date: "2025-08-13",
    dueDate: "2025-09-13",
    company: {
      name: "Your Company Inc.",
      address: "123 Business Street",
      city: "New York, NY 10001",
      email: "hello@yourcompany.com",
      phone: "+1 (555) 123-4567",
    },
    client: {
      name: "Client Corporation",
      address: "456 Client Avenue",
      city: "Los Angeles, CA 90210",
      email: "contact@clientcorp.com",
      phone: "+1 (555) 987-6543",
    },
    items: [
      {
        id: 1,
        description: "Web Development Services",
        quantity: 40,
        rate: 125,
        amount: 5000,
      },
      {
        id: 2,
        description: "UI/UX Design & Consultation",
        quantity: 24,
        rate: 95,
        amount: 2280,
      },
      {
        id: 3,
        description: "Project Management",
        quantity: 16,
        rate: 75,
        amount: 1200,
      },
    ],
    notes:
      "Thank you for choosing our services. Payment terms: Net 30 days. Late payments may incur additional charges.",
    taxRate: 8.5,
  });

  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const taxAmount = (subtotal * invoiceData.taxRate) / 100;
  const total = subtotal + taxAmount;

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }

    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const addItem = () => {
    const newId = Math.max(...invoiceData.items.map((item) => item.id), 0) + 1;
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { id: newId, description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Actions */}
        {/* <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 print:hidden">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Invoice Generator</h1>
            <div className="flex space-x-3">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:transform hover:scale-105 shadow-lg flex items-center space-x-2">
                <Printer size={16} />
                <span>Print</span>
              </button>
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:transform hover:scale-105 shadow-lg flex items-center space-x-2">
                <Download size={16} />
                <span>Download</span>
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:transform hover:scale-105 shadow-lg flex items-center space-x-2">
                <Mail size={16} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div> */}

        {/* Main Invoice */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
          <div className="p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  INVOICE
                </h1>
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Invoice #:</span>
                    <span className="font-semibold text-white">
                      {invoiceData.invoiceNumber}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Date:</span>
                    <span className="font-semibold text-white">
                      {invoiceData.date}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Due Date:</span>
                    <span className="font-semibold text-white">
                      {invoiceData.dueDate}
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="text-right">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-white font-bold text-2xl">LOGO</span>
                </div>
              </div> */}
            </div>

            {/* Company and Client Info */}
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded mr-3"></div>
                  From:
                </h3>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-white text-lg">
                    {invoiceData.company.name}
                  </p>
                  <p className="text-slate-300">
                    {invoiceData.company.address}
                  </p>
                  <p className="text-slate-300">{invoiceData.company.city}</p>
                  <p className="text-indigo-400">{invoiceData.company.email}</p>
                  <p className="text-slate-300">{invoiceData.company.phone}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded mr-3"></div>
                  Bill To:
                </h3>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-white text-lg">
                    {invoiceData.client.name}
                  </p>
                  <p className="text-slate-300">{invoiceData.client.address}</p>
                  <p className="text-slate-300">{invoiceData.client.city}</p>
                  <p className="text-indigo-400">{invoiceData.client.email}</p>
                  <p className="text-slate-300">{invoiceData.client.phone}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Service Details
                </h2>
                <button
                  onClick={addItem}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:transform hover:scale-105 shadow-lg flex items-center space-x-2 print:hidden"
                >
                  <Plus size={16} />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10 border-b border-white/10">
                      <tr>
                        <th className="text-left p-4 text-white font-semibold">
                          Description
                        </th>
                        <th className="text-center p-4 text-white font-semibold w-24">
                          Qty
                        </th>
                        <th className="text-center p-4 text-white font-semibold w-32">
                          Rate ($)
                        </th>
                        <th className="text-center p-4 text-white font-semibold w-32">
                          Amount ($)
                        </th>
                        <th className="w-12 print:hidden"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {invoiceData.items.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateItem(index, "description", e.target.value)
                              }
                              className="w-full bg-transparent text-slate-300 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded px-2 py-1 transition-all"
                              placeholder="Service description..."
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "quantity",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full bg-transparent text-slate-300 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded px-2 py-1 text-center transition-all"
                              min="0"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "rate",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-full bg-transparent text-slate-300 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded px-2 py-1 text-center transition-all"
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="p-4 text-center font-semibold text-white">
                            ${item.amount.toFixed(2)}
                          </td>
                          <td className="p-4 text-center print:hidden">
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/10 rounded"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Subtotal:</span>
                    <span className="font-semibold text-white text-lg">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">
                      Tax ({invoiceData.taxRate}%):
                    </span>
                    <span className="font-semibold text-white text-lg">
                      ${taxAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white">
                        Total:
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded mr-3"></div>
                Notes & Terms:
              </h3>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <textarea
                  value={invoiceData.notes}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, notes: e.target.value })
                  }
                  className="w-full bg-transparent text-slate-300 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded resize-none transition-all"
                  rows={3}
                  placeholder="Additional notes, terms, or payment instructions..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-slate-400 text-sm mt-12 pt-8 border-t border-white/10">
              <p className="flex items-center justify-center space-x-2">
                <span>Thank you for your business!</span>
                <span className="text-indigo-400">•</span>
                <span>
                  Questions? Contact us at {invoiceData.company.email}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
