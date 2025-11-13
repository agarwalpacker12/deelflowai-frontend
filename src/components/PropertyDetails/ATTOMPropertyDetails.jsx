import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, DollarSign, User, Home, Building, FileText, Calendar } from "lucide-react";
import PropertyImageCarousel from "./PropertyImageCarousel";

const ATTOMPropertyDetails = ({ property }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    financial: true,
    owner: false,
    sale: false,
    building: false,
    area: false,
    location: false,
    utilities: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  const SectionHeader = ({ icon: Icon, title, section, count }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-3 sm:p-4 bg-purple-900/30 hover:bg-purple-900/40 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
        <h3 className="text-base sm:text-lg font-semibold text-white truncate">{title}</h3>
        {count !== undefined && (
          <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">({count})</span>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 ml-2" />
      ) : (
        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 ml-2" />
      )}
    </button>
  );

  const formatObjectValue = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item, idx) => (
        <div key={idx} className="mb-1">{formatObjectValue(item)}</div>
      ));
    }
    
    // Handle objects - format as key-value pairs
    return Object.entries(obj).map(([key, val]) => {
      // Format key (convert camelCase to Title Case)
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      
      // Format value
      let formattedVal = val;
      if (typeof val === 'boolean') {
        formattedVal = val ? 'Yes' : 'No';
      } else if (val === null || val === undefined) {
        formattedVal = 'N/A';
      } else if (typeof val === 'object') {
        formattedVal = formatObjectValue(val);
      }
      
      return (
        <div key={key} className="mb-1 pl-2 border-l-2 border-purple-500/30">
          <span className="text-purple-300 font-medium">{formattedKey}:</span>{' '}
          <span className="text-white">{String(formattedVal)}</span>
        </div>
      );
    });
  };

  const InfoRow = ({ label, value, highlight = false }) => {
    if (!value && value !== 0 && value !== false) return null;
    
    // Format object values nicely
    let displayValue = value;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      displayValue = formatObjectValue(value);
    } else if (Array.isArray(value)) {
      displayValue = value.length > 0 ? value.join(', ') : 'N/A';
    } else {
      displayValue = String(value);
    }
    
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 py-2 border-b border-gray-700/50 ${highlight ? 'bg-purple-900/10' : ''}`}>
        <div className="text-gray-400 text-sm font-medium">{label}:</div>
        <div className={`text-white text-sm ${highlight ? 'font-semibold text-purple-300' : ''} break-words`}>
          {displayValue}
        </div>
      </div>
    );
  };

  const fullAddress = `${property.street_address || ""}${property.unit_apt ? ` ${property.unit_apt}` : ""}, ${property.city || ""}, ${property.state || ""} ${property.zip_code || ""}`.trim();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Images Carousel */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Property Images</h3>
        <PropertyImageCarousel images={property.images || []} propertyAddress={fullAddress} />
      </div>

      {/* Basic Information */}
      <div>
        <SectionHeader icon={Home} title="Basic Information" section="basic" />
        {expandedSections.basic && (
          <div className="mt-3 sm:mt-4 bg-gray-800/50 rounded-lg p-3 sm:p-4 space-y-2">
            <InfoRow label="ATTOM ID" value={property.attom_id} highlight />
            <InfoRow label="APN" value={property.apn} />
            <InfoRow label="FIPS Code" value={property.fips} />
            <InfoRow label="Full Address" value={fullAddress} highlight />
            <InfoRow label="Street Address" value={property.street_address} />
            <InfoRow label="Unit/Apt" value={property.unit_apt} />
            <InfoRow label="City" value={property.city} />
            <InfoRow label="State" value={property.state} />
            <InfoRow label="ZIP Code" value={property.zip_code} />
            <InfoRow label="ZIP+4" value={property.address_postal2} />
            <InfoRow label="County" value={property.county} />
            <InfoRow label="Country" value={property.address_country} />
            <InfoRow label="Address Match Code" value={property.address_match_code} />
            <InfoRow label="Property Type" value={property.property_type} />
            <InfoRow label="Property Class" value={property.property_class} />
            <InfoRow label="Property Subtype" value={property.property_subtype} />
            <InfoRow label="Property Land Use" value={property.property_land_use} />
            <InfoRow label="Property Indicator" value={property.property_indicator} />
            <InfoRow label="Absentee Indicator" value={property.absentee_indicator} />
            <InfoRow label="Bedrooms" value={property.bedrooms !== null && property.bedrooms !== undefined ? property.bedrooms : "N/A"} />
            <InfoRow label="Bathrooms" value={property.bathrooms !== null && property.bathrooms !== undefined ? property.bathrooms : "N/A"} />
            <InfoRow label="Square Feet" value={property.square_feet || "N/A"} />
            <InfoRow label="Lot Size (Acres)" value={property.lot_size !== null && property.lot_size !== undefined ? property.lot_size : "N/A"} />
            <InfoRow label="Lot Size (Sq Ft)" value={property.lot_size_sqft} />
            <InfoRow label="Lot Number" value={property.lot_number} />
            <InfoRow label="Pool Type" value={property.pool_type} />
            <InfoRow label="Year Built" value={property.year_built} />
            <InfoRow label="Legal Description" value={property.legal_description} />
            <InfoRow label="Status" value={property.status} />
            <InfoRow label="Last Modified" value={formatDate(property.last_modified)} />
            <InfoRow label="Publication Date" value={formatDate(property.publication_date)} />
          </div>
        )}
      </div>

      {/* Financial Data */}
      <div>
        <SectionHeader icon={DollarSign} title="Financial Information" section="financial" />
        {expandedSections.financial && (
          <div className="mt-3 sm:mt-4 bg-gray-800/50 rounded-lg p-3 sm:p-4 space-y-2">
            <InfoRow label="Purchase Price" value={formatCurrency(property.purchase_price)} highlight />
            <InfoRow label="ARV (After Repair Value)" value={formatCurrency(property.arv)} highlight />
            <InfoRow label="ARV Low Estimate" value={formatCurrency(property.arv_low)} />
            <InfoRow label="ARV High Estimate" value={formatCurrency(property.arv_high)} />
            <InfoRow label="ARV Confidence" value={property.arv_confidence} />
            <InfoRow label="ARV Date" value={formatDate(property.arv_date)} />
            <InfoRow label="Assessed Value" value={formatCurrency(property.assessed_value)} />
            <InfoRow label="Assessed Value Year" value={property.assessed_value_year} />
            <InfoRow label="Market Assessed Value" value={formatCurrency(property.assessed_value_market)} />
            <InfoRow label="Market Assessed Year" value={property.assessed_value_market_year} />
            <InfoRow label="Tax Amount" value={formatCurrency(property.tax_amount)} />
            <InfoRow label="Tax Year" value={property.tax_year} />
            {property.tax_exemptions && property.tax_exemptions.length > 0 && (
              <div className="py-2 border-b border-gray-700/50">
                <div className="text-gray-400 text-sm mb-2 font-medium">Tax Exemptions:</div>
                <div className="text-white text-sm pl-2 sm:pl-4 space-y-1 break-words">
                  {property.tax_exemptions.map((ex, idx) => (
                    <div key={idx} className="pl-2 border-l-2 border-purple-500/30">
                      {typeof ex === 'object' ? formatObjectValue(ex) : String(ex)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Owner Information */}
      <div>
        <SectionHeader icon={User} title="Owner Information" section="owner" />
        {expandedSections.owner && (
          <div className="mt-3 sm:mt-4 bg-gray-800/50 rounded-lg p-3 sm:p-4 space-y-2">
            <InfoRow label="Owner Name" value={property.owner_name} highlight />
            <InfoRow label="Owner First Name" value={property.owner_first_name} />
            <InfoRow label="Owner Last Name" value={property.owner_last_name} />
            <InfoRow label="Owner 2 First Name" value={property.owner2_first_name} />
            <InfoRow label="Owner 2 Last Name" value={property.owner2_last_name} />
            <InfoRow label="Owner Type" value={property.owner_type} />
            <InfoRow label="Owner Occupied" value={property.owner_occupied ? "Yes" : "No"} />
            {property.owner_mailing_address && Object.keys(property.owner_mailing_address).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 py-2 border-b border-gray-700/50">
                <div className="text-gray-400 text-sm font-medium">Mailing Address:</div>
                <div className="text-white text-sm break-words">
                  {[
                    property.owner_mailing_address.line1,
                    property.owner_mailing_address.city,
                    property.owner_mailing_address.state,
                    property.owner_mailing_address.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sale History */}
      <div>
        <SectionHeader
          icon={Calendar}
          title="Sale Information"
          section="sale"
          count={property.sale_history?.length || 0}
        />
        {expandedSections.sale && (
          <div className="mt-3 sm:mt-4 bg-gray-800/50 rounded-lg p-3 sm:p-4 space-y-2">
            <InfoRow label="Last Sale Price" value={formatCurrency(property.purchase_price)} />
            <InfoRow label="Sale Date" value={formatDate(property.sale_date)} />
            <InfoRow label="Sale Recorded Date" value={formatDate(property.sale_recorded_date)} />
            <InfoRow label="Sale Transaction Type" value={property.sale_transaction_type} />
            <InfoRow label="Sale Document Number" value={property.sale_document_number} />
            {property.sale_history && property.sale_history.length > 0 && (
              <div className="mt-4">
                <h4 className="text-white font-semibold mb-2">Sale History:</h4>
                <div className="space-y-3">
                  {property.sale_history.map((sale, idx) => (
                    <div key={idx} className="bg-gray-900/50 rounded p-3 space-y-1">
                      <InfoRow label="Date" value={formatDate(sale.saleDate || sale.date)} />
                      <InfoRow label="Price" value={formatCurrency(sale.amount?.value || sale.price)} />
                      <InfoRow label="Type" value={sale.saleTransType || sale.type} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Building Details */}
      <div>
        <SectionHeader icon={Building} title="Building Details" section="building" />
        {expandedSections.building && (
          <div className="mt-3 sm:mt-4 bg-gray-800/50 rounded-lg p-3 sm:p-4 space-y-2">
            <InfoRow label="Building Size (Universal)" value={property.building_size} />
            <InfoRow label="Living Size" value={property.building_size_living} />
            <InfoRow label="Gross Size (Adjusted)" value={property.building_size_gross} />
            <InfoRow label="Size Indicator" value={property.building_size_indicator} />
            <InfoRow label="Number of Buildings" value={property.building_number} />
            <InfoRow label="Number of Levels" value={property.building_levels} />
            <InfoRow label="View" value={property.building_view} />
            <InfoRow label="Construction Type" value={property.construction_type} />
            <InfoRow label="Frame Type" value={property.frame_type} />
            <InfoRow label="Wall Type" value={property.wall_type} />
            {property.building_interior && Object.keys(property.building_interior).length > 0 && (
              <div className="py-2 border-b border-gray-700/50">
                <div className="text-gray-400 text-sm mb-2 font-medium">Interior Details:</div>
                <div className="text-white text-sm pl-2 sm:pl-4 space-y-1 break-words">
                  {formatObjectValue(property.building_interior)}
                </div>
              </div>
            )}
            {property.building_parking && Object.keys(property.building_parking).length > 0 && (
              <div className="py-2 border-b border-gray-700/50">
                <div className="text-gray-400 text-sm mb-2 font-medium">Parking:</div>
                <div className="text-white text-sm pl-2 sm:pl-4 space-y-1 break-words">
                  {formatObjectValue(property.building_parking)}
                </div>
              </div>
            )}
            {property.building_rooms && Object.keys(property.building_rooms).length > 0 && (
              <div className="py-2 border-b border-gray-700/50">
                <div className="text-gray-400 text-sm mb-2 font-medium">Rooms:</div>
                <div className="text-white text-sm pl-2 sm:pl-4 space-y-1 break-words">
                  {formatObjectValue(property.building_rooms)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Area Information */}
      <div>
        <SectionHeader icon={FileText} title="Area & Legal Information" section="area" />
        {expandedSections.area && (
          <div className="mt-3 sm:mt-4 bg-gray-800/50 rounded-lg p-3 sm:p-4 space-y-2">
            <InfoRow label="Block Number" value={property.area_block_number} />
            <InfoRow label="County Subdivision" value={property.area_county_subdivision} />
            <InfoRow label="County Use Code" value={property.area_county_use} />
            <InfoRow label="Location Type" value={property.area_location_type} />
            <InfoRow label="Municipality Code" value={property.area_municipality_code} />
            <InfoRow label="Municipality Name" value={property.area_municipality_name} />
            <InfoRow label="Survey Range" value={property.area_survey_range} />
            <InfoRow label="Survey Section" value={property.area_survey_section} />
            <InfoRow label="Survey Township" value={property.area_survey_township} />
            <InfoRow label="Subdivision Name" value={property.area_subdivision_name} />
            <InfoRow label="Tax Code Area" value={property.area_tax_code} />
          </div>
        )}
      </div>

      {/* Location Information */}
      <div>
        <SectionHeader icon={MapPin} title="Location & Coordinates" section="location" />
        {expandedSections.location && (
          <div className="mt-3 sm:mt-4 bg-gray-800/50 rounded-lg p-3 sm:p-4 space-y-2">
            <InfoRow label="Latitude" value={property.latitude} />
            <InfoRow label="Longitude" value={property.longitude} />
            <InfoRow label="Location Accuracy" value={property.location_accuracy} />
            <InfoRow label="Location Distance" value={property.location_distance} />
            <InfoRow label="GeoID" value={property.location_geoid} />
            {property.map_link && (
              <div className="mt-4">
                <a
                  href={property.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  View on Google Maps
                </a>
              </div>
            )}
            {property.location_geoIdV4 && Object.keys(property.location_geoIdV4).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 py-2 border-b border-gray-700/50">
                <div className="text-gray-400 text-sm font-medium">GeoID V4:</div>
                <div className="text-white text-xs sm:text-sm break-words">
                  {Object.entries(property.location_geoIdV4).map(([key, value]) => (
                    <div key={key} className="break-all">
                      <span className="text-gray-500">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Utilities */}
      {property.utilities && Object.keys(property.utilities).length > 0 && (
        <div>
          <SectionHeader icon={Home} title="Utilities" section="utilities" />
          {expandedSections.utilities && (
            <div className="mt-3 sm:mt-4 bg-gray-800/50 rounded-lg p-3 sm:p-4">
              <div className="text-white text-sm space-y-1 break-words">
                {formatObjectValue(property.utilities)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ATTOMPropertyDetails;

