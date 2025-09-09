import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { leadsAPI } from "../../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Text } from "@radix-ui/themes";
import ButtonLoader from "../../../components/UI/ButtonLoader";
import { Save } from "lucide-react";

import {
  setLeads,
  setLoading,
  setError,
} from "../../../store/slices/leadsSlice";

// Import utilities
import {
  leadSchema, // You'll need to create this schema
  DefaultValues,
  propertyTypeList,
  sourceList,
  contactMethodList,
  stateList,
  LeadTypeList,
  statusList,
} from "./utilities";

import { useNavigate } from "react-router-dom";

const UpdateLeadForm = ({ leadRes }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get current leads from Redux store
  const leads = useSelector((state) => state.leads.leads || []);

  // Prepare default values from lead data
  const getDefaultValues = (lead) => {
    if (!lead) return DefaultValues;

    return {
      first_name: lead.first_name || "",
      last_name: lead.last_name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      property_address: lead.property_address || "",
      property_city: lead.property_city || "",
      property_state: lead.property_state || "",
      property_zip: lead.property_zip || "",
      property_type: lead.property_type || "",
      status: lead.status || "",
      lead_type: lead.lead_type || "",
      estimated_value: lead.estimated_value || "",
      mortgage_balance: lead.mortgage_balance || "",
      asking_price: lead.asking_price || "",
      source: lead.source || "",
      preferred_contact_method: lead.preferred_contact_method || "",
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(leadSchema),
    defaultValues: getDefaultValues(leadRes),
  });

  // Reset form when lead data changes
  useEffect(() => {
    if (leadRes) {
      reset(getDefaultValues(leadRes));
    }
  }, [leadRes, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Prepare data for API
      // const apiData = {
      //   ...data,
      //   estimated_value: data.estimated_value
      //     ? parseFloat(data.estimated_value)
      //     : null,
      //   mortgage_balance: data.mortgage_balance
      //     ? parseFloat(data.mortgage_balance)
      //     : null,
      //   asking_price: data.asking_price ? parseFloat(data.asking_price) : null,
      // };

      const res = await leadsAPI.updateLead(leadRes.id, data);
      return res;
    },
    onSuccess: (data) => {
      if (data.data.status === "success") {
        toast.success(data.data.message || "Lead updated successfully!");
        // console.log("Lead updated successfully:", data);

        // Update the lead in the Redux store
        const updatedLeads = leads.map((lead) =>
          lead.id === leadRes.id ? data.data.data : lead
        );
        dispatch(setLeads(updatedLeads));

        // Navigate to leads page
        navigate("/app/leads");
      } else {
        throw new Error(data.data.message || "Failed to update lead");
      }
    },
    onError: (error) => {
      console.error("Error updating lead:", error);

      // Dispatch error to Redux
      dispatch(setError(error.response?.data?.message || error.message));

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while updating the lead"
      );
    },
  });

  const onSubmit = (data) => {
    // Dispatch loading state
    dispatch(setLoading(true));
    dispatch(setError(null));

    mutation.mutate(data);
  };

  // Clear loading state when mutation settles
  useEffect(() => {
    if (!mutation.isPending) {
      dispatch(setLoading(false));
    }
  }, [mutation.isPending, dispatch]);

  // Show loading if no lead data
  if (!leadRes) {
    return <div>Loading lead data...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("first_name")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.first_name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("last_name")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.last_name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Information Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Property Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Address <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("property_address")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.property_address
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter property address"
                    />
                    {errors.property_address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.property_address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <Text className="text-red-700">*</Text>
                      </label>
                      <input
                        {...register("property_city")}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                          errors.property_city
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter city"
                      />
                      {errors.property_city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.property_city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <Text className="text-red-700">*</Text>
                      </label>
                      <select
                        {...register("property_state")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                          errors.property_state
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        {stateList.map((state) => (
                          <option key={state.value} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </select>
                      {errors.property_state && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.property_state.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code <Text className="text-red-700">*</Text>
                      </label>
                      <input
                        {...register("property_zip")}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                          errors.property_zip
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter ZIP code"
                      />
                      {errors.property_zip && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.property_zip.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type <Text className="text-red-700">*</Text>
                      </label>
                      <select
                        {...register("property_type")}
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
                          {errors.property_type.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        {...register("status")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                          errors.status ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        {statusList.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.status && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.status.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lead Type <Text className="text-red-700">*</Text>
                      </label>
                      <select
                        {...register("lead_type")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                          errors.lead_type
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        {LeadTypeList.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.lead_type && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lead_type.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Information Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Financial Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Value
                    </label>
                    <input
                      {...register("estimated_value")}
                      type="number"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.estimated_value
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="$0"
                    />
                    {errors.estimated_value && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.estimated_value.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mortgage Balance
                    </label>
                    <input
                      {...register("mortgage_balance")}
                      type="number"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.mortgage_balance
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="$0"
                    />
                    {errors.mortgage_balance && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mortgage_balance.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asking Price
                    </label>
                    <input
                      {...register("asking_price")}
                      type="number"
                      step="0.01"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.asking_price
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="$0"
                    />
                    {errors.asking_price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.asking_price.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Additional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lead Source <Text className="text-red-700">*</Text>
                    </label>
                    <select
                      {...register("source")}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.source ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      {sourceList.map((source) => (
                        <option key={source.value} value={source.value}>
                          {source.label}
                        </option>
                      ))}
                    </select>
                    {errors.source && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.source.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Contact Method{" "}
                      <Text className="text-red-700">*</Text>
                    </label>
                    <select
                      {...register("preferred_contact_method")}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.preferred_contact_method
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      {contactMethodList.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                    {errors.preferred_contact_method && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.preferred_contact_method.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className={`flex px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-opacity ${
                    mutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:brightness-110"
                  }`}
                >
                  {mutation.isPending ? (
                    <ButtonLoader className="mr-2" />
                  ) : (
                    <Save className="mr-2" />
                  )}
                  {mutation.isPending ? "Updating Lead..." : "Update Lead"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UpdateLeadForm;
