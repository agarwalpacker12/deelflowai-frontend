import React, { useState } from "react";
import { Search, Eye, Edit, Mail, MoreHorizontal } from "lucide-react";
import DialogBox from "../../components/UI/DialogBox";
import CreateTenantForm from "./add/Form";

const TenantManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [paymentFilter, setPaymentFilter] = useState("Payment Status");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTenant, setNewTenant] = useState({
    organizationName: "",
    urlPath: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    subscriptionPlan: "Starter - $299/month",
    sendWelcomeEmail: true,
  });

  const stats = [
    {
      value: "8",
      label: "Active Tenants",
      color: "text-indigo-400",
    },
    {
      value: "3",
      label: "Payment Overdue",
      color: "text-purple-400",
    },
    {
      value: "1",
      label: "Suspended",
      color: "text-blue-400",
    },
    {
      value: "$24.5K",
      label: "Monthly Revenue",
      color: "text-green-400",
    },
  ];

  const tenants = [
    {
      id: "DW",
      name: "Dallas Wholesalers",
      company: "LLC",
      domain: "dealflow.ai/dallas",
      status: "Active",
      plan: "Professional",
      users: "24 / 50",
      payment: "Paid",
      paymentStatus: "paid",
      api: "45K/100K",
      storage: "23GB",
      created: "Jan 15, 2024",
      color: "bg-blue-500",
    },
    {
      id: "TP",
      name: "Texas Property",
      company: "Investors",
      domain: "dealflow.ai/texasprop",
      status: "Active",
      plan: "Enterprise",
      users: "156 / ∞",
      payment: "Overdue",
      paymentStatus: "overdue",
      api: "234K/∞",
      storage: "124GB",
      created: "Nov 23, 2023",
      color: "bg-purple-500",
    },
    {
      id: "NR",
      name: "National RE Group",
      company: "",
      domain: "dealflow.ai/nationalre",
      status: "Suspended",
      plan: "Professional",
      users: "32 / 50",
      payment: "Overdue",
      paymentStatus: "overdue",
      api: "0/100K",
      storage: "45GB",
      created: "Dec 10, 2023",
      color: "bg-red-500",
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "suspended":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getPlanColor = (plan) => {
    switch (plan.toLowerCase()) {
      case "professional":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "enterprise":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "starter":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getPaymentColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "overdue":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  // Custom handlers for dialog actions
  const handleDialogSave = () => {
    setShowAddModal(false);
  };

  const handleDialogCancel = () => {
    setShowAddModal(!showAddModal);
  };
  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Tenant Management
          </h1>
          <div className="flex items-center gap-3">
            {/* Add Lead Button */}
            <button
              onClick={() => setShowAddModal(!showAddModal)}
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 overflow-hidden"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <span className="relative z-10">Add Tenant</span>
              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenants by name, email, or domain"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
            >
              <option value="All Plans">All Plans</option>
              <option value="Professional">Professional</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Starter">Starter</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
            >
              <option value="Payment Status">Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-white font-semibold">
                    Organization
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Status
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Plan
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Users
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Payment
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Usage
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Created
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {tenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg ${tenant.color} flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {tenant.id}
                        </div>
                        <div>
                          <div className="text-white font-semibold">
                            {tenant.name}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {tenant.company}
                          </div>
                          <div className="text-slate-500 text-xs">
                            {tenant.domain}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          tenant.status
                        )}`}
                      >
                        {tenant.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPlanColor(
                          tenant.plan
                        )}`}
                      >
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium">
                        {tenant.users}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPaymentColor(
                          tenant.paymentStatus
                        )}`}
                      >
                        {tenant.payment}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-slate-300 text-sm">
                          API: {tenant.api}
                        </div>
                        <div className="text-slate-400 text-xs">
                          Storage: {tenant.storage}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-300 text-sm">
                        {tenant.created}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-500/20 rounded-lg transition-colors">
                          <Mail className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-500/20 rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogBox
          open={showAddModal}
          setOpen={setShowAddModal}
          title="Choose Fill Method"
          description="How would you like to fill out the campaign form?"
          onSave={handleDialogSave}
          onCancel={handleDialogCancel}
          saveText="Continue"
          cancelText="Close"
          showActions={false} // Hide default actions since we're using custom buttons in content
        >
          <CreateTenantForm onClose={handleDialogCancel} />
        </DialogBox>
      </div>
    </div>
  );
};

export default TenantManagementPage;
