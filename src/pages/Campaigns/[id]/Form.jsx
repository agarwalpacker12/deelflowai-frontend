import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  campaignSchema,
  campaignTypes,
  channels,
  DefaultValues,
  propertyTypes,
} from "./utilities"; // make sure to import this
import { useMutation } from "@tanstack/react-query";
import { campaignsAPI } from "../../../services/api";
import toast from "react-hot-toast";
import { Text } from "@radix-ui/themes";
import ButtonLoader from "../../../components/UI/ButtonLoader";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setCampaigns } from "../../../store/slices/campaignsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// Status options for the dropdown
const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const UpdateCampaignForm = ({ campaignRes }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get current campaigns from Redux store
  const campaigns = useSelector((state) => state.campaigns.campaigns || []);

  // Helper function to format datetime for datetime-local input
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Prepare default values from campaign data
  const getDefaultValues = (campaign) => {
    if (!campaign) return DefaultValues;

    return {
      name: campaign.name || "",
      campaign_type: campaign.campaign_type || "",
      channel: campaign.channel || "",
      budget: campaign.budget || "",
      scheduled_at: formatDateTimeLocal(campaign.scheduled_at),
      status: campaign.status || "draft", // Add status field
      target_criteria: {
        location: campaign.target_criteria?.location || "",
        property_type: campaign.target_criteria?.property_type || "",
        equity_min: campaign.target_criteria?.equity_min || "",
      },
      subject_line: campaign.subject_line || "",
      email_content: campaign.email_content || "", // This field seems missing from API
      use_ai_personalization: campaign.use_ai_personalization || false,
    };
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(campaignSchema),
    defaultValues: getDefaultValues(campaignRes),
  });

  // Reset form when campaign data changes
  useEffect(() => {
    if (campaignRes) {
      reset(getDefaultValues(campaignRes));
    }
  }, [campaignRes, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Use updateCampaign instead of createCampaign
      const res = await campaignsAPI.updateCampaign(campaignRes.id, data);
      return res;
    },
    onSuccess: (data) => {
      if (data.data.status == "success") {
        toast.success(data.data.message);
        console.log("response_Data", data);

        // Update the campaign in the Redux store
        const updatedCampaigns = campaigns.map((campaign) =>
          campaign.id === campaignRes.id ? data.data.data : campaign
        );
        dispatch(setCampaigns(updatedCampaigns));

        // Navigate to campaigns page
        navigate("/app/campaigns");
      }
    },
    onError: (error) => {
      console.log("error", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  // Show loading if no campaign data
  if (!campaignRes) {
    return <div>Loading campaign data...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Keep your exact layout */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="space-y-8">
              {/* Campaign Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Campaign Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Name
                      <Text className="text-red-700">* </Text>
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                      placeholder="e.g., Austin Distressed Properties Q3"
                    />
                    <p className="text-sm text-red-500">
                      {errors.name?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Type <Text className="text-red-700">* </Text>
                    </label>
                    <select
                      {...register("campaign_type")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 bg-gray-100 cursor-not-allowed"
                      disabled
                    >
                      <option value="">Select</option>
                      {campaignTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-red-500">
                      {errors.campaign_type?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Channel <Text className="text-red-700">* </Text>
                    </label>
                    <select
                      {...register("channel")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 bg-gray-100 cursor-not-allowed"
                      disabled
                    >
                      {channels.map((channel) => (
                        <option key={channel.value} value={channel.value}>
                          {channel.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-red-500">
                      {errors.channel?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget <Text className="text-red-700">* </Text>
                    </label>
                    <input
                      {...register("budget")}
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                      placeholder="1000.00"
                    />
                    <p className="text-sm text-red-500">
                      {errors.budget?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scheduled Date & Time{" "}
                      <Text className="text-red-700">* </Text>
                    </label>
                    <input
                      {...register("scheduled_at")}
                      type="datetime-local"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-sm text-red-500">
                      {errors.scheduled_at?.message}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Status <Text className="text-red-700">* </Text>
                    </label>
                    <select
                      {...register("status")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-red-500">
                      {errors.status?.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Criteria */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Target Criteria
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <Text className="text-red-700">* </Text>
                    </label>
                    <input
                      {...register("target_criteria.location")}
                      type="text"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 bg-gray-100 cursor-not-allowed"
                      placeholder="e.g., Austin, TX"
                      readOnly
                    />
                    <p className="text-sm text-red-500">
                      {errors.target_criteria?.location?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type <Text className="text-red-700">* </Text>
                    </label>
                    <select
                      {...register("target_criteria.property_type")}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 bg-gray-100 cursor-not-allowed"
                      disabled
                    >
                      <option value="">Select</option>
                      {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-red-500">
                      {errors.target_criteria?.property_type?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Equity <Text className="text-red-700">* </Text>
                    </label>
                    <input
                      {...register("target_criteria.equity_min")}
                      type="number"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 bg-gray-100 cursor-not-allowed"
                      placeholder="50000"
                      readOnly
                    />
                    <p className="text-sm text-red-500">
                      {errors.target_criteria?.equity_min?.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Content */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Email Content
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Line <Text className="text-red-700">* </Text>
                    </label>
                    <input
                      {...register("subject_line")}
                      type="text"
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 bg-gray-100 cursor-not-allowed"
                      placeholder="We Buy Houses Fast - Cash Offer in 24 Hours"
                      readOnly
                    />
                    <p className="text-sm text-red-500">
                      {errors.subject_line?.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Content <Text className="text-red-700">* </Text>
                    </label>
                    <textarea
                      {...register("email_content")}
                      rows={6}
                      className="w-full px-4 py-3 border rounded-lg text-black border-gray-300 bg-gray-100 cursor-not-allowed"
                      placeholder="Hello [FIRST_NAME], we specialize in buying houses..."
                      readOnly
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
                <div className="flex items-center space-x-3">
                  <input
                    {...register("use_ai_personalization")}
                    type="checkbox"
                    id="use_ai_personalization"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed"
                    disabled
                  />
                  <label
                    htmlFor="use_ai_personalization"
                    className="text-sm font-medium text-gray-500"
                  >
                    Use AI Personalization
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Enable AI-powered personalization to automatically customize
                  messages based on recipient data
                </p>
              </div>

              {/* Submit */}
              <div className="flex justify-center pt-6">
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
                  {mutation.isPending ? "Updating Campaign" : "Update Campaign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UpdateCampaignForm;
