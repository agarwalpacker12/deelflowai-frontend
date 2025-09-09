import React, { useEffect, useState } from "react";
import { propertySaveAPI } from "../../services/api";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";

const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const response = await propertySaveAPI.getPropertySave({
          per_page: 100,
        });
        if (response.data.status === "success") {
          setSavedProperties(response.data.data.data);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchSavedProperties();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <MainContentWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Saved Properties</h1>
          <div className="text-sm text-gray-400">
            Total: {savedProperties.length} Properties
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {/* State Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">State</label>
              <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white">
                <option value="">All States</option>
                <option value="TX">Texas</option>
                <option value="CA">California</option>
                <option value="FL">Florida</option>
                <option value="NY">New York</option>
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">City</label>
              <input
                type="text"
                placeholder="Enter city name"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Per Page */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Per Page
              </label>
              <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white">
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Actions
              </label>
              <button className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 transition-colors flex items-center justify-center gap-2">
                <span>↻</span>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Property ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Purchase Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ARV
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Saved Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {savedProperties.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white text-xs">
                      {item.property.id}
                    </td>
                    <td className="px-6 py-4 text-white text-xs font-medium">
                      {item.property.address}
                    </td>
                    <td className="px-6 py-4 text-white text-xs">
                      {item.property.city}
                    </td>
                    <td className="px-6 py-4 text-white text-xs">
                      {item.property.state}
                    </td>
                    <td className="px-6 py-4 text-white text-xs">
                      {formatCurrency(item.property.purchase_price)}
                    </td>
                    <td className="px-6 py-4 text-white text-xs">
                      {formatCurrency(item.property.arv)}
                    </td>
                    <td className="px-6 py-4 text-white text-xs">
                      {formatDate(item.saved_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded text-xs">
                          View
                        </button>
                        <button className="text-green-400 hover:text-green-300 transition-colors px-2 py-1 rounded text-xs">
                          Edit
                        </button>
                        <button className="text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded text-xs">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing 1 to {savedProperties.length} of {savedProperties.length}{" "}
              properties
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span>‹</span>
              </button>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 rounded-lg text-sm transition-colors bg-blue-500 text-white">
                  1
                </button>
              </div>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span>›</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default SavedPropertiesPage;
