// utility.js for Tenant Form
import * as yup from "yup";

export const DefaultValues = {
  id: null,
  uuid: "",
  name: "",
  slug: "",
  subscription_status: "",
  current_user_count: 0,
  max_users: 0,
  status: "",
  subscription_end_date: "",
  subscription_plan: "",
  subscription_start_date: "",
};

// Validation schema
export const tenantSchema = yup.object().shape({
  name: yup.string().required("Organization name is required"),
  slug: yup.string().required("Slug is required"),
  subscription_status: yup.string().required("Subscription status is required"),
  status: yup.string().required("Status is required"),
  subscription_plan: yup.string().optional(),
  subscription_start_date: yup.date().nullable(),
  subscription_end_date: yup.date().nullable(),
  max_users: yup.number().required("Max users is required"),
});
