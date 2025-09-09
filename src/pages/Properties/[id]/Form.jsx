import React, { useState } from "react";
import { propertiesAPI } from "../../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setProperties,
  setLoading,
  setError,
} from "../../../store/slices/propertiesSlice";

// Import utilities
import {
  DefaultValues,
  propertyTypeList,
  transactionTypeList,
  stateList,
  validateField,
} from "./utility";

// Mapping function: backend property object -> form fields
function mapPropertyToFormFields(property) {
  if (!property) return { ...DefaultValues };
  return {
    street_address: property.address || "",
    unit_apt: property.unit || "",
    city: property.city || "",
    state: property.state || "",
    zip_code: property.zip || "",
    county: property.county || "",
    property_type: property.property_type || "",
    bedrooms: property.bedrooms ?? "",
    bathrooms: property.bathrooms ?? "",
    square_feet: property.square_feet ?? "",
    lot_size: property.lot_size ?? "",
    year_built: property.year_built ?? "",
    purchase_price: property.purchase_price ?? "",
    arv: property.arv ?? "",
    repair_estimate: property.repair_estimate ?? "",
    holding_costs: property.holding_costs ?? "",
    transaction_type: property.transaction_type || "",
    assignment_fee: property.assignment_fee ?? "",
    property_description: property.description || "",
    seller_notes: property.seller_notes || "",
  };
}

