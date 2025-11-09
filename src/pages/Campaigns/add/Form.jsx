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
import { campaignsAPI, geographicAPI } from "../../../services/api";
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
import { useCallback, useState, useEffect } from "react";
import PriceRangeSlider from "../PriceRangeSlider";
import LocationPicker from "../../../components/LocationPicker/LocationPicker";
import { reverseGeocode } from "../../../services/geocoding";
import { findBestMatchingCity, extractCityVariations, findCityByCoordinates } from "../../../utils/cityMatcher";

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

  // Geographic data state
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  
  // Buyer geographic state
  const [buyerStates, setBuyerStates] = useState([]);
  const [loadingBuyerStates, setLoadingBuyerStates] = useState(false);
  const [buyerCities, setBuyerCities] = useState([]);
  const [loadingBuyerCities, setLoadingBuyerCities] = useState(false);
  const [selectedBuyerCountryId, setSelectedBuyerCountryId] = useState(null);
  const [selectedBuyerStateId, setSelectedBuyerStateId] = useState(null);
  
  // Seller geographic state
  const [sellerStates, setSellerStates] = useState([]);
  const [loadingSellerStates, setLoadingSellerStates] = useState(false);
  const [sellerCities, setSellerCities] = useState([]);
  const [loadingSellerCities, setLoadingSellerCities] = useState(false);
  const [selectedSellerCountryId, setSelectedSellerCountryId] = useState(null);
  const [selectedSellerStateId, setSelectedSellerStateId] = useState(null);

  // Map positions for buyer and seller
  const [buyerMapPosition, setBuyerMapPosition] = useState({ lat: 25.7617, lng: -80.1918 }); // Miami default
  const [sellerMapPosition, setSellerMapPosition] = useState({ lat: 25.7617, lng: -80.1918 }); // Miami default
  const [buyerAddress, setBuyerAddress] = useState(null);
  const [sellerAddress, setSellerAddress] = useState(null);
  const [isGeocodingBuyer, setIsGeocodingBuyer] = useState(false);
  const [isGeocodingSeller, setIsGeocodingSeller] = useState(false);
  
  // AI generation state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState(null);

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
  
  // Watch geographic selections
  const selectedBuyerCountryId = watch("buyer_country");
  const selectedBuyerStateId = watch("buyer_state");
  const selectedSellerCountryId = watch("seller_country");
  const selectedSellerStateId = watch("seller_state");

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
    // Build geographic_scope_values array based on campaign type
    let geographic_scope_values = [];

    if (data.campaign_type === "buyer_finder") {
      // Collect buyer geographic values
      geographic_scope_values = [
        data.buyer_country,
        data.buyer_state,
        data.buyer_counties,
        data.buyer_city,
        data.buyer_districts,
        data.buyer_parish,
      ].filter(Boolean); // Remove empty values
    } else if (data.campaign_type === "seller_finder") {
      // Collect seller geographic values
      geographic_scope_values = [
        data.seller_country,
        data.seller_state,
        data.seller_counties,
        data.seller_city,
        data.seller_districts,
        data.seller_parish,
      ].filter(Boolean); // Remove empty values
    }

    const formData = {
      ...data,
      geographic_scope_values,
      geographic_scope: {
        type: selectedScopeType,
        counties: selectedCounties.map((c) => c.name),
      },
    };
    // console.log("formData", JSON.stringify(formData));

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

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        console.log('🌍 Fetching countries...');
        const response = await geographicAPI.getCountries();
        console.log('📦 Countries API response:', response);
        
        if (response && response.status === 'success' && response.data) {
          console.log('✅ Countries loaded:', response.data.length, 'countries');
          setCountries(response.data);
        } else if (response && response.status === 'error') {
          console.error('❌ Error fetching countries:', response.message);
          // Check if it's a database connection error
          const errorMsg = response.message || 'Failed to load countries';
          if (errorMsg.toLowerCase().includes('database') || 
              errorMsg.toLowerCase().includes('connection') ||
              errorMsg.toLowerCase().includes('timeout')) {
            toast.error('Database connection failed. Please check if the database server is reachable.', {
              duration: 5000
            });
          } else {
            toast.error(errorMsg);
          }
        } else {
          console.error('⚠️ Unexpected response format:', response);
          console.error('Response keys:', response ? Object.keys(response) : 'null');
          toast.error('Failed to load countries: Invalid response format');
        }
      } catch (error) {
        console.error('❌ Exception fetching countries:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
        
        // Check for network/database errors
        const errorMsg = error.message || 'Failed to load countries';
        const responseMsg = error.response?.data?.detail || error.response?.data?.message || '';
        const fullError = responseMsg || errorMsg;
        
        if (fullError.toLowerCase().includes('database') || 
            fullError.toLowerCase().includes('connection') ||
            fullError.toLowerCase().includes('timeout') ||
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT') {
          toast.error('⚠️ Database server unreachable. Countries cannot be loaded. Please check database connectivity.', {
            duration: 6000
          });
        } else if (error.response?.status === 500) {
          toast.error('Server error: Database connection may be unavailable. Please contact support.', {
            duration: 6000
          });
        } else {
          toast.error(fullError || 'Failed to load countries');
        }
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch buyer states when country changes
  useEffect(() => {
    if (!selectedBuyerCountryId) {
      setBuyerStates([]);
      setBuyerCities([]);
      setSelectedBuyerStateId(null);
      setValue("buyer_state", "");
      setValue("buyer_city", "");
      return;
    }

    const fetchBuyerStates = async () => {
      setLoadingBuyerStates(true);
      try {
        const response = await geographicAPI.getStatesByCountry(selectedBuyerCountryId);
        if (response && response.status === 'success' && response.data) {
          setBuyerStates(response.data);
          // Reset state and city when country changes
          setSelectedBuyerStateId(null);
          setValue("buyer_state", "");
          setValue("buyer_city", "");
          setBuyerCities([]);
        } else if (response && response.status === 'error') {
          console.error('Error fetching buyer states:', response.message);
          const errorMsg = response.message || 'Failed to load states';
          if (errorMsg.toLowerCase().includes('database') || 
              errorMsg.toLowerCase().includes('connection') ||
              errorMsg.toLowerCase().includes('timeout')) {
            toast.error('Database connection failed. States cannot be loaded.', {
              duration: 5000
            });
          } else {
            toast.error(errorMsg);
          }
          setBuyerStates([]);
        } else {
          console.error('Unexpected response format:', response);
          toast.error('Failed to load states: Invalid response format');
          setBuyerStates([]);
        }
      } catch (error) {
        console.error('Error fetching buyer states:', error);
        const errorMsg = error.message || 'Failed to load states';
        const responseMsg = error.response?.data?.detail || error.response?.data?.message || '';
        const fullError = responseMsg || errorMsg;
        
        if (fullError.toLowerCase().includes('database') || 
            fullError.toLowerCase().includes('connection') ||
            fullError.toLowerCase().includes('timeout') ||
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT') {
          toast.error('⚠️ Database server unreachable. States cannot be loaded.', {
            duration: 5000
          });
        } else {
          toast.error(fullError || 'Failed to load states');
        }
        setBuyerStates([]);
      } finally {
        setLoadingBuyerStates(false);
      }
    };
    fetchBuyerStates();
  }, [selectedBuyerCountryId, setValue]);

  // Fetch buyer cities when state changes
  useEffect(() => {
    if (!selectedBuyerStateId) {
      setBuyerCities([]);
      setValue("buyer_city", "");
      return;
    }

    const fetchBuyerCities = async () => {
      setLoadingBuyerCities(true);
      try {
        const response = await geographicAPI.getCitiesByState(selectedBuyerStateId);
        console.log("Buyer cities response:", response);
        
        if (response && response.data) {
          if (response.data.status === "success") {
            // Handle both array and paginated response
            const cities = response.data.data || [];
            setBuyerCities(cities);
            // Reset city when state changes
            setValue("buyer_city", "");
            
            if (cities.length === 0) {
              console.warn("No cities found for state:", selectedBuyerStateId);
              // Don't show error for empty list, just log it
            }
          } else if (response.data.status === "error") {
            console.error("Error response:", response.data);
            toast.error(response.data.message || response.data.detail || "Failed to load cities");
          } else {
            // Handle case where status is not in response
            console.warn("Unexpected response structure:", response.data);
            const cities = response.data.data || response.data || [];
            setBuyerCities(cities);
            setValue("buyer_city", "");
          }
        } else {
          console.error("Invalid response structure:", response);
          toast.error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error fetching buyer cities:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
        
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           error.message || 
                           "Failed to load cities";
        toast.error(errorMessage);
        setBuyerCities([]);
      } finally {
        setLoadingBuyerCities(false);
      }
    };
    fetchBuyerCities();
  }, [selectedBuyerStateId, setValue]);

  // Fetch seller states when country changes
  useEffect(() => {
    if (!selectedSellerCountryId) {
      setSellerStates([]);
      setSellerCities([]);
      setSelectedSellerStateId(null);
      setValue("seller_state", "");
      setValue("seller_city", "");
      return;
    }

    const fetchSellerStates = async () => {
      setLoadingSellerStates(true);
      try {
        const response = await geographicAPI.getStatesByCountry(selectedSellerCountryId);
        if (response && response.status === 'success' && response.data) {
          setSellerStates(response.data);
          // Reset state and city when country changes
          setSelectedSellerStateId(null);
          setValue("seller_state", "");
          setValue("seller_city", "");
          setSellerCities([]);
        } else if (response && response.status === 'error') {
          console.error('Error fetching seller states:', response.message);
          const errorMsg = response.message || 'Failed to load states';
          if (errorMsg.toLowerCase().includes('database') || 
              errorMsg.toLowerCase().includes('connection') ||
              errorMsg.toLowerCase().includes('timeout')) {
            toast.error('Database connection failed. States cannot be loaded.', {
              duration: 5000
            });
          } else {
            toast.error(errorMsg);
          }
          setSellerStates([]);
        } else {
          console.error('Unexpected response format:', response);
          toast.error('Failed to load states: Invalid response format');
          setSellerStates([]);
        }
      } catch (error) {
        console.error('Error fetching seller states:', error);
        const errorMsg = error.message || 'Failed to load states';
        const responseMsg = error.response?.data?.detail || error.response?.data?.message || '';
        const fullError = responseMsg || errorMsg;
        
        if (fullError.toLowerCase().includes('database') || 
            fullError.toLowerCase().includes('connection') ||
            fullError.toLowerCase().includes('timeout') ||
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT') {
          toast.error('⚠️ Database server unreachable. States cannot be loaded.', {
            duration: 5000
          });
        } else {
          toast.error(fullError || 'Failed to load states');
        }
        setSellerStates([]);
      } finally {
        setLoadingSellerStates(false);
      }
    };
    fetchSellerStates();
  }, [selectedSellerCountryId, setValue]);

  // Fetch seller cities when state changes
  useEffect(() => {
    if (!selectedSellerStateId) {
      setSellerCities([]);
      setValue("seller_city", "");
      return;
    }

    const fetchSellerCities = async () => {
      setLoadingSellerCities(true);
      try {
        const response = await geographicAPI.getCitiesByState(selectedSellerStateId);
        console.log("Seller cities response:", response);
        
        if (response && response.data) {
          if (response.data.status === "success") {
            // Handle both array and paginated response
            const cities = response.data.data || [];
            setSellerCities(cities);
            // Reset city when state changes
            setValue("seller_city", "");
            
            if (cities.length === 0) {
              console.warn("No cities found for state:", selectedSellerStateId);
              // Don't show error for empty list, just log it
            }
          } else if (response.data.status === "error") {
            console.error("Error response:", response.data);
            toast.error(response.data.message || response.data.detail || "Failed to load cities");
          } else {
            // Handle case where status is not in response
            console.warn("Unexpected response structure:", response.data);
            const cities = response.data.data || response.data || [];
            setSellerCities(cities);
            setValue("seller_city", "");
          }
        } else {
          console.error("Invalid response structure:", response);
          toast.error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error fetching seller cities:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
        
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           error.message || 
                           "Failed to load cities";
        toast.error(errorMessage);
        setSellerCities([]);
      } finally {
        setLoadingSellerCities(false);
      }
    };
    fetchSellerCities();
  }, [selectedSellerStateId, setValue]);

  // Handle location selection from map for buyer
  const handleBuyerLocationSelect = async ({ lat, lng }) => {
    setIsGeocodingBuyer(true);
    setBuyerMapPosition([lat, lng]);
    
    try {
      // Reverse geocode to get location details
      const locationData = await reverseGeocode(lat, lng);
      
      // Find matching country in our database
      const matchedCountry = countries.find(
        c => c.name.toLowerCase() === locationData.country.toLowerCase() ||
        c.iso2?.toLowerCase() === locationData.country.toLowerCase()
      );
      
      if (matchedCountry) {
        setSelectedBuyerCountryId(matchedCountry.id);
        setValue('buyer_country', matchedCountry.name);
        
        // Fetch states for the matched country
        const statesResponse = await geographicAPI.getStatesByCountry(matchedCountry.id);
        if (statesResponse.status === 'success') {
          setBuyerStates(statesResponse.data);
          
          // Try to match state
          const matchedState = statesResponse.data.find(
            s => s.name.toLowerCase() === locationData.state.toLowerCase() ||
            s.state_code?.toLowerCase() === locationData.state.toLowerCase()
          );
          
          if (matchedState) {
            setSelectedBuyerStateId(matchedState.id);
            setValue('buyer_state', matchedState.name);
          } else {
            // If state not found in DB, use the geocoded value
            setValue('buyer_state', locationData.state);
          }
        }
      } else {
        // If country not found, use geocoded value
        setValue('buyer_country', locationData.country);
      }
      
      // Fill other fields
      setValue('buyer_city', locationData.city);
      setValue('buyer_districts', locationData.district);
      setValue('buyer_counties', locationData.district || locationData.city);
      
      toast.success('Location details filled from map');
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      toast.error('Failed to get location details. Please fill manually.');
    } finally {
      setIsGeocodingBuyer(false);
    }
  };

  // Handle location selection from map for seller
  const handleSellerLocationSelect = async ({ lat, lng }) => {
    setIsGeocodingSeller(true);
    setSellerMapPosition([lat, lng]);
    
    try {
      // Reverse geocode to get location details
      const locationData = await reverseGeocode(lat, lng);
      
      // Find matching country in our database
      const matchedCountry = countries.find(
        c => c.name.toLowerCase() === locationData.country.toLowerCase() ||
        c.iso2?.toLowerCase() === locationData.country.toLowerCase()
      );
      
      if (matchedCountry) {
        setSelectedSellerCountryId(matchedCountry.id);
        setValue('seller_country', matchedCountry.name);
        
        // Fetch states for the matched country
        const statesResponse = await geographicAPI.getStatesByCountry(matchedCountry.id);
        if (statesResponse.status === 'success') {
          setSellerStates(statesResponse.data);
          
          // Try to match state
          const matchedState = statesResponse.data.find(
            s => s.name.toLowerCase() === locationData.state.toLowerCase() ||
            s.state_code?.toLowerCase() === locationData.state.toLowerCase()
          );
          
          if (matchedState) {
            setSelectedSellerStateId(matchedState.id);
            setValue('seller_state', matchedState.name);
          } else {
            // If state not found in DB, use the geocoded value
            setValue('seller_state', locationData.state);
          }
        }
      } else {
        // If country not found, use geocoded value
        setValue('seller_country', locationData.country);
      }
      
      // Fill other fields
      setValue('seller_city', locationData.city);
      setValue('seller_districts', locationData.district);
      setValue('seller_counties', locationData.district || locationData.city);
      
      toast.success('Location details filled from map');
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      toast.error('Failed to get location details. Please fill manually.');
    } finally {
      setIsGeocodingSeller(false);
    }
  };

  // Handle AI email generation
  const handleGenerateAIEmail = async () => {
    setIsGeneratingAI(true);
    setAiGeneratedContent(null);
    
    try {
      // Get all form values
      const formData = watch();
      
      // Prepare campaign data for AI generation
      const campaignData = {
        name: formData.name || "Campaign",
        campaign_type: formData.campaign_type || "new",
        location: formData.location || "",
        property_type: formData.property_type || "",
        min_price: formData.min_price || null,
        max_price: formData.max_price || null,
        minimum_equity: formData.minimum_equity || null,
        distress_indicators: formData.distress_indicators || [],
        // Buyer Finder fields
        buyer_country: formData.buyer_country || "",
        buyer_state: formData.buyer_state || "",
        buyer_city: formData.buyer_city || "",
        buyer_districts: formData.buyer_districts || "",
        buyer_counties: formData.buyer_counties || "",
        age_range: formData.age_range || "",
        salary_range: formData.salary_range || "",
        marital_status: formData.marital_status || "",
        employment_status: formData.employment_status || "",
        home_ownership_status: formData.home_ownership_status || "",
        // Seller Finder fields
        seller_country: formData.seller_country || "",
        seller_state: formData.seller_state || "",
        seller_city: formData.seller_city || "",
        seller_districts: formData.seller_districts || "",
        seller_counties: formData.seller_counties || "",
        property_year_built_min: formData.property_year_built_min || null,
        property_year_built_max: formData.property_year_built_max || null,
        seller_keywords: formData.seller_keywords || "",
        // Geographic scope
        geographic_scope_type: formData.geographic_scope_type || "",
        geographic_scope_values: formData.geographic_scope_values || [],
        // Existing content (if any)
        subject_line: formData.subject_line || "",
        email_content: formData.email_content || "",
      };
      
      // Call AI generation API
      const response = await campaignsAPI.generateAIEmail(
        campaignData,
        null, // recipient_info (can be added later for personalization)
        true, // generate_subject
        true  // generate_content
      );
      
      if (response.data.status === "success") {
        const generated = response.data.data;
        
        // Update form fields with AI-generated content
        setValue("subject_line", generated.subject_line || "");
        setValue("email_content", generated.email_content || "");
        
        setAiGeneratedContent({
          subject_line: generated.subject_line,
          email_content: generated.email_content,
        });
        
        toast.success("AI-generated email content created successfully!");
      } else {
        throw new Error(response.data.message || "Failed to generate AI email");
      }
    } catch (error) {
      console.error("Error generating AI email:", error);
      toast.error(
        error.response?.data?.detail || 
        error.message || 
        "Failed to generate AI email. Please try again."
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

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
                        Budget
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
                          value={selectedBuyerCountryId || ''}
                          onChange={(e) => {
                            const countryId = e.target.value ? parseInt(e.target.value) : null;
                            setSelectedBuyerCountryId(countryId);
                            setSelectedBuyerStateId(null);
                            const countryName = countryId ? countries.find(c => c.id === countryId)?.name : '';
                            setValue('buyer_country', countryName);
                            setValue('buyer_state', '');
                          }}
                          disabled={loadingCountries || countries.length === 0}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select Country</option>
                          {countries.length > 0 ? (
                            countries.map((country) => (
                              <option key={country.id} value={country.id}>
                                {country.emoji || '🌍'} {country.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No countries available</option>
                          )}
                        </select>
                        {loadingCountries && (
                          <p className="text-sm text-gray-500 mt-2">⏳ Loading countries...</p>
                        )}
                        {!loadingCountries && countries.length === 0 && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 font-semibold">⚠️ Database Connection Issue</p>
                            <p className="text-xs text-red-500 mt-1">
                              Countries cannot be loaded. The database server may be unreachable.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              <strong>Solution:</strong> Check if the database server is accessible or use a VPN/SSH tunnel if required.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          State
                        </label>
                        <select
                          value={selectedBuyerStateId || ''}
                          onChange={(e) => {
                            const stateId = e.target.value ? parseInt(e.target.value) : null;
                            setSelectedBuyerStateId(stateId);
                            const stateName = stateId ? buyerStates.find(s => s.id === stateId)?.name : '';
                            setValue('buyer_state', stateName);
                          }}
                          disabled={!selectedBuyerCountryId || loadingBuyerStates}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {!selectedBuyerCountryId ? 'Select a country first' : loadingBuyerStates ? 'Loading states...' : 'Select State'}
                          </option>
                          {buyerStates.map((state) => (
                            <option key={state.id} value={state.id}>
                              {state.name} {state.state_code ? `(${state.state_code})` : ''}
                            </option>
                          ))}
                        </select>
                        {loadingBuyerStates && (
                          <p className="text-sm text-gray-500 mt-2">⏳ Loading states...</p>
                        )}
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
                        <select
                          {...register("buyer_city")}
                          disabled={!selectedBuyerStateId || loadingBuyerCities || buyerCities.length === 0}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select City</option>
                          {buyerCities.length > 0 ? (
                            buyerCities.map((city) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              {!selectedBuyerStateId ? "Select a state first" : "No cities available"}
                            </option>
                          )}
                        </select>
                        {loadingBuyerCities && (
                          <p className="text-sm text-gray-500 mt-2">⏳ Loading cities...</p>
                        )}
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
                    </div>

                    {/* Interactive Map */}
                    <div className="mt-6">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        Select Location on Map
                      </label>
                      <div className="bg-white/80 border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                        <LocationPicker
                          initialPosition={buyerMapPosition}
                          onLocationChange={async (location) => {
                            setBuyerMapPosition(location);
                            // Reverse geocode to get address
                            const geocodeResult = await reverseGeocode(location.lat, location.lng);
                            console.log("Reverse geocode result:", geocodeResult);
                            
                            if (geocodeResult.success && geocodeResult.components) {
                              setBuyerAddress(geocodeResult.address);
                              
                              let matchedCountry = null;
                              let statesToMatch = [];
                              let matchedState = null;
                              let citiesToMatch = [];
                              
                              // Step 1: Match country by name or country code
                              if (geocodeResult.components.countryCode && countries.length > 0) {
                                matchedCountry = countries.find(
                                  c => c.iso2?.toUpperCase() === geocodeResult.components.countryCode ||
                                       c.name?.toLowerCase() === geocodeResult.components.country?.toLowerCase()
                                );
                                
                                if (matchedCountry) {
                                  console.log("Matched country:", matchedCountry);
                                  setValue("buyer_country", matchedCountry.id);
                                  
                                  // Fetch states for matched country
                                  if (matchedCountry.id !== selectedBuyerCountryId || buyerStates.length === 0) {
                                    console.log("Fetching states for country:", matchedCountry.id);
                                    const statesResponse = await geographicAPI.getStatesByCountry(matchedCountry.id);
                                    if (statesResponse?.data?.status === "success" && statesResponse.data.data) {
                                      statesToMatch = statesResponse.data.data;
                                      setBuyerStates(statesToMatch);
                                      console.log("Fetched states:", statesToMatch.length);
                                    }
                                  } else {
                                    statesToMatch = buyerStates;
                                  }
                                }
                              }
                              
                              // Step 2: Match state by name (use freshly fetched states)
                              if (geocodeResult.components.state && statesToMatch.length > 0) {
                                matchedState = statesToMatch.find(
                                  s => s.name?.toLowerCase().includes(geocodeResult.components.state.toLowerCase()) ||
                                       geocodeResult.components.state.toLowerCase().includes(s.name?.toLowerCase())
                                );
                                
                                if (matchedState) {
                                  console.log("Matched state:", matchedState);
                                  setValue("buyer_state", matchedState.id);
                                  
                                  // Fetch cities for matched state
                                  if (matchedState.id !== selectedBuyerStateId || buyerCities.length === 0) {
                                    console.log("Fetching cities for state:", matchedState.id);
                                    const citiesResponse = await geographicAPI.getCitiesByState(matchedState.id);
                                    if (citiesResponse?.data?.status === "success" && citiesResponse.data.data) {
                                      citiesToMatch = citiesResponse.data.data;
                                      setBuyerCities(citiesToMatch);
                                      console.log("Fetched cities:", citiesToMatch.length);
                                    }
                                  } else {
                                    citiesToMatch = buyerCities;
                                  }
                                  
                                  // Step 3: Match city by name (use improved matching)
                                  if (citiesToMatch.length > 0) {
                                    // Extract all city name variations from geocoding
                                    const cityVariations = extractCityVariations(geocodeResult.components);
                                    console.log("City variations from geocoding:", cityVariations);
                                    
                                    // Try to find matching city using improved matcher
                                    let matchedCity = findBestMatchingCity(cityVariations, citiesToMatch);
                                    
                                    // If no match found by name, try to find by coordinates
                                    if (!matchedCity && geocodeResult.coordinates) {
                                      console.log("No name match found, trying coordinate-based matching...");
                                      matchedCity = findCityByCoordinates(
                                        geocodeResult.coordinates.latitude,
                                        geocodeResult.coordinates.longitude,
                                        citiesToMatch,
                                        50 // Max 50km distance
                                      );
                                    }
                                    
                                    if (matchedCity) {
                                      console.log("Matched city:", matchedCity);
                                      setValue("buyer_city", matchedCity.id);
                                    } else {
                                      console.log("City not found. Geocoded variations:", cityVariations);
                                      console.log("Available cities sample:", citiesToMatch.slice(0, 10).map(c => c.name));
                                    }
                                  } else {
                                    console.log("No cities loaded. Cities count:", citiesToMatch.length);
                                  }
                                } else {
                                  console.log("State not found. Geocoded state:", geocodeResult.components.state, "Available states:", statesToMatch.map(s => s.name));
                                }
                              } else {
                                console.log("No state component or states not loaded. State:", geocodeResult.components.state, "States count:", statesToMatch.length);
                              }
                            } else {
                              console.error("Reverse geocoding failed:", geocodeResult);
                            }
                          }}
                          height="400px"
                          markerColor="#3b82f6"
                        />
                      </div>
                      {buyerAddress && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>📍 Selected Address:</strong> {buyerAddress}
                          </p>
                        </div>
                      )}
                      {isGeocodingBuyer && (
                        <div className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span>Getting location details...</span>
                        </div>
                      )}
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
                          value={selectedSellerCountryId || ''}
                          onChange={(e) => {
                            const countryId = e.target.value ? parseInt(e.target.value) : null;
                            setSelectedSellerCountryId(countryId);
                            setSelectedSellerStateId(null);
                            const countryName = countryId ? countries.find(c => c.id === countryId)?.name : '';
                            setValue('seller_country', countryName);
                            setValue('seller_state', '');
                          }}
                          disabled={loadingCountries || countries.length === 0}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select Country</option>
                          {countries.length > 0 ? (
                            countries.map((country) => (
                              <option key={country.id} value={country.id}>
                                {country.emoji || '🌍'} {country.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No countries available</option>
                          )}
                        </select>
                        {loadingCountries && (
                          <p className="text-sm text-gray-500 mt-2">⏳ Loading countries...</p>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                          State
                        </label>
                        <select
                          value={selectedSellerStateId || ''}
                          onChange={(e) => {
                            const stateId = e.target.value ? parseInt(e.target.value) : null;
                            setSelectedSellerStateId(stateId);
                            const stateName = stateId ? sellerStates.find(s => s.id === stateId)?.name : '';
                            setValue('seller_state', stateName);
                          }}
                          disabled={!selectedSellerCountryId || loadingSellerStates}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {!selectedSellerCountryId ? 'Select a country first' : loadingSellerStates ? 'Loading states...' : 'Select State'}
                          </option>
                          {sellerStates.map((state) => (
                            <option key={state.id} value={state.id}>
                              {state.name} {state.state_code ? `(${state.state_code})` : ''}
                            </option>
                          ))}
                        </select>
                        {loadingSellerStates && (
                          <p className="text-sm text-gray-500 mt-2">⏳ Loading states...</p>
                        )}
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
                        <select
                          {...register("seller_city")}
                          disabled={!selectedSellerStateId || loadingSellerCities || sellerCities.length === 0}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select City</option>
                          {sellerCities.length > 0 ? (
                            sellerCities.map((city) => (
                              <option key={city.id} value={city.id}>
                                {city.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              {!selectedSellerStateId ? "Select a state first" : "No cities available"}
                            </option>
                          )}
                        </select>
                        {loadingSellerCities && (
                          <p className="text-sm text-gray-500 mt-2">⏳ Loading cities...</p>
                        )}
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

                    {/* Interactive Map */}
                    <div className="mt-6">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                        Select Location on Map
                      </label>
                      <div className="bg-white/80 border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                        <LocationPicker
                          initialPosition={sellerMapPosition}
                          onLocationChange={async (location) => {
                            setSellerMapPosition(location);
                            // Reverse geocode to get address
                            const geocodeResult = await reverseGeocode(location.lat, location.lng);
                            console.log("Reverse geocode result (seller):", geocodeResult);
                            
                            if (geocodeResult.success && geocodeResult.components) {
                              setSellerAddress(geocodeResult.address);
                              
                              let matchedCountry = null;
                              let statesToMatch = [];
                              let matchedState = null;
                              let citiesToMatch = [];
                              
                              // Step 1: Match country by name or country code
                              if (geocodeResult.components.countryCode && countries.length > 0) {
                                matchedCountry = countries.find(
                                  c => c.iso2?.toUpperCase() === geocodeResult.components.countryCode ||
                                       c.name?.toLowerCase() === geocodeResult.components.country?.toLowerCase()
                                );
                                
                                if (matchedCountry) {
                                  console.log("Matched country (seller):", matchedCountry);
                                  setValue("seller_country", matchedCountry.id);
                                  
                                  // Fetch states for matched country
                                  if (matchedCountry.id !== selectedSellerCountryId || sellerStates.length === 0) {
                                    console.log("Fetching states for country (seller):", matchedCountry.id);
                                    const statesResponse = await geographicAPI.getStatesByCountry(matchedCountry.id);
                                    if (statesResponse?.data?.status === "success" && statesResponse.data.data) {
                                      statesToMatch = statesResponse.data.data;
                                      setSellerStates(statesToMatch);
                                      console.log("Fetched states (seller):", statesToMatch.length);
                                    }
                                  } else {
                                    statesToMatch = sellerStates;
                                  }
                                }
                              }
                              
                              // Step 2: Match state by name (use freshly fetched states)
                              if (geocodeResult.components.state && statesToMatch.length > 0) {
                                matchedState = statesToMatch.find(
                                  s => s.name?.toLowerCase().includes(geocodeResult.components.state.toLowerCase()) ||
                                       geocodeResult.components.state.toLowerCase().includes(s.name?.toLowerCase())
                                );
                                
                                if (matchedState) {
                                  console.log("Matched state (seller):", matchedState);
                                  setValue("seller_state", matchedState.id);
                                  
                                  // Fetch cities for matched state
                                  if (matchedState.id !== selectedSellerStateId || sellerCities.length === 0) {
                                    console.log("Fetching cities for state (seller):", matchedState.id);
                                    const citiesResponse = await geographicAPI.getCitiesByState(matchedState.id);
                                    if (citiesResponse?.data?.status === "success" && citiesResponse.data.data) {
                                      citiesToMatch = citiesResponse.data.data;
                                      setSellerCities(citiesToMatch);
                                      console.log("Fetched cities (seller):", citiesToMatch.length);
                                    }
                                  } else {
                                    citiesToMatch = sellerCities;
                                  }
                                  
                                  // Step 3: Match city by name (use improved matching)
                                  if (citiesToMatch.length > 0) {
                                    // Extract all city name variations from geocoding
                                    const cityVariations = extractCityVariations(geocodeResult.components);
                                    console.log("City variations from geocoding (seller):", cityVariations);
                                    
                                    // Try to find matching city using improved matcher
                                    let matchedCity = findBestMatchingCity(cityVariations, citiesToMatch);
                                    
                                    // If no match found by name, try to find by coordinates
                                    if (!matchedCity && geocodeResult.coordinates) {
                                      console.log("No name match found (seller), trying coordinate-based matching...");
                                      matchedCity = findCityByCoordinates(
                                        geocodeResult.coordinates.latitude,
                                        geocodeResult.coordinates.longitude,
                                        citiesToMatch,
                                        50 // Max 50km distance
                                      );
                                    }
                                    
                                    if (matchedCity) {
                                      console.log("Matched city (seller):", matchedCity);
                                      setValue("seller_city", matchedCity.id);
                                    } else {
                                      console.log("City not found (seller). Geocoded variations:", cityVariations);
                                      console.log("Available cities sample (seller):", citiesToMatch.slice(0, 10).map(c => c.name));
                                    }
                                  } else {
                                    console.log("No cities loaded (seller). Cities count:", citiesToMatch.length);
                                  }
                                } else {
                                  console.log("State not found (seller). Geocoded state:", geocodeResult.components.state, "Available states:", statesToMatch.map(s => s.name));
                                }
                              } else {
                                console.log("No state component or states not loaded (seller). State:", geocodeResult.components.state, "States count:", statesToMatch.length);
                              }
                            } else {
                              console.error("Reverse geocoding failed (seller):", geocodeResult);
                            }
                          }}
                          height="400px"
                          markerColor="#10b981"
                        />
                      </div>
                      {sellerAddress && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <p className="text-sm text-emerald-800">
                            <strong>📍 Selected Address:</strong> {sellerAddress}
                          </p>
                        </div>
                      )}
                      {isGeocodingSeller && (
                        <div className="text-sm text-emerald-600 mt-2 flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                          <span>Getting location details...</span>
                        </div>
                      )}
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
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
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
                    {/* AI Generate Button - Only show in AI mode */}
                    {fillMode === "ai" && (
                      <button
                        type="button"
                        onClick={handleGenerateAIEmail}
                        disabled={isGeneratingAI}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isGeneratingAI ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Generate with AI</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <Mail className="w-4 h-4 mr-2 text-orange-600" />
                        Subject Line{" "}
                        <Text className="text-red-500 ml-1">*</Text>
                        {aiGeneratedContent?.subject_line && fillMode === "ai" && (
                          <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                            AI Generated
                          </span>
                        )}
                      </label>
                      <input
                        {...register("subject_line")}
                        placeholder={fillMode === "ai" ? "Enter your compelling subject line or click 'Generate with AI'" : "Enter your compelling subject line"}
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
                        {aiGeneratedContent?.email_content && fillMode === "ai" && (
                          <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                            AI Generated
                          </span>
                        )}
                      </label>
                      <textarea
                        {...register("email_content")}
                        rows={12}
                        placeholder={fillMode === "ai" ? "Write your engaging email content here or click 'Generate with AI' to create personalized content based on your campaign data..." : "Write your engaging email content here..."}
                        className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-orange-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-orange-100 resize-none"
                      />
                      {errors.email_content && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.email_content.message}
                        </p>
                      )}
                      {fillMode === "ai" && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI will use all your campaign data (location, property type, demographics, etc.) to create personalized content
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
