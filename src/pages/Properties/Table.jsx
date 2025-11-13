import { useState } from "react";
import { Home, BedDouble, Bath, DollarSign, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { propertySaveAPI } from "../../services/api";
import PropertyDetailsModal from "../../components/PropertyDetails/PropertyDetailsModal";

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
  console.log("101", properties);
  const staticImages = [
    "house1.jpg",
    "house2.jpg",
    "house3.jpg",
    "house4.jpg",
    "house5.jpg",
    "house6.jpg",
    "house7.jpg",
    "house8.jpg",
    "house9.jpg",
    "house10.jpg",
  ];

  const randomStaticImage =
    staticImages[Math.floor(Math.random() * staticImages.length)];
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  // Add state for saving property
  const [savingId, setSavingId] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(null);
  // Add state for property details modal
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Remove direct API call, just handle loading/error UI
  const handleDeleteClick = async (property) => {
    setDeleteError("");
    setDeletingId(property.source_id);
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
    setSavingId(property.source_id);
    try {
      // Assuming API expects { property_id: ... }
      const response = await propertySaveAPI.createPropertySave({
        property_id: property.source_id,
      });

      // Check if the save was successful
      if (response.data.status === "success") {
        setSaveSuccess(property.source_id);
        setTimeout(() => setSaveSuccess(null), 1500);
        // Notify parent to update savedPropertyIds
        if (onPropertySaved) onPropertySaved(property.source_id);
      }
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

  // Handler for viewing property details
  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  };

  // Handler for closing details modal
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProperty(null);
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
        <>
          {deleteError && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-2 text-red-300 text-center mb-2 mx-4 mt-4">
              {deleteError}
            </div>
          )}
          {saveError && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-2 text-red-300 text-center mb-2 mx-4 mt-4">
              {saveError}
            </div>
          )}
          
          {/* Desktop Table View - Hidden on mobile/tablet */}
          <div className="hidden lg:block overflow-x-auto relative">
            <table className="w-full min-w-[1024px]">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="text-left p-3 xl:p-4 text-white font-semibold text-sm xl:text-base">
                    Image
                  </th>
                  <th className="text-left p-3 xl:p-4 text-white font-semibold text-sm xl:text-base">
                    Address
                  </th>
                  <th className="text-left p-3 xl:p-4 text-white font-semibold text-sm xl:text-base">
                    Specs
                  </th>
                  <th className="text-left p-3 xl:p-4 text-white font-semibold text-sm xl:text-base">
                    Financials
                  </th>
                  <th className="text-left p-3 xl:p-4 text-white font-semibold text-sm xl:text-base">
                    AI Score
                  </th>
                  <th className="text-left p-3 xl:p-4 text-white font-semibold text-sm xl:text-base">
                    Status
                  </th>
                  <th className="text-left p-3 xl:p-4 text-white font-semibold text-sm xl:text-base min-w-[160px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
              {properties.map((property) => {
                // Use first image from property.images array, fallback to static images
                let propertyImage = null;
                if (property.images && property.images.length > 0) {
                  const firstImage = property.images[0];
                  // Check if it's a full URL (http or https) or a data URL
                  if (typeof firstImage === 'string') {
                    if (firstImage.startsWith('http://') || firstImage.startsWith('https://') || firstImage.startsWith('data:')) {
                      // Full URL or data URL - use directly
                      propertyImage = firstImage;
                    } else if (firstImage.startsWith('/')) {
                      // Already a path starting with / - use as is
                      propertyImage = firstImage;
                    } else {
                      // Relative path - prepend /images/
                      propertyImage = `/images/${firstImage}`;
                    }
                  } else {
                    propertyImage = null;
                  }
                }
                
                // Fallback to deterministic static image based on property ID if no image found
                if (!propertyImage) {
                  const propertyIdNum = typeof property.id === 'string' 
                    ? (property.id.match(/\d+/) ? parseInt(property.id.match(/\d+/)[0], 10) : 0)
                    : (property.id || 0);
                  const imageIndex = propertyIdNum % staticImages.length;
                  propertyImage = `/images/${staticImages[imageIndex]}`;
                }
                
                return (
                  <tr
                    key={property.id}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="p-3 xl:p-4">
                      {propertyImage ? (
                        <img
                          src={propertyImage}
                          alt="Property"
                          className="w-16 h-12 xl:w-20 xl:h-16 object-cover rounded-lg border border-white/10"
                          onError={(e) => {
                            // Fallback to first static image if image fails to load
                            const fallbackIndex = (property.id || 0) % staticImages.length;
                            e.target.src = `/images/${staticImages[fallbackIndex]}`;
                          }}
                        />
                      ) : (
                        <div className="w-16 h-12 xl:w-20 xl:h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Home className="h-6 w-6 xl:h-8 xl:w-8 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-3 xl:p-4">
                      <div className="text-white font-medium text-sm xl:text-base">
                        <span className="line-clamp-1">{property.address}</span>
                        {property.unit && (
                          <span className="text-xs text-gray-400 block">
                            {property.unit}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-400 text-xs xl:text-sm">
                        {property.city}, {property.state} {property.zip}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {property.property_type?.replace("_", " ")}
                      </div>
                    </td>
                    <td className="p-3 xl:p-4">
                      <div className="flex items-center gap-2 text-gray-300 text-xs xl:text-sm">
                        <BedDouble className="h-3 w-3 xl:h-4 xl:w-4" /> {property.bedrooms}{" "}
                        <span className="ml-1 xl:ml-2">
                          <Bath className="h-3 w-3 xl:h-4 xl:w-4 inline" />{" "}
                          {property.bathrooms}
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
                    <td className="p-3 xl:p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 xl:gap-2 text-green-400 text-xs xl:text-sm">
                          <DollarSign className="h-3 w-3" />
                          <span className="truncate">{formatCurrency(property.purchase_price)}</span>
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
                    <td className="p-3 xl:p-4">
                      <span
                        className={`text-xs xl:text-sm font-medium ${getScoreColor(
                          property.ai_score
                        )}`}
                      >
                        {property.ai_score}
                      </span>
                    </td>
                    <td className="p-3 xl:p-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>
                      <div className="text-xs text-gray-500 capitalize mt-1">
                        {property.transaction_type}
                      </div>
                    </td>
                    <td className="p-2 xl:p-3 min-w-[160px]">
                      <div className="flex gap-1 xl:gap-2 flex-nowrap justify-start">
                        {/* Heart icon for saved property */}
                        {savedPropertyIds &&
                        savedPropertyIds.includes(property.source_id) ? (
                          <button
                            className="p-1.5 xl:p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors cursor-default flex-shrink-0"
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
                            className="p-1.5 xl:p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                            onClick={() => handleSaveClick(property)}
                            title="Save Property"
                            disabled={savingId == property.source_id}
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
                          className="p-1.5 xl:p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors flex-shrink-0"
                          onClick={() => handleViewDetails(property)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 xl:p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors flex-shrink-0"
                          onClick={() =>
                            navigate(`/app/properties/${property.source_id}`)
                          }
                          title="Edit Property"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        {/* <button
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        onClick={() =>
                          navigate(`/app/properties/${property.id}/bid`)
                        }
                      >
                        Bid
                      </button> */}

                        <button
                          className="p-1.5 xl:p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                          onClick={() => handleDeleteClick(property)}
                          disabled={deletingId == property.source_id}
                        >
                          {deletingId == property.source_id ? (
                            <span className="inline-block w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>

          {/* Mobile Card View - Visible on mobile/tablet */}
          <div className="lg:hidden space-y-4 p-4">
            {properties.map((property) => {
              // Use first image from property.images array, fallback to static images
              let propertyImage = null;
              if (property.images && property.images.length > 0) {
                const firstImage = property.images[0];
                if (typeof firstImage === 'string') {
                  if (firstImage.startsWith('http://') || firstImage.startsWith('https://') || firstImage.startsWith('data:')) {
                    propertyImage = firstImage;
                  } else if (firstImage.startsWith('/')) {
                    propertyImage = firstImage;
                  } else {
                    propertyImage = `/images/${firstImage}`;
                  }
                }
              }
              
              if (!propertyImage) {
                const propertyIdNum = typeof property.id === 'string' 
                  ? (property.id.match(/\d+/) ? parseInt(property.id.match(/\d+/)[0], 10) : 0)
                  : (property.id || 0);
                const imageIndex = propertyIdNum % staticImages.length;
                propertyImage = `/images/${staticImages[imageIndex]}`;
              }

              return (
                <div
                  key={property.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 space-y-4"
                >
                  {/* Image and Address Row */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {propertyImage ? (
                        <img
                          src={propertyImage}
                          alt="Property"
                          className="w-24 h-20 object-cover rounded-lg border border-white/10"
                          onError={(e) => {
                            const fallbackIndex = (property.id || 0) % staticImages.length;
                            e.target.src = `/images/${staticImages[fallbackIndex]}`;
                          }}
                        />
                      ) : (
                        <div className="w-24 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Home className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">
                        {property.address}
                        {property.unit && (
                          <span className="text-xs text-gray-400"> {property.unit}</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {property.city}, {property.state} {property.zip}
                      </div>
                      <div className="text-xs text-gray-500 capitalize mt-1">
                        {property.property_type?.replace("_", " ")}
                      </div>
                    </div>
                  </div>

                  {/* Specs Row */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <BedDouble className="h-4 w-4" />
                      <span>{property.bedrooms || 0} Beds</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms || 0} Baths</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {property.square_feet ? `${property.square_feet} sqft` : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {property.lot_size ? `Lot: ${property.lot_size} ac` : 'Lot: N/A'}
                    </div>
                  </div>

                  {/* Financials Row */}
                  <div className="space-y-1 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Price:</span>
                      <span className="text-green-400 text-sm font-medium">
                        {formatCurrency(property.purchase_price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">ARV:</span>
                      <span className="text-gray-300 text-xs">
                        {formatCurrency(property.arv)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Profit:</span>
                      <span className="text-gray-300 text-xs">
                        {formatCurrency(property.profit_potential)}
                      </span>
                    </div>
                  </div>

                  {/* Status and Score Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">AI Score:</span>
                      <span className={`text-sm font-medium ${getScoreColor(property.ai_score)}`}>
                        {property.ai_score}
                      </span>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(property.status)}`}
                    >
                      {property.status}
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex gap-2">
                      {savedPropertyIds && savedPropertyIds.includes(property.source_id) ? (
                        <button
                          className="p-2 text-red-500 rounded-lg"
                          title="Saved Property"
                          disabled
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 fill-red-500"
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
                          disabled={savingId == property.source_id}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
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
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        onClick={() => handleViewDetails(property)}
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                        onClick={() => navigate(`/app/properties/${property.source_id}`)}
                        title="Edit Property"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      onClick={() => handleDeleteClick(property)}
                      disabled={deletingId == property.source_id}
                    >
                      {deletingId == property.source_id ? (
                        <span className="inline-block w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          propertyId={selectedProperty.source_id || selectedProperty.id}
          source={selectedProperty.source}
          sourceId={selectedProperty.source_id}
        />
      )}
    </div>
  );
};

export default Table;
