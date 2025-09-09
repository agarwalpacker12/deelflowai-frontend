// utility.js for Tenant Form
import * as yup from "yup";

export const DefaultValues = {
  organization_name: "",
  url_path: "",
  channel: "",
  admin_first_name: "",
  admin_last_name: "",
  admin_email: "",
  subscription_plan: "",
  send_welcome_email: true,
};

export const tenantSchema = yup.object().shape({
  organization_name: yup.string().required("Organization name is required"),
  url_path: yup.string().required("Url is required"),
  channel: yup.string().required("Channel is required"),
  admin_first_name: yup.string().required("First name is required"),
  admin_last_name: yup.string().required("Last name is required"),
  admin_email: yup
    .string()
    .required("Admin email is required")
    .typeError("Admin email must be a valid date"),
  subscription_plan: yup.string().optional(),
  send_welcome_email: yup.boolean().optional(),
});

// Subscription plans
export const subscriptionPlans = [
  { value: "starter", label: "Starter - $299/month" },
  { value: "professional", label: "Professional - $499/month" },
  { value: "enterprise", label: "Enterprise - $999/month" },
  { value: "custom", label: "Custom Plan" },
];

// Channels
export const channels = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "voice", label: "Voice" },
];
