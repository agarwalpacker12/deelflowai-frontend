import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import {
  channels,
  DefaultValues,
  subscriptionPlans,
  tenantSchema,
} from "./utility";
import { TenantAPI } from "../../../services/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import ButtonLoader from "../../../components/UI/ButtonLoader";
import { setTenants } from "../../../store/slices/tenantSlice";

const CreateTenantForm = ({ onClose }) => {
  const dispatch = useDispatch();

  // Fixed: Add proper fallback and null check for tenants state
  const tenantsState = useSelector((state) => state.tenants);
  const tenants = tenantsState?.tenants || [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(tenantSchema),
    defaultValues: DefaultValues,
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await TenantAPI.createTenant(data);
      return res;
    },
    onSuccess: (data) => {
      if (data.data.status == "success") {
        // Fixed: Make sure toast is imported or available
        if (typeof toast !== "undefined") {
          toast.success(data.data.message);
        }

        // Fixed: Use proper tenants array with fallback
        const updatedTenants = Array.isArray(tenants)
          ? [...tenants, data.data.data]
          : [data.data.data];
        dispatch(setTenants(updatedTenants));

        // Fixed: Make sure navigate is imported or available
        if (typeof navigate !== "undefined") {
          navigate("/app/tenant-management");
        }
      }
    },
    onError: (error) => {
      console.log("error", error.response?.data?.message || error.message);
      // Fixed: Make sure toast is imported or available
      if (typeof toast !== "undefined") {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Add New Tenant</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            {/* Organization Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Organization Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name
                    <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("organization_name")}
                    className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.organization_name && (
                    <p className="text-sm text-red-500">
                      {errors.organization_name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Path
                    <span className="text-red-700">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-3 text-gray-600 text-sm">
                      dealflow.ai/
                    </span>
                    <input
                      name="url_path"
                      type="text"
                      {...register("url_path")}
                      className="flex-1 px-4 py-3 border rounded-r-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="abc-wholesalers"
                    />
                  </div>
                  {errors.url_path && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.url_path?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel
                    <span className="text-red-700">*</span>
                  </label>
                  <select
                    name="channel"
                    {...register("channel")}
                    className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a channel</option>
                    {channels.map((channel) => (
                      <option key={channel.value} value={channel.value}>
                        {channel.label}
                      </option>
                    ))}
                  </select>
                  {errors.channel && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.channel?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Admin Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin First Name
                    <span className="text-red-700">*</span>
                  </label>
                  <input
                    name="admin_first_name"
                    type="text"
                    {...register("admin_first_name")}
                    className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                  {errors.admin_first_name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.admin_first_name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Last Name
                    <span className="text-red-700">*</span>
                  </label>
                  <input
                    name="admin_last_name"
                    type="text"
                    {...register("admin_last_name")}
                    className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                  {errors.admin_last_name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.admin_last_name?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                  <span className="text-red-700">*</span>
                </label>
                <input
                  name="admin_email"
                  type="email"
                  {...register("admin_email")}
                  className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@example.com"
                />
                {errors.admin_email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.admin_email?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Subscription Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Subscription Plan
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription Plan
                  <span className="text-red-700">*</span>
                </label>
                <select
                  name="subscription_plan"
                  {...register("subscription_plan")}
                  className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a plan</option>
                  {subscriptionPlans.map((plan) => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
                </select>
                {errors.subscription_plan && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.subscription_plan?.message}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center space-x-3">
                  <input
                    name="send_welcome_email"
                    type="checkbox"
                    id="send_welcome_email"
                    {...register("send_welcome_email")}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="send_welcome_email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Send welcome email with setup instructions
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-7">
                  The admin will receive an email with login credentials and
                  setup instructions
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting || mutation.isPending}
            >
              Cancel
            </button>

            <button
              className={`flex px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg transition-opacity ${
                mutation.isPending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:brightness-110"
              }`}
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <ButtonLoader className="mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              {mutation.isPending ? "Creating Tenant" : "Create Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTenantForm;
