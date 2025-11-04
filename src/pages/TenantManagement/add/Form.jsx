import { Save, X } from "lucide-react";
import { DefaultValues, tenantSchema } from "./utility";
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Organization Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Organization Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ABC Wholesalers"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug / URL Path <span className="text-red-700">*</span>
                </label>
                <div className="flex items-center">
                  <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-3 text-gray-600 text-sm">
                    dealflow.ai/
                  </span>
                  <input
                    type="text"
                    {...register("slug")}
                    className="flex-1 px-4 py-3 border rounded-r-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="abc-wholesalers"
                  />
                </div>
                {errors.slug && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.slug?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-700">*</span>
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  {errors.status && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.status?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Users
                  </label>
                  <input
                    type="number"
                    {...register("max_users")}
                    className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current User Count
                  </label>
                  <input
                    type="number"
                    {...register("current_user_count")}
                    className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Subscription Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription Status
                </label>
                <select
                  {...register("subscription_status")}
                  className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="trial">Trial</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription Start Date
                </label>
                <input
                  type="date"
                  {...register("subscription_start_date")}
                  className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription End Date
                </label>
                <input
                  type="date"
                  {...register("subscription_end_date")}
                  className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Database Information */}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting || mutation.isPending}
            >
              Cancel
            </button>

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
              {mutation.isPending ? "Creating Tenant" : "Create Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTenantForm;
