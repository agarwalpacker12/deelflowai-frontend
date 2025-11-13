import PropertyImageCarousel from "./PropertyImageCarousel";

const InternalPropertyDetails = ({ property }) => {
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const InfoRow = ({ label, value, highlight = false }) => {
    if (!value && value !== 0 && value !== false) return null;
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 py-2 border-b border-gray-700/50 ${highlight ? 'bg-purple-900/10' : ''}`}>
        <div className="text-gray-400 text-sm font-medium">{label}:</div>
        <div className={`text-white text-sm ${highlight ? 'font-semibold text-purple-300' : ''} break-words`}>
          {String(value)}
        </div>
      </div>
    );
  };

  const fullAddress = `${property.street_address || ""}${property.unit_apt ? ` ${property.unit_apt}` : ""}, ${property.city || ""}, ${property.state || ""} ${property.zip_code || ""}`.trim();

  return (
    <div className="space-y-6">
      {/* Images Carousel */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Property Images</h3>
        <PropertyImageCarousel images={property.images || []} propertyAddress={fullAddress} />
      </div>

      {/* Basic Information */}
      <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Property Information</h3>
        <div className="space-y-2">
          <InfoRow label="Property ID" value={property.id} highlight />
          <InfoRow label="Full Address" value={fullAddress} highlight />
          <InfoRow label="Street Address" value={property.street_address} />
          <InfoRow label="Unit/Apt" value={property.unit_apt} />
          <InfoRow label="City" value={property.city} />
          <InfoRow label="State" value={property.state} />
          <InfoRow label="ZIP Code" value={property.zip_code} />
          <InfoRow label="County" value={property.county} />
          <InfoRow label="Property Type" value={property.property_type} />
          <InfoRow label="Bedrooms" value={property.bedrooms} />
          <InfoRow label="Bathrooms" value={property.bathrooms} />
          <InfoRow label="Square Feet" value={property.square_feet} />
          <InfoRow label="Lot Size" value={property.lot_size} />
          <InfoRow label="Year Built" value={property.year_built} />
          <InfoRow label="Status" value={property.status} />
          <InfoRow label="Transaction Type" value={property.transaction_type} />
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Financial Information</h3>
        <div className="space-y-2">
          <InfoRow label="Purchase Price" value={formatCurrency(property.purchase_price)} highlight />
          <InfoRow label="ARV (After Repair Value)" value={formatCurrency(property.arv)} highlight />
          <InfoRow label="Repair Estimate" value={formatCurrency(property.repair_estimate)} />
          <InfoRow label="Holding Costs" value={formatCurrency(property.holding_costs)} />
          <InfoRow label="Assignment Fee" value={formatCurrency(property.assignment_fee)} />
        </div>
      </div>

      {/* Description & Notes */}
      {(property.property_description || property.seller_notes) && (
        <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Additional Information</h3>
          <div className="space-y-4">
            {property.property_description && (
              <div>
                <div className="text-gray-400 text-sm mb-2">Property Description:</div>
                <div className="text-white text-sm">{property.property_description}</div>
              </div>
            )}
            {property.seller_notes && (
              <div>
                <div className="text-gray-400 text-sm mb-2">Seller Notes:</div>
                <div className="text-white text-sm">{property.seller_notes}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Metadata</h3>
        <div className="space-y-2">
          <InfoRow label="Created At" value={formatDate(property.created_at)} />
          <InfoRow label="Updated At" value={formatDate(property.updated_at)} />
        </div>
      </div>
    </div>
  );
};

export default InternalPropertyDetails;

