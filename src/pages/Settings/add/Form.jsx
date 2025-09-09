import { Save } from "lucide-react";
import { Text } from "@radix-ui/themes";
import {
  countries,
  industries,
  organizationSizes,
  settingsSchema,
} from "./utility";
import { OrganizationAPI } from "../../../services/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import ButtonLoader from "../../../components/UI/ButtonLoader";

const CreateOrganizationForm = ({ orgState }) => {
  const dispatch = useDispatch();
  console.log("orgState", orgState);

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
    resolver: yupResolver(settingsSchema),
    defaultValues: orgState,
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await OrganizationAPI.UpdateOrganization(data.id, data);
      return res;
    },
    onSuccess: (data) => {
      if (data.data.status == "success") {
        // Fixed: Make sure toast is imported or available
        toast.success(data.data.message);
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
    const formattedRequest = {
      id: data.id,
      name: data.name,
      industry: data.industry,
      organization_size: data.organization_size,
      business_email: data.business_email,
      business_phone: data.business_phone,
      website: data.website,
      support_email: data.support_email,
      street_address: data.street_address,
      city: data.city,
      state_province: data.state_province,
      zip_postal_code: data.zip_postal_code,
      country: data.country,
      timezone: data.timezone,
      language: data.language,
    };

    console.log("formattedRequest", formattedRequest);

    mutation.mutate(formattedRequest);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Organization Details
                </h2>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name<Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name<Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
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
                        type="text"
                        {...register("website")}
                        className="flex-1 px-4 py-3 border rounded-r-lg text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="abc-wholesalers"
                      />
                    </div>
                    {errors.website && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.website?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry <Text className="text-red-700">*</Text>
                    </label>
                    <select
                      {...register("industry")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    >
                      <option value="">Choose a industry...</option>
                      {industries.map((item) => (
                        <option value={item.value}>{item.label}</option>
                      ))}
                    </select>
                    {/* <input
                      {...register("industry")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.industry ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your industry number"
                    /> */}
                    {errors.industry && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.industry.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      organization size<Text className="text-red-700">*</Text>
                    </label>
                    <select
                      {...register("organization_size")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    >
                      <option value="">Choose a organization size...</option>
                      {organizationSizes.map((item) => (
                        <option value={item.value}>{item.label}</option>
                      ))}
                    </select>
                    {/* <input
                      {...register("organization_size")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.organization_size
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your first name"
                    /> */}
                    {errors.organization_size && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.organization_size.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Information Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Email <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("business_email")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.business_email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter property address"
                    />
                    {errors.business_email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.business_email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Phone <Text className="text-red-700">*</Text>
                      </label>
                      <input
                        {...register("business_phone")}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                          errors.business_phone
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.business_phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.business_phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Support Email <Text className="text-red-700">*</Text>
                      </label>
                      <input
                        {...register("support_email")}
                        type="text"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                          errors.support_email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.support_email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.support_email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Information Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      {...register("street_address")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.street_address
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.street_address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.street_address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      city
                    </label>
                    <input
                      {...register("city")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="$0"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State Province
                    </label>
                    <input
                      {...register("state_province")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.state_province
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.state_province && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state_province.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Postal Code
                    </label>
                    <input
                      {...register("zip_postal_code")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.zip_postal_code
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.zip_postal_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zip_postal_code.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      {...register("country")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black border-gray-300"
                    >
                      <option value="">Choose a organization size...</option>
                      {countries.map((item) => (
                        <option value={item.value}>{item.label}</option>
                      ))}
                    </select>
                    {/* <input
                      {...register("country")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.country ? "border-red-500" : "border-gray-300"
                      }`}
                    /> */}
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* subscription plan */}

              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Additional Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <input
                      {...register("timezone")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.timezone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.timezone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.timezone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <input
                      {...register("language")}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.language ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.language && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.language.message}
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
                  {mutation.isPending ? "Submitting..." : "Submit Organization"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateOrganizationForm;