const EditPropertyForm = ({propertyRes}) => {
  // Redux hooks
  const dispatch = useDispatch();
  const { properties, loading } = useSelector((state) => state.properties);
  const navigate = useNavigate();

  // Use mapping function to initialize formData
  const [formData, setFormData] = useState(mapPropertyToFormFields(propertyRes));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    // Validate all required fields
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
      // Prepare data for API (only selected fields)
      const apiData = {
        address: formData.street_address, // backend expects 'address'
        unit: formData.unit_apt || "",         // backend expects 'unit'
        city: formData.city,
        state: formData.state,
        zip: formData.zip_code,          // backend expects 'zip'
        county: formData.county,
        property_type: formData.property_type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        arv: formData.arv ? parseFloat(formData.arv) : null,
        repair_estimate: formData.repair_estimate ? parseFloat(formData.repair_estimate) : null,
        holding_costs: formData.holding_costs ? parseFloat(formData.holding_costs) : null,
        transaction_type: formData.transaction_type, // must be one of: assignment, double_close, wholesale, fix_and_flip, buy_and_hold
        assignment_fee: formData.assignment_fee ? parseFloat(formData.assignment_fee) : null,
        description: formData.property_description, // backend expects 'description'
        seller_notes: formData.seller_notes || "",
      };

      const response = await propertiesAPI.updateProperty(propertyRes?.id,  apiData);

      if (response.data.status === "success") {
        const newProperty = response.data.data;
        console.log("Property updated successfully:", newProperty);

        // Update Redux state with new property
        dispatch(setProperties([...properties, newProperty]));

        setSubmitStatus("success");
        setSubmitMessage("Property updated successfully!");
        setFormData(DefaultValues);
        setErrors({});
        navigate("/app/properties");
      } else {
        throw new Error(response.data.message || "Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);

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
          `Error updating property: ${
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

  // Calculate financial summary
  const purchasePrice = parseFloat(formData.purchase_price) || 0;
  const arv = parseFloat(formData.arv) || 0;
  const repairEstimate = parseFloat(formData.repair_estimate) || 0;
  const potentialProfit = arv - purchasePrice - repairEstimate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div>
            {/* Property Address Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Property Address
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      name="street_address"
                      value={formData.street_address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.street_address
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter street address"
                    />
                    {errors.street_address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.street_address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit/Apt (Optional)
                    </label>
                    <input
                      name="unit_apt"
                      value={formData.unit_apt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                      placeholder="Unit, Apt, Suite"
                    />

{errors.unit_apt && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.unit_apt}
                    </p>
                  )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      {stateList.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.zip_code ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="ZIP Code"
                    />
                    {errors.zip_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zip_code}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      County *
                    </label>
                    <input
                      name="county"
                      value={formData.county}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.county ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="County"
                    />
                    {errors.county && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.county}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Property Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.property_type
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {propertyTypeList.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.property_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.property_type}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms *
                  </label>
                  <input
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.bedrooms ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Number of bedrooms"
                  />
                  {errors.bedrooms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bedrooms}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms *
                  </label>
                  <input
                    name="bathrooms"
                    type="number"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.bathrooms ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Number of bathrooms"
                  />
                  {errors.bathrooms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bathrooms}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Square Feet *
                  </label>
                  <input
                    name="square_feet"
                    type="number"
                    value={formData.square_feet}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.square_feet ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Square feet"
                  />
                  {errors.square_feet && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.square_feet}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lot Size (acres) *
                  </label>
                  <input
                    name="lot_size"
                    type="number"
                    step="0.01"
                    value={formData.lot_size}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.lot_size ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Lot size in acres"
                  />
                  {errors.lot_size && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lot_size}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Built *
                  </label>
                  <input
                    name="year_built"
                    type="number"
                    value={formData.year_built}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.year_built ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Year built"
                  />
                  {errors.year_built && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.year_built}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Financial Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price *
                  </label>
                  <input
                    name="purchase_price"
                    type="number"
                    value={formData.purchase_price}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.purchase_price
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Purchase price"
                  />
                  {errors.purchase_price && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.purchase_price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ARV (After Repair Value) *
                  </label>
                  <input
                    name="arv"
                    type="number"
                    value={formData.arv}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.arv ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="After repair value"
                  />
                  {errors.arv && (
                    <p className="text-red-500 text-sm mt-1">{errors.arv}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Repair Estimate *
                  </label>
                  <input
                    name="repair_estimate"
                    type="number"
                    value={formData.repair_estimate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.repair_estimate
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Estimated repair costs"
                  />
                  {errors.repair_estimate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.repair_estimate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Holding Costs *
                  </label>
                  <input
                    name="holding_costs"
                    type="number"
                    value={formData.holding_costs}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.holding_costs
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Holding costs"
                  />
                  {errors.holding_costs && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.holding_costs}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Type *
                  </label>
                  <select
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.transaction_type
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {transactionTypeList.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.transaction_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.transaction_type}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Fee *
                  </label>
                  <input
                    name="assignment_fee"
                    type="number"
                    value={formData.assignment_fee}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.assignment_fee
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Assignment fee"
                  />
                  {errors.assignment_fee && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.assignment_fee}
                    </p>
                  )}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Financial Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Purchase:</span>
                    <p className="font-semibold text-blue-800">
                      $ {purchasePrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">ARV:</span>
                    <p className="font-semibold text-green-800">
                      $ {arv.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Repairs:</span>
                    <p className="font-semibold text-red-800">
                      $ {repairEstimate.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Potential Profit:</span>
                    <p className="font-semibold text-green-800">
                      $ {potentialProfit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Additional Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Description *
                  </label>
                  <textarea
                    name="property_description"
                    rows={4}
                    value={formData.property_description}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.property_description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Describe the property, its condition, potential, etc."
                  />
                  {errors.property_description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.property_description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seller Notes (Optional)
                  </label>
                  <textarea
                    name="seller_notes"
                    rows={3}
                    value={formData.seller_notes}
                    onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                         errors.property_description
                           ? "border-red-500"
                           : "border-gray-300"
                       }`}
                    placeholder="Any additional notes about the seller or property"
                  />
                  {errors.seller_notes && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.seller_notes}
                    </p>
                  )}
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
                {isSubmitting ? "Submitting..." : "Submit Property Lead"}
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
    </div>
  );
};

export default EditPropertyForm;
