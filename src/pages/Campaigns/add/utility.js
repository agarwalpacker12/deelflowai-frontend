import * as yup from "yup";

export const DefaultValues = {
  name: "",
  campaign_type: "",
  channel: "email",
  budget: 1000.0,
  scheduled_at: "",
  subject_line: "",
  email_content: "",
  use_ai_personalization: true,
  status: "",

  // ✅ New fields
  geographic_scope_type: "", // e.g. "zip", "city", etc.
  // geographic_scope_values: [], // array of zip codes or locations
  location: "", // top-level location
  property_type: "", // e.g. "Residential"
  minimum_equity: 0, // min equity for campaign
  min_price: 0,
  max_price: 0,
  distress_indicators: [], // array of strings

  // existing nested criteria
  // target_criteria: {
  location: "",
  property_type: "",
  equity_min: 50000,
  // },
};

export const campaignSchema = yup.object().shape({
  name: yup
    .string()
    .required("Campaign name is required")
    .min(3, "Campaign name must be at least 3 characters"),
  campaign_type: yup.string().required("Campaign type is required"),
  channel: yup.string().required("Channel is required"),
  subject_line: yup.string().required("Subject line is required"),
  email_content: yup.string().required("Email content is required"),
  scheduled_at: yup
    .date()
    .required("Scheduled date is required")
    .typeError("Scheduled date must be a valid date"),
  budget: yup
    .number()
    .required("Budget is required")
    .min(0.01, "Budget must be a positive number"),
  use_ai_personalization: yup
    .boolean()
    .required("Use AI Personalization must be true or false"),
  status: yup
    .string()
    .oneOf(["active", "inactive", "draft"], "Invalid status")
    .required("Status is required"),

  // ✅ New fields
  geographic_scope_type: yup
    .string()
    .required("Geographic scope type is required"),
  // geographic_scope_values: yup
  //   .array()
  //   .of(yup.string().required())
  //   .min(1, "At least one geographic scope value is required"),

  location: yup.string().required("Location is required"),
  property_type: yup.string().required("Property type is required"),
  minimum_equity: yup
    .number()
    .required("Minimum equity is required")
    .min(0, "Minimum equity must be non-negative"),

  min_price: yup
    .number()
    .required("Minimum price is required")
    .min(0, "Minimum price must be non-negative"),
  max_price: yup
    .number()
    .required("Maximum price is required")
    .min(
      yup.ref("min_price"),
      "Max price must be greater than or equal to Min price"
    ),

  distress_indicators: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one distress indicator is required"),

  // existing nested object
  // target_criteria: yup.object().shape({
  location: yup.string().required("Location is required"),
  property_type: yup.string().required("Property type is required"),
  equity_min: yup
    .number()
    .required("Minimum equity is required")
    .min(0, "Equity must be non-negative"),
  // }),
});

export const campaignTypes = [
  { value: "seller_finder", label: "Seller Finder" },
  { value: "buyer_finder", label: "Buyer Finder" },
];

export const channels = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "voice", label: "Voice" },
];

export const propertyTypes = [
  { value: "single_family", label: "Single Family" },
  { value: "multi_family", label: "Multi Family" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];
