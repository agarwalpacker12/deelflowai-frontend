import * as yup from "yup";

// Campaign types
export const campaignTypes = [
  { value: "direct_mail", label: "Direct Mail" },
  { value: "email", label: "Email Marketing" },
  { value: "sms", label: "SMS Campaign" },
  { value: "social_media", label: "Social Media" },
  { value: "cold_calling", label: "Cold Calling" },
  { value: "buyer_finder", label: "Buyer Finder" },
  { value: "seller_finder", label: "Seller Finder" },
];

// Communication channels
export const channels = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "ai_voice_call", label: "AI Voice Call" },
  { value: "social_media", label: "Social Media" },
];

// Property types
export const propertyTypes = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "land", label: "Land" },
  { value: "multi_family", label: "Multi-Family" },
];

// Default form values
export const DefaultValues = {
  // Basic campaign information
  name: "",
  campaign_type: "buyer_finder",
  channel: [],
  budget: 1,
  scheduled_start_date: "",
  scheduled_end_date: "",
  scheduled_start_time: "",
  scheduled_end_time: "",
  subject_line: "",
  email_content: "",
  use_ai_personalization: true,
  status: "",

  // Geographic scope (for general campaigns)
  geographic_scope_type: "",
  geographic_scope_values: [],

  // Basic property filters
  location: "",
  property_type: "",
  minimum_equity: 0,
  min_price: 250000,
  max_price: 750000,
  distress_indicators: [],

  // Buyer Finder - Demographic Details
  last_qualification: "",
  age_range: "",
  ethnicity: "",
  salary_range: "",
  marital_status: "",
  employment_status: "",
  home_ownership_status: "",

  // Buyer Finder - Geographic Details
  buyer_country: "",
  buyer_state: "",
  buyer_counties: "",
  buyer_city: "",
  buyer_districts: "",
  buyer_parish: "",

  // Seller Finder - Geographic Details
  seller_country: "",
  seller_state: "",
  seller_counties: "",
  seller_city: "",
  seller_districts: "",
  seller_parish: "",

  // Seller Finder - Additional Fields
  property_year_built_min: "",
  property_year_built_max: "",
  seller_keywords: "",
};

