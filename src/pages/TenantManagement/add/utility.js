// utility.js for Tenant Form
import * as yup from "yup";

export const DefaultValues = {
  name: "",
  slug: "",
  status: "trial",
  subscription_status: "new",
  subscription_plan: "free",
  max_users: 10,
  settings: {},
};

// Validation schema
export const tenantSchema = yup.object().shape({
  name: yup.string().required("Organization name is required"),
  slug: yup
    .string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(
      ["trial", "active", "inactive", "suspended"],
      "Please select a valid status"
    ),
  subscription_status: yup
    .string()
    .required("Subscription status is required")
    .oneOf(
      ["new", "trial", "active", "expired", "cancelled"],
      "Please select a valid subscription status"
    ),
  subscription_plan: yup
    .string()
    .required("Subscription plan is required")
    .oneOf(
      ["free", "basic", "premium", "enterprise"],
      "Please select a valid subscription plan"
    ),
  max_users: yup
    .number()
    .required("Max users is required")
    .min(1, "Max users must be at least 1")
    .integer("Max users must be a whole number"),
  settings: yup.object().default({}),
});
