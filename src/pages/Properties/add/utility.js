// Property type options
export const propertyTypeList = [
  { value: "", label: "Select Property Type" },
  { value: "single_family", label: "Single Family" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "multi_family", label: "Multi Family" },
  { value: "duplex", label: "Duplex" },
  { value: "mobile_home", label: "Mobile Home" },
];
// single_family, townhouse, condo, duplex, multi_family, mobile_home

// Transaction type options
export const transactionTypeList = [
  { value: "", label: "Select Transaction Type" },
  { value: "wholesale", label: "Wholesale" },
  { value: "fix_and_flip", label: "Fix & Flip" },
  { value: "assignment", label: "Assignment" },
  { value: "double_close", label: "Double Close" },
  { value: "buy_and_hold", label: "Buy & Hold" },

];
//  assignment, double_close, wholesale, fix_and_flip, buy_and_holds
// US States list
export const stateList = [
  { value: "", label: "Select State" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

// Default form values
export const DefaultValues = {
  street_address: "",
  unit_apt: "",
  city: "",
  state: "",
  zip_code: "",
  county: "",
  property_type: "",
  bedrooms: "",
  bathrooms: "",
  square_feet: "",
  lot_size: "",
  year_built: "",
  purchase_price: "",
  arv: "",
  repair_estimate: "",
  holding_costs: "",
  transaction_type: "",
  assignment_fee: "",
  property_description: "",
  seller_notes: "",
};

// Validation function
export const validateField = (fieldName, value) => {
  switch (fieldName) {
    case "street_address":
      return !value.trim() ? "Street address is required" : "";
    case "city":
      return !value.trim() ? "City is required" : "";
    case "state":
      return !value ? "State is required" : "";
    case "zip_code":
      return !value.trim() ? "ZIP code is required" : "";
    case "county":
      return !value.trim() ? "County is required" : "";
    case "property_type":
      return !value ? "Property type is required" : "";
    case "bedrooms":
      return !value || value < 0 ? "Valid number of bedrooms is required" : "";
    case "bathrooms":
      return !value || value < 0 ? "Valid number of bathrooms is required" : "";
    case "square_feet":
      return !value || value < 0 ? "Valid square footage is required" : "";
    case "lot_size":
      return !value || value < 0 ? "Valid lot size is required" : "";
    case "year_built":
      return !value || value < 1800 || value > new Date().getFullYear()
        ? "Valid year built is required"
        : "";
    case "purchase_price":
      return !value || value < 0 ? "Valid purchase price is required" : "";
    case "arv":
      return !value || value < 0 ? "Valid ARV is required" : "";
    case "repair_estimate":
      return !value || value < 0 ? "Valid repair estimate is required" : "";
    case "holding_costs":
      return !value || value < 0 ? "Valid holding costs are required" : "";
    case "transaction_type":
      return !value ? "Transaction type is required" : "";
    case "assignment_fee":
      return !value || value < 0 ? "Valid assignment fee is required" : "";
    case "property_description":
      return !value.trim() ? "Property description is required" : "";
    case "unit_apt":
      return !value.trim() ? "Unit/Apt is required" : "";
    case "seller_notes":
      return !value.trim() ? "Seller notes are required" : "";
    default:
      return "";
  }
};
