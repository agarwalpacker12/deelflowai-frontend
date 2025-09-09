import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dealMilestonesAPI } from "../../../services/api";
import {
  setDeals,
  setLoading,
  setError,
} from "../../../store/slices/dealsSlice";

const milestoneTypes = [
  { value: "", label: "Select Milestone Type" },
  { value: "inspection", label: "Property Inspection" },
  { value: "appraisal", label: "Property Appraisal" },
  { value: "financing", label: "Financing Approval" },
  { value: "title_search", label: "Title Search" },
  { value: "contract_review", label: "Contract Review" },
  { value: "closing_preparation", label: "Closing Preparation" },
  { value: "final_walkthrough", label: "Final Walkthrough" },
  { value: "closing", label: "Closing" },
  { value: "assignment", label: "Assignment" },
  { value: "marketing", label: "Marketing" },
  { value: "buyer_approval", label: "Buyer Approval" },
  { value: "document_signing", label: "Document Signing" },
  { value: "other", label: "Other" },
];

// Mock deals data for the dropdown (replace with real API in production)
const availableDeals = [
  { id: 1, address: "123 Main St", deal_type: "assignment" },
  { id: 2, address: "456 Oak Ave", deal_type: "wholesale" },
  { id: 3, address: "789 Pine Rd", deal_type: "fix_and_flip" },
];

const DefaultValues = {
  deal_id: "",
  milestone_type: "",
  title: "",
  description: "",
  due_date: "",
  is_critical: false,
};

const validateField = (field, value) => {
  switch (field) {
    case "deal_id":
      return !value ? "Deal is required" : "";
    case "milestone_type":
      return !value ? "Milestone type is required" : "";
    case "title":
      return !value.trim() ? "Title is required" : "";
    case "due_date":
      return !value ? "Due date is required" : "";
    default:
      return "";
  }
};

const EditDealMilestoneForm = () => {
  const dispatch = useDispatch();
  const { deals, loading } = useSelector((state) => state.deals);

  const [formData, setFormData] = useState(DefaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setSubmitStatus(null);
    setSubmitMessage("");
    if (!validateForm()) return;
    dispatch(setLoading(true));
    dispatch(setError(null));
    setIsSubmitting(true);
    try {
      const apiData = {
        ...formData,
        deal_id: parseInt(formData.deal_id),
        is_critical: !!formData.is_critical,
      };
      const response = await dealMilestonesAPI.updateMilestone(apiData);
      if (
        response.data &&
        (response.data.status === "success" || response.status === 201)
      ) {
        setSubmitStatus("success");
        setSubmitMessage("Milestone updated successfully!");
        setFormData(DefaultValues);
        setErrors({});
        // Optionally update Redux deals state if needed
      } else {
        throw new Error(response.data?.message || "Failed to update milestone");
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
      if (error.response?.data?.errors) {
        const apiErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          apiErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(apiErrors);
        setSubmitStatus("error");
        setSubmitMessage("Please fix the validation errors above.");
      } else {
        setSubmitStatus("error");
        setSubmitMessage(
          `Error creating milestone: ${
            error.response?.data?.message ||
            error.message ||
            "Please try again."
          }`
        );
      }
    } finally {
      dispatch(setLoading(false));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="space-y-8">
          {/* Deal Selection Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Deal Selection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Deal *
                </label>
                <select
                  name="deal_id"
                  value={formData.deal_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                    errors.deal_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Choose a deal...</option>
                  {availableDeals.map((deal) => (
                    <option key={deal.id} value={deal.id}>
                      Deal #{deal.id} - {deal.address} ({deal.deal_type})
                    </option>
                  ))}
                </select>
                {errors.deal_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.deal_id}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or Enter Deal ID *
                </label>
                <input
                  name="deal_id"
                  type="number"
                  value={formData.deal_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                    errors.deal_id ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter deal ID"
                />
                {errors.deal_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.deal_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Milestone Information Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Milestone Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Milestone Type *
                </label>
                <select
                  name="milestone_type"
                  value={formData.milestone_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                    errors.milestone_type ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {milestoneTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.milestone_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.milestone_type}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                    errors.due_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.due_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter milestone title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                  placeholder="Enter detailed description of this milestone..."
                />
              </div>
            </div>
          </div>

          {/* Milestone Settings Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Milestone Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_critical"
                  name="is_critical"
                  checked={formData.is_critical}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="is_critical"
                  className="text-sm font-medium text-gray-700"
                >
                  Critical Milestone
                </label>
                <span className="text-xs text-gray-500 ml-2">
                  (This milestone is essential for deal completion)
                </span>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-500 text-xl">⚠️</div>
                  <div>
                    <h3 className="text-sm font-semibold text-yellow-800">
                      Critical Milestone Information
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Critical milestones are essential checkpoints that must be
                      completed for the deal to proceed successfully. These will
                      be highlighted in your dashboard and may trigger alerts if
                      approaching their due dates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-4 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Update Milestone"}
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-medium">✅ {submitMessage}</p>
            </div>
          )}
          {submitStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800 font-medium">❌ {submitMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditDealMilestoneForm;
