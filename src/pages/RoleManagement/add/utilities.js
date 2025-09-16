import * as yup from "yup";

// Default form values
export const DefaultValues = {
  name: "",
  label: "",
  permissions: [],
};

// Validation function
export const RoleSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  label: yup.string().required("Label is required"),
  permissions: yup.array().of(yup.string()),
});
