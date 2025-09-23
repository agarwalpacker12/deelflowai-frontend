import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  campaignSchema,
  campaignTypes,
  channels,
  DefaultValues,
  propertyTypes,
} from "./utility";
import { useMutation } from "@tanstack/react-query";
import { campaignsAPI } from "../../../services/api";
import toast from "react-hot-toast";
import { Text } from "@radix-ui/themes";
import ButtonLoader from "../../../components/UI/ButtonLoader";
import { Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCampaigns } from "../../../store/slices/campaignsSlice";
import { useState } from "react";

const CreateCampaignForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const campaigns = useSelector((state) => state.campaigns.campaigns || []);

  // Local state for counties UI
  const [selectedScopeType, setSelectedScopeType] = useState("counties");
  const [selectedCounties, setSelectedCounties] = useState([
    { id: 1, name: "Miami-Dade" },
    { id: 2, name: "Broward" },
    { id: 3, name: "Palm Beach" },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(campaignSchema),
    defaultValues: DefaultValues,
  });

  const mutation = useMutation({
    mutationFn: async (data) => campaignsAPI.createCampaign(data),
    onSuccess: (data) => {
      if (data.data.status === "success") {
        toast.success(data.data.message);
        dispatch(setCampaigns([...campaigns, data.data.data]));
        navigate("/app/campaigns");
      }
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "An error occurred"),
  });

  const onSubmit = (data) => {
    // merge geographic scope values for backend
    const formData = {
      ...data,
      geographic_scope: {
        type: selectedScopeType,
        counties: selectedCounties.map((c) => c.name),
      },
    };
    mutation.mutate(formData);
  };

  const handleScopeTypeChange = (type) => setSelectedScopeType(type);
  const removeCounty = (id) =>
    setSelectedCounties((prev) => prev.filter((c) => c.id !== id));
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="space-y-8">
              {/* ===== Campaign Info ===== */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Campaign Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Name <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("name")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                      placeholder="e.g., Austin Distressed Properties Q3"
                    />
                    <p className="text-sm text-red-500">
                      {errors.name?.message}
                    </p>
                  </div>

                  {/* type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Type <Text className="text-red-700">*</Text>
                    </label>
                    <select
                      {...register("campaign_type")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                    >
                      <option value="">Select</option>
                      {campaignTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-red-500">
                      {errors.campaign_type?.message}
                    </p>
                  </div>

                  {/* channel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Channel <Text className="text-red-700">*</Text>
                    </label>
                    <select
                      {...register("channel")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                    >
                      {channels.map((ch) => (
                        <option key={ch.value} value={ch.value}>
                          {ch.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-red-500">
                      {errors.channel?.message}
                    </p>
                  </div>

                  {/* budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("budget")}
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                    />
                    <p className="text-sm text-red-500">
                      {errors.budget?.message}
                    </p>
                  </div>

                  {/* scheduled_at */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scheduled Date & Time{" "}
                      <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("scheduled_at")}
                      type="datetime-local"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                    />
                    <p className="text-sm text-red-500">
                      {errors.scheduled_at?.message}
                    </p>
                  </div>

                  {/* ✅ status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status <Text className="text-red-700">*</Text>
                    </label>
                    <select
                      {...register("status")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                    <p className="text-sm text-red-500">
                      {errors.status?.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* ===== Geographic Scope ===== */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Geographic Scope
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* scope type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scope Type <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("geographic_scope_type")}
                      placeholder="zip / city / county"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                    />
                    <p className="text-sm text-red-500">
                      {errors.geographic_scope_type?.message}
                    </p>
                  </div>

                  {/* scope values */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scope Values (comma separated){" "}
                      <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("geographic_scope_values")}
                      placeholder="33101,33102,33103"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                    />
                    <p className="text-sm text-red-500">
                      {errors.geographic_scope_values?.message}
                    </p>
                  </div>
                </div>

                {/* your existing counties UI stays below if you still want it */}
                {/* ...existing county chips... */}
              </div>

              {/* ===== Property Filters ===== */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Property Filters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("location")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                      placeholder="Miami"
                    />
                    <p className="text-sm text-red-500">
                      {errors.location?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("property_type")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                      placeholder="Residential"
                    />
                    <p className="text-sm text-red-500">
                      {errors.property_type?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Equity <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("minimum_equity")}
                      type="number"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                      placeholder="100000"
                    />
                    <p className="text-sm text-red-500">
                      {errors.minimum_equity?.message}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Price
                    </label>
                    <input
                      {...register("min_price")}
                      type="number"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                      placeholder="250000"
                    />
                    <p className="text-sm text-red-500">
                      {errors.min_price?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price
                    </label>
                    <input
                      {...register("max_price")}
                      type="number"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                      placeholder="750000"
                    />
                    <p className="text-sm text-red-500">
                      {errors.max_price?.message}
                    </p>
                  </div>
                </div>

                {/* Distress indicators (multi-select via checkboxes) */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Distress Indicators
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["Pre-foreclosure", "Tax Liens", "Divorce", "Vacant"].map(
                      (d) => (
                        <label key={d} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={d}
                            {...register("distress_indicators")}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{d}</span>
                        </label>
                      )
                    )}
                  </div>
                  <p className="text-sm text-red-500">
                    {errors.distress_indicators?.message}
                  </p>
                </div>
              </div>

              {/* ===== Email Content & AI ===== */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Email Content
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Line <Text className="text-red-700">*</Text>
                    </label>
                    <input
                      {...register("subject_line")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                    />
                    <p className="text-sm text-red-500">
                      {errors.subject_line?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Content <Text className="text-red-700">*</Text>
                    </label>
                    <textarea
                      {...register("email_content")}
                      rows={6}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                    />
                    <p className="text-sm text-red-500">
                      {errors.email_content?.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Personalization */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  AI Features
                </h2>
                <label className="flex items-center space-x-3">
                  <input
                    {...register("use_ai_personalization")}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Use AI Personalization
                  </span>
                </label>
              </div>

              {/* Submit */}
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
                  {mutation.isPending ? "Creating Campaign" : "Create Campaign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateCampaignForm;
