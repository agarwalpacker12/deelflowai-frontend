import { useState } from "react";
import { Home, BedDouble, Bath, DollarSign, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { propertySaveAPI } from "../../services/api";

const Table = ({
  properties = [],
  loading = false,
  formatCurrency,
  getScoreColor,
  getStatusColor,
  savedPropertyIds,
  onPropertySaved, // <-- add this prop
  onDelete,
}) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  // Add state for saving property
  const [savingId, setSavingId] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(null);

  // Remove direct API call, just handle loading/error UI
  const handleDeleteClick = async (property) => {
    setDeleteError("");
    setDeletingId(property.id);
    try {
      await onDelete(property); // <-- delegate to parent
    } catch (err) {
      setDeleteError(err?.message || "Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  // Add handler for saving property
  const handleSaveClick = async (property) => {
    setSaveError("");
    setSaveSuccess(null);
    setSavingId(property.id);
    try {
      // Assuming API expects { property_id: ... }
      await propertySaveAPI.createPropertySave({ property_id: property.id });
      setSaveSuccess(property.id);
      setTimeout(() => setSaveSuccess(null), 1500);
      if (onPropertySaved) onPropertySaved(property.id); // <-- notify parent
    } catch (err) {
      setSaveError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save property"
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
      {loading ? (
        <div className="p-8 text-center text-gray-400">
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No properties found</div>
      ) : (
        <div className="overflow-x-auto">
          {deleteError && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-2 text-red-300 text-center mb-2">
              {deleteError}
            </div>
          )}
          {saveError && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-2 text-red-300 text-center mb-2">
              {saveError}
            </div>
          )}
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-white font-semibold">
                  Image
                </th>
                <th className="text-left p-4 text-white font-semibold">
                  Address
                </th>
                <th className="text-left p-4 text-white font-semibold">
                  Specs
                </th>
                <th className="text-left p-4 text-white font-semibold">
                  Financials
                </th>
                <th className="text-left p-4 text-white font-semibold">
                  AI Score
                </th>
                <th className="text-left p-4 text-white font-semibold">
                  Status
                </th>
                <th className="text-left p-4 text-white font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt="Property"
                        className="w-20 h-16 object-cover rounded-lg border border-white/10"
                      />
                    ) : (
                      <div className="w-20 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                        <Home className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">
                      {property.address}{" "}
                      {property.unit && (
                        <span className="text-xs text-gray-400">
                          {property.unit}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {property.city}, {property.state} {property.zip}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {property.property_type?.replace("_", " ")}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <BedDouble className="h-4 w-4" /> {property.bedrooms}{" "}
                      <span className="ml-2">
                        <Bath className="h-4 w-4 inline" /> {property.bathrooms}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {property.square_feet} sqft
                    </div>
                    <div className="text-xs text-gray-400">
                      Lot: {property.lot_size} ac
                    </div>
                    <div className="text-xs text-gray-400">
                      Year: {property.year_built}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(property.purchase_price)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        ARV: {formatCurrency(property.arv)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Repairs: {formatCurrency(property.repair_estimate)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Profit: {formatCurrency(property.profit_potential)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        property.ai_score
                      )}`}
                    >
                      {property.ai_score}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        property.status
                      )}`}
                    >
                      {property.status}
                    </span>
                    <div className="text-xs text-gray-500 capitalize">
                      {property.transaction_type}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {/* Heart icon for saved property */}
                      {savedPropertyIds &&
                      savedPropertyIds.includes(property.id) ? (
                        <button
                          className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors cursor-default"
                          title="Saved Property"
                          disabled
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 fill-red-500"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                          onClick={() => handleSaveClick(property)}
                          title="Save Property"
                          disabled={savingId === property.id}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                        onClick={() =>
                          navigate(`/app/properties/${property.id}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        onClick={() =>
                          navigate(`/app/properties/${property.id}/bid`)
                        }
                      >
                        Bid
                      </button>

                      <button
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        onClick={() => handleDeleteClick(property)}
                        disabled={deletingId === property.id}
                      >
                        {deletingId === property.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Table;
