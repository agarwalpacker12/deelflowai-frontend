// Default form values
export const DefaultValues = {
  property_id: "",
  lead_id: "",
  deal_type: "",
  buyer_id: "",
  seller_id: "",
  inspection_period: "",
  purchase_price: "",
  sale_price: "",
  assignment_fee: "",
  earnest_money: "",
  contract_date: "",
  closing_date: "",
  financing_contingency: false,
  inspection_contingency: false,
  appraisal_contingency: false,
  title_contingency: false,
  notes: "",
};

// Deal type options
export const dealTypeList = [
  { value: "", label: "Select Deal Type" },
  { value: "assignment", label: "Assignment" },
  { value: "wholesale", label: "Wholesale" },
  { value: "fix_flip", label: "Fix & Flip" },
  { value: "double_close", label: "Double & cCose" }
]; 

// Validation function
export const validateField = (fieldName, value) => {
  switch (fieldName) {
    // case "property_id":
    //   return !value ? "Property ID is required" : "";
    case "lead_id":
      return !value ? "Lead ID is required" : "";
    case "deal_type":
      return !value ? "Deal type is required" : "";
    // case "buyer_id":
    //   return !value ? "Buyer ID is required" : "";
    case "seller_id":
      return !value ? "Seller ID is required" : "";
    case "purchase_price":
      if (!value) return "Purchase price is required";
      if (isNaN(value) || parseFloat(value) <= 0) return "Purchase price must be a positive number";
      return "";
    case "sale_price":
      if (!value) return "Sale price is required";
      if (isNaN(value) || parseFloat(value) <= 0) return "Sale price must be a positive number";
      return "";
    case "contract_date":
      return !value ? "Contract date is required" : "";
    case "closing_date":
      return !value ? "Closing date is required" : "";
    case "inspection_period":
      if (value && (isNaN(value) || parseInt(value) < 0)) {
        return "Inspection period must be a positive number";
      }
      return "";
    case "assignment_fee":
      if (value && (isNaN(value) || parseFloat(value) < 0)) {
        return "Assignment fee must be a positive number";
      }
      return "";
    case "earnest_money":
      if (value && (isNaN(value) || parseFloat(value) < 0)) {
        return "Earnest money must be a positive number";
      }
      return "";
    default:
      return "";
  }
};