// Main campaign schema
export const campaignSchema = yup.object().shape({
  // Required basic fields
  name: yup
    .string()
    .required("Campaign name is required")
    .min(3, "Campaign name must be at least 3 characters")
    .max(100, "Campaign name must be less than 100 characters"),

  campaign_type: yup
    .string()
    .required("Campaign type is required")
    .oneOf(
      campaignTypes.map((type) => type.value),
      "Please select a valid campaign type"
    ),

  channel: yup
    .array()
    .of(
      yup.string().oneOf(
        channels.map((ch) => ch.value),
        "Please select a valid channel"
      )
    )
    .min(1, "Please select at least one channel")
    .required("Channel is required"),

  budget: yup
    .number()
    .nullable()
    .min(0.01, "Budget must be greater than $0.01")
    .max(1000000, "Budget cannot exceed $1,000,000"),

  scheduled_start_date: yup
    .string()
    .required("Start date is required")
    .test("future-date", "Start date must be in the future", function (value) {
      if (!value) return false;
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return startDate >= today;
    }),

  scheduled_end_date: yup
    .string()
    .required("End date is required")
    .test(
      "after-start-date",
      "End date must be after or equal to start date",
      function (value) {
        if (!value) return false;
        const startDate = this.parent.scheduled_start_date;
        if (!startDate) return true; // Let start_date validation handle it
        return new Date(value) >= new Date(startDate);
      }
    ),

  scheduled_start_time: yup.string().required("Start time is required"),

  scheduled_end_time: yup
    .string()
    .required("End time is required")
    .test(
      "after-start-time",
      "End time must be after start time",
      function (value) {
        if (!value) return false;
        const startTime = this.parent.scheduled_start_time;
        if (!startTime) return true; // Let start_time validation handle it
        // Compare time strings (HH:MM format)
        return value > startTime;
      }
    ),

  subject_line: yup
    .string()
    .required("Subject line is required")
    .min(5, "Subject line must be at least 5 characters")
    .max(150, "Subject line must be less than 150 characters"),

  email_content: yup.string().required("Email content is required"),
  // .min(20, "Email content must be at least 20 characters")
  // .max(5000, "Email content must be less than 5000 characters"),

  status: yup
    .string()
    .required("Status is required")
    .oneOf(["active", "inactive", "draft"], "Please select a valid status"),

  use_ai_personalization: yup.boolean(),

  // Geographic scope fields (conditional validation)
  geographic_scope_type: yup.string().when("campaign_type", {
    is: (val) => val && !["buyer_finder", "seller_finder"].includes(val),
    then: (schema) => schema.required("Geographic scope type is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  // geographic_scope_values: yup.string().when("campaign_type", {
  //   is: (val) => val && !["buyer_finder", "seller_finder"].includes(val),
  //   then: (schema) => schema.required("Geographic scope values are required"),
  //   otherwise: (schema) => schema.nullable(),
  // }),

  // Property filters (conditional for non-buyer campaigns)
  // location: yup.string().when("campaign_type", {
  //   is: (val) => val && val !== "buyer_finder",
  //   then: (schema) => schema.required("Location is required"),
  //   otherwise: (schema) => schema.nullable(),
  // }),

  property_type: yup.string().when("campaign_type", {
    is: (val) => val && val !== "buyer_finder",
    then: (schema) => schema.required("Property type is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  minimum_equity: yup.number().when("campaign_type", {
    is: (val) => val && val !== "buyer_finder",
    then: (schema) =>
      schema
        .required("Minimum equity is required")
        .min(0, "Minimum equity must be non-negative")
        .max(10000000, "Minimum equity cannot exceed $10,000,000"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Price range validation (conditional)
  min_price: yup.number().when("campaign_type", {
    is: (val) => val && !["buyer_finder", "seller_finder"].includes(val),
    then: (schema) =>
      schema
        .required("Minimum price is required")
        .min(1000, "Minimum price must be at least $1,000")
        .max(50000000, "Minimum price cannot exceed $50,000,000"),
    otherwise: (schema) => schema.nullable(),
  }),

  max_price: yup.number().when(["campaign_type", "min_price"], {
    is: (campaign_type, min_price) =>
      campaign_type &&
      !["buyer_finder", "seller_finder"].includes(campaign_type),
    then: (schema) =>
      schema
        .required("Maximum price is required")
        .min(
          yup.ref("min_price"),
          "Maximum price must be greater than minimum price"
        )
        .max(50000000, "Maximum price cannot exceed $50,000,000"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Distress indicators (conditional)
  distress_indicators: yup.array().when("campaign_type", {
    is: (val) => val && val !== "buyer_finder",
    then: (schema) =>
      schema
        .of(yup.string())
        .min(1, "Please select at least one distress indicator"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Buyer Finder - Demographic Details (conditional validation)
  last_qualification: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  age_range: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  ethnicity: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  salary_range: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  marital_status: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) =>
      schema.oneOf(
        ["married", "single", "divorced", ""],
        "Please select a valid marital status"
      ),
    otherwise: (schema) => schema.nullable(),
  }),

  employment_status: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) =>
      schema.oneOf(
        ["employed", "self_employed", "retired", ""],
        "Please select a valid employment status"
      ),
    otherwise: (schema) => schema.nullable(),
  }),

  home_ownership_status: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) =>
      schema.oneOf(
        ["own_home", "rent_home", ""],
        "Please select a valid home ownership status"
      ),
    otherwise: (schema) => schema.nullable(),
  }),

  // Buyer Finder - Geographic Details (conditional)
  buyer_country: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  buyer_state: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  buyer_counties: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  buyer_city: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  buyer_districts: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  buyer_parish: yup.string().when("campaign_type", {
    is: "buyer_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  // Seller Finder - Geographic Details (conditional)
  seller_country: yup.string().when("campaign_type", {
    is: "seller_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  seller_state: yup.string().when("campaign_type", {
    is: "seller_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  seller_counties: yup.string().when("campaign_type", {
    is: "seller_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  seller_city: yup.string().when("campaign_type", {
    is: "seller_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  seller_districts: yup.string().when("campaign_type", {
    is: "seller_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  seller_parish: yup.string().when("campaign_type", {
    is: "seller_finder",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable(),
  }),

  // // Seller Finder - Additional Fields (conditional)
  // property_year_built_min: yup.string().when("campaign_type", {
  //   is: "seller_finder",
  //   then: (schema) =>
  //     schema
  //       .nullable()
  //       .min(1800, "Year built cannot be before 1800")
  //       .max(
  //         new Date().getFullYear(),
  //         `Year built cannot be after ${new Date().getFullYear()}`
  //       ),
  //   otherwise: (schema) => schema.nullable().optional(),
  // }),

  // property_year_built_max: yup
  //   .string()
  //   .when(["campaign_type", "property_year_built_min"], {
  //     is: (campaign_type, min_year) => campaign_type === "seller_finder",
  //     then: (schema) =>
  //       schema
  //         .nullable()
  //         .min(
  //           yup.ref("property_year_built_min"),
  //           "Max year must be greater than or equal to min year"
  //         )
  //         .max(
  //           new Date().getFullYear(),
  //           `Year built cannot be after ${new Date().getFullYear()}`
  //         ),
  //     otherwise: (schema) => schema.nullable(),
  //   }),

  // Seller Finder - Additional Fields (conditional)
  property_year_built_min: yup.string().when("campaign_type", {
    is: "seller_finder",
    then: (schema) => schema.required("Property year built min is required"),
    otherwise: (schema) => schema.nullable().optional(),
  }),

  property_year_built_max: yup.string().when("campaign_type", {
    is: "seller_finder",
    then: (schema) => schema.required("Property year built max is required"),
    otherwise: (schema) => schema.nullable().optional(),
  }),

  seller_keywords: yup.string().when("campaign_type", {
    is: "seller_finder",
    then: (schema) =>
      schema.nullable().max(1000, "Keywords must be less than 1000 characters"),
    otherwise: (schema) => schema.nullable(),
  }),
});

// Helper function to get conditional validation rules
export const getConditionalValidation = (campaignType) => {
  const rules = {
    showGeographicScope: !["buyer_finder", "seller_finder"].includes(
      campaignType
    ),
    showPropertyFilters: campaignType !== "buyer_finder",
    showPriceRange: !["buyer_finder", "seller_finder"].includes(campaignType),
    showBuyerDemographics: campaignType === "buyer_finder",
    showBuyerGeographics: campaignType === "buyer_finder",
    showSellerGeographics: campaignType === "seller_finder",
    showSellerFields: campaignType === "seller_finder",
  };

  return rules;
};

// Validation messages
export const validationMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, min) => `${field} must be at least ${min} characters`,
  maxLength: (field, max) => `${field} must be less than ${max} characters`,
  minValue: (field, min) => `${field} must be at least ${min}`,
  maxValue: (field, max) => `${field} cannot exceed ${max}`,
  futureDate: "Date must be in the future",
  validEmail: "Please enter a valid email address",
  validPhone: "Please enter a valid phone number",
  invalidOption: "Please select a valid option",
};
