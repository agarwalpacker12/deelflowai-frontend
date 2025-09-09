import * as yup from "yup";

// Default form values
export const DefaultValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  property_address: "",
  property_city: "",
  property_state: "",
  property_zip: "",
  property_type: "single_family",
  source: "",
  estimated_value: "",
  mortgage_balance: "",
  asking_price: "",
  preferred_contact_method: "",
  lead_type: "",
  status: "new",
};

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

// status options
export const statusList = [
  { value: "", label: "Select Status" },
  { value: "new", label: "new" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "negotiating", label: "Negotiating" },
  { value: "contract", label: "Contract" },
  { value: "closed", label: "Closed" },
  { value: "dead", label: "Dead" },
];

// Lead type options
export const LeadTypeList = [
  { value: "", label: "Select Lead Type" },
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" },
];

// Source options
export const sourceList = [
  { value: "", label: "Select Source" },
  { value: "website_form", label: "Website Form" },
  { value: "referral", label: "Referral" },
  { value: "cold_call", label: "Cold Call" },
  { value: "direct_mail", label: "Direct Mail" },
  { value: "social_media", label: "Social Media" },
  { value: "yard_sign", label: "Yard Sign" },
  { value: "other", label: "Other" },
];

// Contact method options
export const contactMethodList = [
  { value: "", label: "Select Contact Method" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "text", label: "Text/SMS" },
];

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

// Validation function
export const leadSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  property_address: yup.string().required("Property address is required"),
  property_city: yup.string().required("City is required"),
  property_state: yup.string().required("State is required"),
  property_zip: yup.string().required("ZIP code is required"),
  property_type: yup.string().required("Property type is required"),
  lead_type: yup.string().required("Lead type is required"),
  source: yup.string().required("Lead source is required"),
  preferred_contact_method: yup
    .string()
    .required("Preferred contact method is required"),
  estimated_value: yup.string().optional(),
  mortgage_balance: yup.string().optional(),
  asking_price: yup.string().optional(),
});
