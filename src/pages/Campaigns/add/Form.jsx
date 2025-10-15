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
import {
  Save,
  X,
  MapPin,
  DollarSign,
  Calendar,
  Settings,
  Mail,
  Sparkles,
  Target,
  Filter,
  Users,
  Search,
  Home,
  User,
  Building,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCampaigns } from "../../../store/slices/campaignsSlice";
import { useCallback, useState } from "react";
import PriceRangeSlider from "../PriceRangeSlider";

const CreateCampaignForm = ({ fillMode }) => {
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
    setValue,
  } = useForm({
    resolver: yupResolver(campaignSchema),
    defaultValues: DefaultValues,
  });
  console.log("errors", errors);

  // Watch campaign type to show/hide relevant sections
  const campaignType = watch("campaign_type");

  // Add this state to your component
  const [priceRange, setPriceRange] = useState({
    min: watch("min_price") || 250000,
    max: watch("max_price") || 750000,
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
    const formData = {
      ...data,
      geographic_scope: {
        type: selectedScopeType,
        counties: selectedCounties.map((c) => c.name),
      },
    };
    mutation.mutate(formData);
  };

  const statusOptions = [
    { value: "active", label: "Active", color: "green" },
    { value: "inactive", label: "Inactive", color: "red" },
    { value: "draft", label: "Draft", color: "yellow" },
  ];

  // Enhanced campaign types including buyer and seller finder
  const enhancedCampaignTypes = [
    // ...campaignTypes,
    { value: "buyer_finder", label: "Buyer Finder" },
    { value: "seller_finder", label: "Seller Finder" },
  ];

  // Add this function to handle range changes
  const handlePriceRangeChange = useCallback(
    (minPrice, maxPrice) => {
      setPriceRange({ min: minPrice, max: maxPrice });
      // Update form values
      setValue("min_price", minPrice);
      setValue("max_price", maxPrice);
    },
    [setValue]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8 space-y-10">
              {/* ===== Campaign Info ===== */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl"></div>
                <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4 shadow-lg">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Campaign Information
                      </h2>
                      <p className="text-gray-600">
                        Basic details about your campaign
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Campaign Name */}
                    <div className="lg:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <Target className="w-4 h-4 mr-2 text-blue-600" />
                        Campaign Name{" "}
                        <Text className="text-red-500 ml-1">*</Text>
                      </label>
                      <input
                        {...register("name")}
                        className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
                        placeholder="e.g., Austin Distressed Properties Q3"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Campaign Type */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <Filter className="w-4 h-4 mr-2 text-blue-600" />
                        Campaign Type{" "}
                        <Text className="text-red-500 ml-1">*</Text>
                      </label>
                      {fillMode === "ai" ? (
                        <div className="space-y-3">
                          {enhancedCampaignTypes.map((t) => (
                            <label
                              key={t.value}
                              className="relative cursor-pointer group block"
                            >
                              <input
                                {...register("campaign_type")}
                                type="radio"
                                value={t.value}
                                className="sr-only peer"
                              />
                              <div className="flex items-center justify-between p-5 bg-white/80 border-2 border-gray-200 rounded-xl transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:bg-white peer-checked:border-blue-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-50 peer-checked:to-indigo-50 peer-checked:shadow-xl group-hover:scale-[1.02]">
                                <span className="font-medium text-gray-700 group-hover:text-blue-600 peer-checked:text-blue-700 transition-colors duration-200">
                                  {t.label}
                                </span>
                                {/* <div className="w-6 h-6 border-2 border-gray-300 rounded-full transition-all duration-200 peer-checked:border-blue-600 peer-checked:bg-blue-600 relative">
                                  <div className="absolute inset-1 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></div>
                                </div> */}
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <select
                          {...register("campaign_type")}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select Campaign Type</option>
                          {enhancedCampaignTypes.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {errors.campaign_type && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.campaign_type.message}
                        </p>
                      )}
                    </div>

                    {/* Channel */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <Mail className="w-4 h-4 mr-2 text-blue-600" />
                        Channel <Text className="text-red-500 ml-1">*</Text>
                      </label>
                      {fillMode === "ai" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {channels.map((ch) => (
                            <label
                              key={ch.value}
                              className="group cursor-pointer"
                            >
                              <div className="flex items-center p-5 bg-white/80 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-400 hover:shadow-md hover:bg-white">
                                <input
                                  type="checkbox"
                                  value={ch.value}
                                  {...register("channel")}
                                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                                  {ch.label}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <select
                          {...register("channel")}
                          multiple
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
                        >
                          {channels.map((ch) => (
                            <option key={ch.value} value={ch.value}>
                              {ch.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {errors.channel && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.channel.message}
                        </p>
                      )}
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        Budget <Text className="text-red-500 ml-1">*</Text>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register("budget")}
                          type="number"
                          step="0.01"
                          className="w-full pl-12 pr-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-green-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-green-100"
                          placeholder="10000.00"
                        />
                      </div>
                      {errors.budget && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.budget.message}
                        </p>
                      )}
                    </div>

                    {/* Scheduled Date */}
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                        Scheduled Date & Time{" "}
                        <Text className="text-red-500 ml-1">*</Text>
                      </label>
                      <input
                        {...register("scheduled_at")}
                        type="datetime-local"
                        className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-purple-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-purple-100"
                      />
                      {errors.scheduled_at && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.scheduled_at.message}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <Settings className="w-4 h-4 mr-2 text-blue-600" />
                        Status <Text className="text-red-500 ml-1">*</Text>
                      </label>
                      {fillMode === "ai" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {statusOptions.map((s) => (
                            <label
                              key={s.value}
                              className="relative cursor-pointer group"
                            >
                              <input
                                {...register("status")}
                                type="radio"
                                value={s.value}
                                className="sr-only peer"
                              />
                              <div
                                className={`flex items-center justify-center p-6 bg-white/80 border-2 border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:bg-white peer-checked:shadow-xl group-hover:scale-105 ${
                                  s.color === "green"
                                    ? "peer-checked:border-green-500 peer-checked:bg-gradient-to-r peer-checked:from-green-50 peer-checked:to-emerald-50"
                                    : s.color === "red"
                                    ? "peer-checked:border-red-500 peer-checked:bg-gradient-to-r peer-checked:from-red-50 peer-checked:to-rose-50"
                                    : "peer-checked:border-yellow-500 peer-checked:bg-gradient-to-r peer-checked:from-yellow-50 peer-checked:to-amber-50"
                                }`}
                              >
                                <div className="text-center">
                                  <div
                                    className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                                      s.color === "green"
                                        ? "bg-green-500"
                                        : s.color === "red"
                                        ? "bg-red-500"
                                        : "bg-yellow-500"
                                    }`}
                                  ></div>
                                  <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                    {s.label}
                                  </span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <select
                          {...register("status")}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                        </select>
                      )}
                      {errors.status && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Buyer Finder - Demographic Details ===== */}
              {campaignType === "buyer_finder" && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl"></div>
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl mr-4 shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Demographic Details
                        </h2>
                        <p className="text-gray-600">
                          Define your target buyer demographics
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Last Qualification */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <User className="w-4 h-4 mr-2 text-green-600" />
                          Last Qualification
                        </label>
                        <select
                          {...register("last_qualification")}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-green-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-green-100"
                        >
                          <option value="">Select Qualification</option>
                          <option value="pre_approved">Pre-approved</option>
                          <option value="pre_qualified">Pre-qualified</option>
                          <option value="cash_buyer">Cash Buyer</option>
                          <option value="first_time_buyer">
                            First Time Buyer
                          </option>
                          <option value="investor">Investor</option>
                        </select>
                      </div>

                      {/* Age Range */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <User className="w-4 h-4 mr-2 text-green-600" />
                          Age Range
                        </label>
                        <select
                          {...register("age_range")}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-green-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-green-100"
                        >
                          <option value="">Select Age Range</option>
                          <option value="18-25">18-25</option>
                          <option value="26-35">26-35</option>
                          <option value="36-45">36-45</option>
                          <option value="46-55">46-55</option>
                          <option value="56-65">56-65</option>
                          <option value="65+">65+</option>
                        </select>
                      </div>

                      {/* Ethnicity */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <Users className="w-4 h-4 mr-2 text-green-600" />
                          Ethnicity
                        </label>
                        <select
                          {...register("ethnicity")}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-green-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-green-100"
                        >
                          <option value="">Select Ethnicity</option>
                          <option value="any">Any</option>
                          <option value="caucasian">Caucasian</option>
                          <option value="african_american">
                            African American
                          </option>
                          <option value="hispanic">Hispanic</option>
                          <option value="asian">Asian</option>
                          <option value="native_american">
                            Native American
                          </option>
                          <option value="mixed">Mixed</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Income Range */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                          Income Range
                        </label>
                        <select
                          {...register("salary_range")}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-green-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-green-100"
                        >
                          <option value="">Select Income Range</option>
                          <option value="under_30k">Under $30,000</option>
                          <option value="30k_50k">$30,000 - $50,000</option>
                          <option value="50k_75k">$50,000 - $75,000</option>
                          <option value="75k_100k">$75,000 - $100,000</option>
                          <option value="100k_150k">$100,000 - $150,000</option>
                          <option value="150k_200k">$150,000 - $200,000</option>
                          <option value="200k_plus">$200,000+</option>
                        </select>
                      </div>

                      {/* Marital Status */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <Users className="w-4 h-4 mr-2 text-green-600" />
                          Marital Status
                        </label>
                        <select
                          {...register("marital_status")}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-green-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-green-100"
                        >
                          <option value="">Select Status</option>
                          <option value="married">Married</option>
                          <option value="single">Single</option>
                          <option value="divorced">Divorced</option>
                        </select>
                      </div>

                      {/* Employment Status */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <Building className="w-4 h-4 mr-2 text-green-600" />
                          Employment Status
                        </label>
                        <select
                          {...register("employment_status")}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-green-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-green-100"
                        >
                          <option value="">Select Employment</option>
                          <option value="employed">Employed</option>
                          <option value="self_employed">Self Employed</option>
                          <option value="retired">Retired</option>
                        </select>
                      </div>

                      {/* Home Ownership Status */}
                      <div className="lg:col-span-3">
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <Home className="w-4 h-4 mr-2 text-green-600" />
                          Home Ownership Status
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <label className="relative cursor-pointer group">
                            <input
                              {...register("home_ownership_status")}
                              type="radio"
                              value="own_home"
                              className="sr-only peer"
                            />
                            <div className="flex items-center justify-center p-6 bg-white/80 border-2 border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:bg-white peer-checked:border-green-500 peer-checked:bg-gradient-to-r peer-checked:from-green-50 peer-checked:to-emerald-50 peer-checked:shadow-xl group-hover:scale-105">
                              <div className="text-center">
                                <Home className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                  Own Home
                                </span>
                              </div>
                            </div>
                          </label>
                          <label className="relative cursor-pointer group">
                            <input
                              {...register("home_ownership_status")}
                              type="radio"
                              value="rent_home"
                              className="sr-only peer"
                            />
                            <div className="flex items-center justify-center p-6 bg-white/80 border-2 border-gray-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:bg-white peer-checked:border-green-500 peer-checked:bg-gradient-to-r peer-checked:from-green-50 peer-checked:to-emerald-50 peer-checked:shadow-xl group-hover:scale-105">
                              <div className="text-center">
                                <Building className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                  Rent Home
                                </span>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== Buyer Finder - Geographic Details ===== */}
              {campaignType === "buyer_finder" && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl"></div>
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl mr-4 shadow-lg">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Geographic Details
                        </h2>
                        <p className="text-gray-600">
                          Define target locations for buyers
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {/* Country */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <Globe className="w-4 h-4 mr-2 text-blue-600" />
                          Country
                        </label>
                        <select
                          {...register("buyer_country")}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
                        >
                          <option value="">Select Country</option>
                          <option value="us">United States</option>
                          <option value="ca">Canada</option>
                          <option value="mx">Mexico</option>
                        </select>
                      </div>

                      {/* State */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          State
                        </label>
                        <input
                          {...register("buyer_state")}
                          placeholder="e.g., Florida, Texas"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
                        />
                      </div>

                      {/* Counties */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          Counties
                        </label>
                        <input
                          {...register("buyer_counties")}
                          placeholder="e.g., Miami-Dade, Broward"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <Building className="w-4 h-4 mr-2 text-blue-600" />
                          City
                        </label>
                        <input
                          {...register("buyer_city")}
                          placeholder="e.g., Miami, Austin"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
                        />
                      </div>

                      {/* Districts */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          Districts
                        </label>
                        <input
                          {...register("buyer_districts")}
                          placeholder="e.g., Downtown, Midtown"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
                        />
                      </div>

                      {/* Parish */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          Parish
                        </label>
                        <input
                          {...register("buyer_parish")}
                          placeholder="e.g., Orleans Parish"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    {/* Map Integration Placeholder */}
                    <div className="bg-white/60 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Interactive Map Integration
                      </h3>
                      <p className="text-gray-500">
                        Map functionality can be integrated here for visual area
                        selection
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== Seller Finder - Additional Fields ===== */}
              {campaignType === "seller_finder" && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl"></div>
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl mr-4 shadow-lg">
                        <Search className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Seller Finder Criteria
                        </h2>
                        <p className="text-gray-600">
                          Define seller-specific targeting parameters
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Budget Range */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                          Seller Budget Range
                        </h3>
                        <PriceRangeSlider
                          minValue={priceRange.min}
                          maxValue={priceRange.max}
                          onRangeChange={handlePriceRangeChange}
                          min={50000}
                          max={5000000}
                          step={25000}
                        />
                      </div>

                      {/* Property Age */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Building className="w-4 h-4 mr-2 text-orange-600" />
                            Property Age (Year Built)
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <input
                                {...register("property_year_built_min")}
                                type="text"
                                placeholder="Min Year"
                                className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-orange-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-orange-100"
                              />
                            </div>
                            <div>
                              <input
                                {...register("property_year_built_max")}
                                type="text"
                                placeholder="Max Year"
                                className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-orange-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-orange-100"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Keywords */}
                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Search className="w-4 h-4 mr-2 text-orange-600" />
                            Keywords
                          </label>
                          <textarea
                            {...register("seller_keywords")}
                            rows={4}
                            placeholder="Enter keywords to target sellers (e.g., motivated seller, quick sale, distressed property, foreclosure, inheritance, divorce)"
                            className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-orange-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-orange-100 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== Geographic Details for Seller Finder ===== */}
              {campaignType === "seller_finder" && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl"></div>
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl mr-4 shadow-lg">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Geographic Details
                        </h2>
                        <p className="text-gray-600">
                          Define target locations for sellers
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {/* Country */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <Globe className="w-4 h-4 mr-2 text-emerald-600" />
                          Country
                        </label>
                        <select
                          {...register("seller_country")}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100"
                        >
                          <option value="">Select Country</option>
                          <option value="us">United States</option>
                          <option value="ca">Canada</option>
                          <option value="mx">Mexico</option>
                        </select>
                      </div>

                      {/* State */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                          State
                        </label>
                        <input
                          {...register("seller_state")}
                          placeholder="e.g., Florida, Texas"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100"
                        />
                      </div>

                      {/* Counties */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                          Counties
                        </label>
                        <input
                          {...register("seller_counties")}
                          placeholder="e.g., Miami-Dade, Broward"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <Building className="w-4 h-4 mr-2 text-emerald-600" />
                          City
                        </label>
                        <input
                          {...register("seller_city")}
                          placeholder="e.g., Miami, Austin"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100"
                        />
                      </div>

                      {/* Districts */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                          Districts
                        </label>
                        <input
                          {...register("seller_districts")}
                          placeholder="e.g., Downtown, Midtown"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100"
                        />
                      </div>

                      {/* Parish */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                          Parish
                        </label>
                        <input
                          {...register("seller_parish")}
                          placeholder="e.g., Orleans Parish"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100"
                        />
                      </div>
                    </div>

                    {/* Map Integration Placeholder */}
                    <div className="bg-white/60 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Interactive Map Integration
                      </h3>
                      <p className="text-gray-500">
                        Map functionality can be integrated here for visual area
                        selection
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== Geographic Scope (For other campaign types) ===== */}
              {campaignType !== "buyer_finder" &&
                campaignType !== "seller_finder" && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl"></div>
                    <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                      <div className="flex items-center mb-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl mr-4 shadow-lg">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            Geographic Scope
                          </h2>
                          <p className="text-gray-600">
                            Define your target locations
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                            Scope Type{" "}
                            <Text className="text-red-500 ml-1">*</Text>
                          </label>
                          <input
                            {...register("geographic_scope_type")}
                            placeholder="zip / city / county"
                            className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100"
                          />
                          {errors.geographic_scope_type && (
                            <p className="text-sm text-red-500 mt-2 flex items-center">
                              <X className="w-4 h-4 mr-1" />
                              {errors.geographic_scope_type.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                            <Target className="w-4 h-4 mr-2 text-emerald-600" />
                            Scope Values{" "}
                            <Text className="text-red-500 ml-1">*</Text>
                          </label>
                          <input
                            {...register("geographic_scope_values")}
                            placeholder="33101,33102,33103"
                            className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100"
                          />
                          {errors.geographic_scope_values && (
                            <p className="text-sm text-red-500 mt-2 flex items-center">
                              <X className="w-4 h-4 mr-1" />
                              {errors.geographic_scope_values.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* ===== Property Filters (For non-buyer campaigns) ===== */}
              {campaignType !== "buyer_finder" && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mr-4 shadow-lg">
                        <Filter className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Property Filters
                        </h2>
                        <p className="text-gray-600">
                          Set your property targeting criteria
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                          Location <Text className="text-red-500 ml-1">*</Text>
                        </label>
                        <input
                          {...register("location")}
                          placeholder="Miami"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-purple-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-purple-100"
                        />
                        {errors.location && (
                          <p className="text-sm text-red-500 mt-2 flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {errors.location.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <Settings className="w-4 h-4 mr-2 text-purple-600" />
                          Property Type{" "}
                          <Text className="text-red-500 ml-1">*</Text>
                        </label>
                        <input
                          {...register("property_type")}
                          placeholder="Residential"
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-purple-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-purple-100"
                        />
                        {errors.property_type && (
                          <p className="text-sm text-red-500 mt-2 flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {errors.property_type.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                          Minimum Equity{" "}
                          <Text className="text-red-500 ml-1">*</Text>
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            {...register("minimum_equity")}
                            type="number"
                            placeholder="100000"
                            className="w-full pl-12 pr-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-green-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-green-100"
                          />
                        </div>
                        {errors.minimum_equity && (
                          <p className="text-sm text-red-500 mt-2 flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {errors.minimum_equity.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price Range (only show for seller finder or general campaigns) */}
                    {campaignType !== "seller_finder" && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                          Price Range
                        </h3>
                        <PriceRangeSlider
                          minValue={priceRange.min}
                          maxValue={priceRange.max}
                          onRangeChange={handlePriceRangeChange}
                          min={100000}
                          max={2000000}
                          step={25000}
                        />
                        {/* Display errors if any */}
                        {(errors.min_price || errors.max_price) && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                            {errors.min_price && (
                              <p className="text-sm text-red-500 flex items-center mb-1">
                                <X className="w-4 h-4 mr-1" />
                                Min Price: {errors.min_price.message}
                              </p>
                            )}
                            {errors.max_price && (
                              <p className="text-sm text-red-500 flex items-center">
                                <X className="w-4 h-4 mr-1" />
                                Max Price: {errors.max_price.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Distress Indicators */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-purple-600" />
                        Distress Indicators
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          "Pre-foreclosure",
                          "Tax Liens",
                          "Divorce",
                          "Vacant",
                        ].map((d) => (
                          <label key={d} className="group cursor-pointer">
                            <div className="flex items-center p-4 bg-white/80 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-purple-400 hover:shadow-md hover:bg-white">
                              <input
                                type="checkbox"
                                value={d}
                                {...register("distress_indicators")}
                                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors duration-200">
                                {d}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.distress_indicators && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.distress_indicators.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== Email Content ===== */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl"></div>
                <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl mr-4 shadow-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Email Content
                      </h2>
                      <p className="text-gray-600">
                        Craft your campaign message
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <Mail className="w-4 h-4 mr-2 text-orange-600" />
                        Subject Line{" "}
                        <Text className="text-red-500 ml-1">*</Text>
                      </label>
                      <input
                        {...register("subject_line")}
                        placeholder="Enter your compelling subject line"
                        className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-orange-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-orange-100"
                      />
                      {errors.subject_line && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.subject_line.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <Mail className="w-4 h-4 mr-2 text-orange-600" />
                        Email Content{" "}
                        <Text className="text-red-500 ml-1">*</Text>
                      </label>
                      <textarea
                        {...register("email_content")}
                        rows={6}
                        placeholder="Write your engaging email content here..."
                        className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-orange-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-orange-100 resize-none"
                      />
                      {errors.email_content && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.email_content.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== AI Features ===== */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl"></div>
                <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl mr-4 shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        AI Features
                      </h2>
                      <p className="text-gray-600">
                        Enhance your campaign with AI
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center p-6 bg-white/80 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-violet-400 hover:shadow-md hover:bg-white group">
                    <input
                      {...register("use_ai_personalization")}
                      type="checkbox"
                      className="w-5 h-5 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                    <div className="ml-4">
                      <span className="text-lg font-semibold text-gray-700 group-hover:text-violet-600 transition-colors duration-200">
                        Use AI Personalization
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Automatically customize emails based on recipient data
                      </p>
                    </div>
                    <Sparkles className="w-6 h-6 text-violet-400 ml-auto" />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className={`group flex items-center px-12 py-5 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl transition-all duration-300 ${
                    mutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105 hover:shadow-3xl hover:from-blue-700 hover:to-indigo-700 active:scale-95"
                  }`}
                >
                  {mutation.isPending ? (
                    <>
                      <ButtonLoader className="mr-3 text-white" />
                      Creating Campaign...
                    </>
                  ) : (
                    <>
                      <Save className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      Create Campaign
                    </>
                  )}
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
