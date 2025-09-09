import * as yup from "yup";

export const DefaultValues = {
  name: "",
  campaign_type: "",
  channel: "email",
  target_criteria: {
    location: "",
    property_type: "",
    equity_min: 50000,
  },
  subject_line: "",
  email_content: "",
  scheduled_at: "",
  budget: 1000.0,
  use_ai_personalization: true,
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

  target_criteria: yup.object().shape({
    location: yup.string().required("Location is required"),
    property_type: yup.string().required("Property type is required"),
    equity_min: yup
      .number()
      .required("Minimum equity is required")
      .min(0, "Equity must be non-negative"),
  }),
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
