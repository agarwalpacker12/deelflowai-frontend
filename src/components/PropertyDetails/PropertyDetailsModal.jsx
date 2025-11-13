import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { propertiesAPI } from "../../services/api";
import ATTOMPropertyDetails from "./ATTOMPropertyDetails";
import InternalPropertyDetails from "./InternalPropertyDetails";

const PropertyDetailsModal = ({ isOpen, onClose, propertyId, source, sourceId }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && propertyId) {
      fetchPropertyDetails();
    } else {
      // Reset state when modal closes
      setProperty(null);
      setError(null);
    }
  }, [isOpen, propertyId, source]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await propertiesAPI.getPropertyDetails(propertyId, source);
      if (response.data.status === "success") {
        setProperty(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch property details");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch property details"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const displaySource = property?.source || source || "unknown";
  const displayAddress = property
    ? `${property.street_address || ""}${property.unit_apt ? ` ${property.unit_apt}` : ""}, ${property.city || ""}, ${property.state || ""} ${property.zip_code || ""}`.trim()
    : "Property Details";

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-3 pt-2 sm:pt-3 pb-2 sm:pb-3 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-1.5rem)] flex flex-col overflow-hidden border border-purple-700/30 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-sm border-b border-purple-700/30 p-3 sm:p-6 flex items-center justify-between z-10">
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 truncate">{displayAddress}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  displaySource === "attom"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-green-500/20 text-green-300 border border-green-500/30"
                }`}
              >
                {displaySource === "attom" ? "ATTOM Data" : "Internal Property"}
              </span>
              {property?.attom_id && (
                <span className="text-xs text-gray-400 truncate">
                  ID: {property.attom_id}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-900/30 rounded-full text-purple-300 transition-all hover:text-white flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <span className="ml-3 text-gray-300">Loading property details...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300">
              <p className="font-semibold">Error loading property details</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && property && (
            <>
              {displaySource === "attom" ? (
                <ATTOMPropertyDetails property={property} />
              ) : (
                <InternalPropertyDetails property={property} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;

