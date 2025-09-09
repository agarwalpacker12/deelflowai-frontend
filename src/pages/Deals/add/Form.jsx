import React, { useState, useEffect } from "react";
import { dealsAPI, propertiesAPI, leadsAPI } from "../../../services/api";
import { useDispatch, useSelector } from "react-redux";

import {
  setDeals,
  setLoading,
  setError,
} from "../../../store/slices/dealsSlice";

// Import utilities
import { DefaultValues, dealTypeList, validateField } from "./utility";
import { useNavigate } from "react-router-dom";

const AddDealsForm = ({ propertyId, propertyDetails }) => {
  // Redux hooks
  const dispatch = useDispatch();
  const { deals } = useSelector((state) => state.deals);
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState(DefaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState(null);

  useEffect(() => {
    // Replace with your actual API call
    propertiesAPI
      .getProperties()
      .then((response) => {
        setProperties(response.data.data); // Adjust based on your API response shape
        setPropertiesLoading(false);
      })
      .catch(() => {
        setPropertiesError("Failed to load properties");
        setPropertiesLoading(false);
      });
  }, []);

  useEffect(() => {
    leadsAPI
      .getLeads()
      .then((response) => {
        // console.log("response.data.data", response.data.data);
        setLeads(response.data.data.data); // Adjust if your API response shape is different
        setLeadsLoading(false);
      })
      .catch(() => {
        setLeadsError("Failed to load leads");
        setLeadsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (propertyDetails && propertyDetails.user_id) {
      setFormData((prev) => ({
        ...prev,
        seller_id: propertyDetails.user_id,
        buyer_id: userDetails.id,
      }));
    }
  }, [propertyDetails]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
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

    if (!validateForm()) {
      return;
    }

    // Dispatch loading state
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      // Prepare data for API
      const apiData = {
        property_id: propertyId ? parseInt(propertyId) : null,
        lead_id: formData.lead_id ? parseInt(formData.lead_id) : null,
        buyer_id: formData.buyer_id ? parseInt(formData.buyer_id) : null,
        seller_id: formData.seller_id ? parseInt(formData.seller_id) : null,
        deal_type: formData.deal_type,
        purchase_price: formData.purchase_price
          ? parseFloat(formData.purchase_price)
          : null,
        sale_price: formData.sale_price
          ? parseFloat(formData.sale_price)
          : null,
        assignment_fee: formData.assignment_fee
          ? parseFloat(formData.assignment_fee)
          : null,
        contract_date: formData.contract_date,
        closing_date: formData.closing_date,
        inspection_period: formData.inspection_period
          ? parseInt(formData.inspection_period)
          : null,
        earnest_money: formData.earnest_money
          ? parseFloat(formData.earnest_money)
          : null,
        notes: formData.notes,
        contract_terms: {
          financing_contingency: !!formData.financing_contingency,
          inspection_contingency: !!formData.inspection_contingency,
          appraisal_contingency: !!formData.appraisal_contingency,
          title_contingency: !!formData.title_contingency,
        },
      };

      const response = await dealsAPI.createDeal(apiData);

      if (response.data.status === "success") {
        const newDeal = response.data.data;
        console.log("Deal created successfully:", newDeal);

        // Update Redux state with new deal
        dispatch(setDeals([...deals, newDeal]));

        setSubmitStatus("success");
        setSubmitMessage("Deal created successfully!");
        setFormData(DefaultValues);
        setErrors({});
        navigate("/app/profile?activeTab=deal-property");
      } else {
        throw new Error(response.data.message || "Failed to create deal");
      }
    } catch (error) {
      console.error("Error creating deal:", error);

      // Dispatch error to Redux
      dispatch(setError(error.response?.data?.message || error.message));

      // Handle validation errors from API
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
          `Error creating deal: ${
            error.response?.data?.message ||
            error.message ||
            "Please try again."
          }`
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
  console.log("formData", formData);

  return (
    <div className="space-y-6">
      {/* Deal Information Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Deal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property ID *
            </label>
            <select
              name="property_id"
              value={formData.property_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.property_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a property</option>
              {propertiesLoading && <option disabled>Loading...</option>}
              {propertiesError && <option disabled>{propertiesError}</option>}
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.property_type}
                </option>
              ))}
            </select>
            {errors.property_id && (
              <p className="text-red-500 text-sm mt-1">{errors.property_id}</p>
            )}
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead ID *
            </label>
            <select
              name="lead_id"
              value={formData.lead_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.lead_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a lead</option>
              {leadsLoading && <option disabled>Loading...</option>}
              {leadsError && <option disabled>{leadsError}</option>}
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.first_name}
                </option>
              ))}
            </select>
            {errors.lead_id && (
              <p className="text-red-500 text-sm mt-1">{errors.lead_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Type *
            </label>
            <select
              name="deal_type"
              value={formData.deal_type}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.deal_type ? "border-red-500" : "border-gray-300"
              }`}
            >
              {dealTypeList.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.deal_type && (
              <p className="text-red-500 text-sm mt-1">{errors.deal_type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buyer ID *
            </label>
            <input
              name="buyer_id"
              type="number"
              value={formData.buyer_id}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.buyer_id ? "border-red-500" : "border-gray-300"
              }`}
              disabled
            />
            {errors.buyer_id && (
              <p className="text-red-500 text-sm mt-1">{errors.buyer_id}</p>
            )}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seller ID *
            </label>
            <input
              name="seller_id"
              type="number"
              value={formData.seller_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.seller_id ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter seller ID"
            />
            {errors.seller_id && (
              <p className="text-red-500 text-sm mt-1">{errors.seller_id}</p>
            )}
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inspection Period (days)
            </label>
            <input
              name="inspection_period"
              type="number"
              value={formData.inspection_period}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.inspection_period ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter inspection period"
            />
            {errors.inspection_period && (
              <p className="text-red-500 text-sm mt-1">
                {errors.inspection_period}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Financial Details Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Financial Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price *
            </label>
            <input
              name="purchase_price"
              type="number"
              step="0.01"
              value={formData.purchase_price}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.purchase_price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter purchase price"
            />
            {errors.purchase_price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.purchase_price}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Price *
            </label>
            <input
              name="sale_price"
              type="number"
              step="0.01"
              value={formData.sale_price}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.sale_price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter sale price"
            />
            {errors.sale_price && (
              <p className="text-red-500 text-sm mt-1">{errors.sale_price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Fee
            </label>
            <input
              name="assignment_fee"
              type="number"
              step="0.01"
              value={formData.assignment_fee}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.assignment_fee ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter assignment fee"
            />
            {errors.assignment_fee && (
              <p className="text-red-500 text-sm mt-1">
                {errors.assignment_fee}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Earnest Money
            </label>
            <input
              name="earnest_money"
              type="number"
              step="0.01"
              value={formData.earnest_money}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.earnest_money ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter earnest money"
            />
            {errors.earnest_money && (
              <p className="text-red-500 text-sm mt-1">
                {errors.earnest_money}
              </p>
            )}
          </div>
        </div>

        {/* Financial Summary */}
        {formData.purchase_price && formData.sale_price && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Deal Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Purchase:</span>
                <p className="font-semibold text-blue-800">
                  ${parseFloat(formData.purchase_price || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Sale:</span>
                <p className="font-semibold text-green-800">
                  ${parseFloat(formData.sale_price || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Assignment Fee:</span>
                <p className="font-semibold text-purple-800">
                  ${parseFloat(formData.assignment_fee || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Profit:</span>
                <p className="font-semibold text-green-800">
                  $
                  {(
                    parseFloat(formData.sale_price || 0) -
                    parseFloat(formData.purchase_price || 0) +
                    parseFloat(formData.assignment_fee || 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contract Date *
            </label>
            <input
              name="contract_date"
              type="date"
              value={formData.contract_date}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.contract_date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.contract_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contract_date}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Closing Date *
            </label>
            <input
              name="closing_date"
              type="date"
              value={formData.closing_date}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                errors.closing_date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.closing_date && (
              <p className="text-red-500 text-sm mt-1">{errors.closing_date}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contract Terms Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Contract Terms
        </h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="financing_contingency"
              name="financing_contingency"
              checked={formData.financing_contingency}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="financing_contingency"
              className="text-sm font-medium text-gray-700"
            >
              Financing Contingency
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="inspection_contingency"
              name="inspection_contingency"
              checked={formData.inspection_contingency}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="inspection_contingency"
              className="text-sm font-medium text-gray-700"
            >
              Inspection Contingency
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="appraisal_contingency"
              name="appraisal_contingency"
              checked={formData.appraisal_contingency}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="appraisal_contingency"
              className="text-sm font-medium text-gray-700"
            >
              Appraisal Contingency
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="title_contingency"
              name="title_contingency"
              checked={formData.title_contingency}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="title_contingency"
              className="text-sm font-medium text-gray-700"
            >
              Title Contingency
            </label>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Additional Notes
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
            placeholder="Enter any additional notes about the deal..."
          />
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
          {isSubmitting ? "Submitting..." : "Submit Deal"}
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
  );
};

export default AddDealsForm;
