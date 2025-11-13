import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { campaignSchema, channels } from "./utilities";
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
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCampaigns } from "../../../store/slices/campaignsSlice";
import { useCallback, useState, useEffect } from "react";
import PriceRangeSlider from "../PriceRangeSlider";
import { geographicAPI } from "../../../services/api";
import LocationPicker from "../../../components/LocationPicker/LocationPickerWrapper";
import { reverseGeocode } from "../../../services/geocoding";

const EditCampaignForm = ({ fillMode, campaign }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
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
  const [buyerStates, setBuyerStates] = useState([]);
  const [sellerStates, setSellerStates] = useState([]);
  const [buyerCities, setBuyerCities] = useState([]);
  const [sellerCities, setSellerCities] = useState([]);
  const [selectedBuyerCountryId, setSelectedBuyerCountryId] = useState("233");
  const [selectedBuyerStateId, setSelectedBuyerStateId] = useState(null);
  const [selectedSellerCountryId, setSelectedSellerCountryId] = useState("233");
  const [selectedSellerStateId, setSelectedSellerStateId] = useState(null);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingBuyerStates, setLoadingBuyerStates] = useState(false);
  const [loadingSellerStates, setLoadingSellerStates] = useState(false);
  const [loadingBuyerCities, setLoadingBuyerCities] = useState(false);
  const [loadingSellerCities, setLoadingSellerCities] = useState(false);
  const [buyerMapPosition, setBuyerMapPosition] = useState(null);
  const [sellerMapPosition, setSellerMapPosition] = useState(null);
  const [isGeocodingBuyer, setIsGeocodingBuyer] = useState(false);
  const [isGeocodingSeller, setIsGeocodingSeller] = useState(false);
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
    defaultValues: campaign,
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
    mutationFn: async (data) => campaignsAPI.updateCampaign(id, data),
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
      id: campaign?.id || id, // Include campaign ID for update
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

  // Populate form with campaign data when it loads
  useEffect(() => {
    if (campaign) {
      // Set basic fields
      setValue("name", campaign.name || "");
      setValue("campaign_type", campaign.campaign_type || "");
      setValue("channel", campaign.channel || []);
      setValue("budget", campaign.budget || "");
      setValue("scheduled_start_date", campaign.scheduled_start_date || "");
      setValue("scheduled_end_date", campaign.scheduled_end_date || "");
      setValue("scheduled_start_time", campaign.scheduled_start_time || "");
      setValue("scheduled_end_time", campaign.scheduled_end_time || "");
      setValue("status", campaign.status || "");
      setValue("subject_line", campaign.subject_line || "");
      setValue("email_content", campaign.email_content || "");
      setValue(
        "use_ai_personalization",
        campaign.use_ai_personalization || false
      );
      setValue("geographic_scope_type", campaign.geographic_scope_type || "");
      setValue("property_type", campaign.property_type || "");
      setValue("minimum_equity", campaign.minimum_equity || 0);
      setValue("distress_indicators", campaign.distress_indicators || []);

      // Set price range
      if (campaign.min_price || campaign.max_price) {
        setPriceRange({
          min: campaign.min_price || 250000,
          max: campaign.max_price || 750000,
        });
        setValue("min_price", campaign.min_price || 250000);
        setValue("max_price", campaign.max_price || 750000);
      }

      // Set geographic scope values
      if (
        campaign.geographic_scope_values &&
        Array.isArray(campaign.geographic_scope_values)
      ) {
        // For buyer_finder and seller_finder, values are in the array
        // For other types, keep as comma-separated string
        if (
          campaign.campaign_type === "buyer_finder" ||
          campaign.campaign_type === "seller_finder"
        ) {
          setValue("geographic_scope_values", campaign.geographic_scope_values);
        } else {
          setValue(
            "geographic_scope_values",
            campaign.geographic_scope_values.join(",")
          );
        }
      }

      // Set buyer finder fields
      if (campaign.campaign_type === "buyer_finder") {
        setValue("buyer_country", campaign.buyer_country || "");
        setValue("buyer_state", campaign.buyer_state || "");
        setValue("buyer_counties", campaign.buyer_counties || "");
        setValue("buyer_city", campaign.buyer_city || "");
        setValue("buyer_districts", campaign.buyer_districts || "");
        setValue("buyer_parish", campaign.buyer_parish || "");
        setValue("last_qualification", campaign.last_qualification || "");
        setValue("age_range", campaign.age_range || "");
        setValue("ethnicity", campaign.ethnicity || "");
        setValue("salary_range", campaign.salary_range || "");
        setValue("marital_status", campaign.marital_status || "");
        setValue("employment_status", campaign.employment_status || "");
        setValue("home_ownership_status", campaign.home_ownership_status || "");
      }

      // Set seller finder fields
      if (campaign.campaign_type === "seller_finder") {
        setValue("seller_country", campaign.seller_country || "");
        setValue("seller_state", campaign.seller_state || "");
        setValue("seller_counties", campaign.seller_counties || "");
        setValue("seller_city", campaign.seller_city || "");
        setValue("seller_districts", campaign.seller_districts || "");
        setValue("seller_parish", campaign.seller_parish || "");
        setValue(
          "property_year_built_min",
          campaign.property_year_built_min || ""
        );
        setValue(
          "property_year_built_max",
          campaign.property_year_built_max || ""
        );
        setValue("seller_keywords", campaign.seller_keywords || "");
      }

      // Set geographic scope for counties
      if (
        campaign.geographic_scope_type === "counties" &&
        campaign.geographic_scope_values
      ) {
        setSelectedScopeType("counties");
        const countiesArray = campaign.geographic_scope_values.map(
          (name, index) => ({
            id: index + 1,
            name: name,
          })
        );
        setSelectedCounties(countiesArray);
      }
    }
  }, [campaign, setValue]);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await geographicAPI.getCountries();
        if (response.status === "success") {
          setCountries(response.data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Match buyer country and state names to IDs when countries are loaded and campaign data is available
  useEffect(() => {
    const matchBuyerGeographicData = async () => {
      if (
        !campaign ||
        !countries.length ||
        campaign.campaign_type !== "buyer_finder"
      ) {
        return;
      }

      // Match buyer country
      if (campaign.buyer_country) {
        const matchedCountry = countries.find(
          (c) => c.name.toLowerCase() === campaign.buyer_country.toLowerCase()
        );
        if (matchedCountry) {
          setSelectedBuyerCountryId(matchedCountry.id);

          // If there's a buyer state, fetch states and match it
          if (campaign.buyer_state) {
            try {
              const statesResponse = await geographicAPI.getStatesByCountry(
                matchedCountry.id
              );
              if (statesResponse.status === "success") {
                setBuyerStates(statesResponse.data);

                const matchedState = statesResponse.data.find(
                  (s) =>
                    s.name.toLowerCase() === campaign.buyer_state.toLowerCase()
                );
                if (matchedState) {
                  setSelectedBuyerStateId(matchedState.id);

                  // If there's a buyer city, fetch cities
                  if (campaign.buyer_city) {
                    try {
                      const citiesResponse =
                        await geographicAPI.getCitiesByState(matchedState.id);
                      if (
                        citiesResponse?.status === "success" &&
                        citiesResponse.data
                      ) {
                        const sortedCities = [...citiesResponse.data].sort(
                          (a, b) =>
                            (a.name || "").localeCompare(
                              b.name || "",
                              undefined,
                              {
                                sensitivity: "base",
                              }
                            )
                        );
                        setBuyerCities(sortedCities);
                      }
                    } catch (error) {
                      console.error("Error fetching buyer cities:", error);
                    }
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching buyer states:", error);
            }
          }
        }
      }
    };

    matchBuyerGeographicData();
  }, [campaign, countries]);

  // Match seller country and state names to IDs when countries are loaded and campaign data is available
  useEffect(() => {
    const matchSellerGeographicData = async () => {
      if (
        !campaign ||
        !countries.length ||
        campaign.campaign_type !== "seller_finder"
      ) {
        return;
      }

      // Match seller country
      if (campaign.seller_country) {
        const matchedCountry = countries.find(
          (c) => c.name.toLowerCase() === campaign.seller_country.toLowerCase()
        );
        if (matchedCountry) {
          setSelectedSellerCountryId(matchedCountry.id);

          // If there's a seller state, fetch states and match it
          if (campaign.seller_state) {
            try {
              const statesResponse = await geographicAPI.getStatesByCountry(
                matchedCountry.id
              );
              if (statesResponse.status === "success") {
                setSellerStates(statesResponse.data);

                const matchedState = statesResponse.data.find(
                  (s) =>
                    s.name.toLowerCase() === campaign.seller_state.toLowerCase()
                );
                if (matchedState) {
                  setSelectedSellerStateId(matchedState.id);

                  // If there's a seller city, fetch cities
                  if (campaign.seller_city) {
                    try {
                      const citiesResponse =
                        await geographicAPI.getCitiesByState(matchedState.id);
                      if (
                        citiesResponse?.status === "success" &&
                        citiesResponse.data
                      ) {
                        const sortedCities = [...citiesResponse.data].sort(
                          (a, b) =>
                            (a.name || "").localeCompare(
                              b.name || "",
                              undefined,
                              {
                                sensitivity: "base",
                              }
                            )
                        );
                        setSellerCities(sortedCities);
                      }
                    } catch (error) {
                      console.error("Error fetching seller cities:", error);
                    }
                  }
                }
              }
            } catch (error) {
              console.error("Error fetching seller states:", error);
            }
          }
        }
      }
    };

    matchSellerGeographicData();
  }, [campaign, countries]);

  // Fetch buyer states when buyer country changes
  useEffect(() => {
    if (!selectedBuyerCountryId) {
      setBuyerStates([]);
      setSelectedBuyerStateId(null);
      setBuyerCities([]);
      return;
    }

    const fetchStates = async () => {
      setLoadingBuyerStates(true);
      try {
        const response = await geographicAPI.getStatesByCountry(
          selectedBuyerCountryId
        );
        if (response.status === "success") {
          setBuyerStates(response.data);
        }
      } catch (error) {
        console.error("Error fetching buyer states:", error);
        toast.error("Failed to load states");
      } finally {
        setLoadingBuyerStates(false);
      }
    };

    fetchStates();
  }, [selectedBuyerCountryId]);

  // Fetch seller states when seller country changes
  useEffect(() => {
    if (!selectedSellerCountryId) {
      setSellerStates([]);
      setSelectedSellerStateId(null);
      setSellerCities([]);
      return;
    }

    const fetchStates = async () => {
      setLoadingSellerStates(true);
      try {
        const response = await geographicAPI.getStatesByCountry(
          selectedSellerCountryId
        );
        if (response.status === "success") {
          setSellerStates(response.data);
        }
      } catch (error) {
        console.error("Error fetching seller states:", error);
        toast.error("Failed to load states");
      } finally {
        setLoadingSellerStates(false);
      }
    };

    fetchStates();
  }, [selectedSellerCountryId]);

  // Fetch buyer cities when buyer state changes
  useEffect(() => {
    if (!selectedBuyerStateId) {
      setBuyerCities([]);
      setValue("buyer_city", "");
      return;
    }

    const fetchCities = async () => {
      setLoadingBuyerCities(true);
      try {
        const response = await geographicAPI.getCitiesByState(
          selectedBuyerStateId
        );
        if (response?.status === "success" && response.data) {
          // Sort cities alphabetically by name
          const sortedCities = [...response.data].sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", undefined, {
              sensitivity: "base",
            })
          );
          setBuyerCities(sortedCities);
        }
      } catch (error) {
        console.error("Error fetching buyer cities:", error);
        toast.error("Failed to load cities");
      } finally {
        setLoadingBuyerCities(false);
      }
    };

    fetchCities();
  }, [selectedBuyerStateId, setValue]);

  // Fetch seller cities when seller state changes
  useEffect(() => {
    if (!selectedSellerStateId) {
      setSellerCities([]);
      setValue("seller_city", "");
      return;
    }

    const fetchCities = async () => {
      setLoadingSellerCities(true);
      try {
        const response = await geographicAPI.getCitiesByState(
          selectedSellerStateId
        );
        if (response?.status === "success" && response.data) {
          // Sort cities alphabetically by name
          const sortedCities = [...response.data].sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", undefined, {
              sensitivity: "base",
            })
          );
          setSellerCities(sortedCities);
        }
      } catch (error) {
        console.error("Error fetching seller cities:", error);
        toast.error("Failed to load cities");
      } finally {
        setLoadingSellerCities(false);
      }
    };

    fetchCities();
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
        (c) =>
          c.name.toLowerCase() === locationData.country.toLowerCase() ||
          c.iso2?.toLowerCase() === locationData.country.toLowerCase()
      );

      if (matchedCountry) {
        setSelectedBuyerCountryId(matchedCountry.id);
        setValue("buyer_country", matchedCountry.name);

        // Fetch states for the matched country
        const statesResponse = await geographicAPI.getStatesByCountry(
          matchedCountry.id
        );
        if (statesResponse.status === "success") {
          setBuyerStates(statesResponse.data);

          // Try to match state
          const matchedState = statesResponse.data.find(
            (s) =>
              s.name.toLowerCase() === locationData.state.toLowerCase() ||
              s.state_code?.toLowerCase() === locationData.state.toLowerCase()
          );

          if (matchedState) {
            setSelectedBuyerStateId(matchedState.id);
            setValue("buyer_state", matchedState.name);

            // Fetch cities for the matched state and then match the city
            const citiesResponse = await geographicAPI.getCitiesByState(
              matchedState.id
            );
            if (citiesResponse?.status === "success" && citiesResponse.data) {
              // Sort cities alphabetically
              const sortedCities = [...citiesResponse.data].sort((a, b) =>
                (a.name || "").localeCompare(b.name || "", undefined, {
                  sensitivity: "base",
                })
              );
              setBuyerCities(sortedCities);

              // Try to match the geocoded city with cities in the database
              const geocodedCityName =
                locationData.city || locationData.components?.city || "";
              if (geocodedCityName) {
                // Try exact match first
                let matchedCity = sortedCities.find(
                  (c) => c.name.toLowerCase() === geocodedCityName.toLowerCase()
                );

                // Try partial match if exact match fails
                if (!matchedCity) {
                  matchedCity = sortedCities.find(
                    (c) =>
                      c.name
                        .toLowerCase()
                        .includes(geocodedCityName.toLowerCase()) ||
                      geocodedCityName
                        .toLowerCase()
                        .includes(c.name.toLowerCase())
                  );
                }

                if (matchedCity) {
                  setValue("buyer_city", matchedCity.name);
                } else {
                  // If no match found, use the geocoded value
                  setValue("buyer_city", geocodedCityName);
                }
              }
            } else {
              // If cities fetch failed, use geocoded value
              setValue(
                "buyer_city",
                locationData.city || locationData.components?.city || ""
              );
            }
          } else {
            // If state not found in DB, use the geocoded value
            setValue("buyer_state", locationData.state);
            setValue(
              "buyer_city",
              locationData.city || locationData.components?.city || ""
            );
          }
        }
      } else {
        // If country not found, use geocoded value
        setValue("buyer_country", locationData.country);
        setValue(
          "buyer_city",
          locationData.city || locationData.components?.city || ""
        );
      }

      // Fill other fields
      setValue("buyer_districts", locationData.district);
      setValue("buyer_counties", locationData.district || locationData.city);

      toast.success("Location details filled from map");
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      toast.error("Failed to get location details. Please fill manually.");
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
        (c) =>
          c.name.toLowerCase() === locationData.country.toLowerCase() ||
          c.iso2?.toLowerCase() === locationData.country.toLowerCase()
      );

      if (matchedCountry) {
        setSelectedSellerCountryId(matchedCountry.id);
        setValue("seller_country", matchedCountry.name);

        // Fetch states for the matched country
        const statesResponse = await geographicAPI.getStatesByCountry(
          matchedCountry.id
        );
        if (statesResponse.status === "success") {
          setSellerStates(statesResponse.data);

          // Try to match state
          const matchedState = statesResponse.data.find(
            (s) =>
              s.name.toLowerCase() === locationData.state.toLowerCase() ||
              s.state_code?.toLowerCase() === locationData.state.toLowerCase()
          );

          if (matchedState) {
            setSelectedSellerStateId(matchedState.id);
            setValue("seller_state", matchedState.name);

            // Fetch cities for the matched state and then match the city
            const citiesResponse = await geographicAPI.getCitiesByState(
              matchedState.id
            );
            if (citiesResponse?.status === "success" && citiesResponse.data) {
              // Sort cities alphabetically
              const sortedCities = [...citiesResponse.data].sort((a, b) =>
                (a.name || "").localeCompare(b.name || "", undefined, {
                  sensitivity: "base",
                })
              );
              setSellerCities(sortedCities);

              // Try to match the geocoded city with cities in the database
              const geocodedCityName =
                locationData.city || locationData.components?.city || "";
              if (geocodedCityName) {
                // Try exact match first
                let matchedCity = sortedCities.find(
                  (c) => c.name.toLowerCase() === geocodedCityName.toLowerCase()
                );

                // Try partial match if exact match fails
                if (!matchedCity) {
                  matchedCity = sortedCities.find(
                    (c) =>
                      c.name
                        .toLowerCase()
                        .includes(geocodedCityName.toLowerCase()) ||
                      geocodedCityName
                        .toLowerCase()
                        .includes(c.name.toLowerCase())
                  );
                }

                if (matchedCity) {
                  setValue("seller_city", matchedCity.name);
                } else {
                  // If no match found, use the geocoded value
                  setValue("seller_city", geocodedCityName);
                }
              }
            } else {
              // If cities fetch failed, use geocoded value
              setValue(
                "seller_city",
                locationData.city || locationData.components?.city || ""
              );
            }
          } else {
            // If state not found in DB, use the geocoded value
            setValue("seller_state", locationData.state);
            setValue(
              "seller_city",
              locationData.city || locationData.components?.city || ""
            );
          }
        }
      } else {
        // If country not found, use geocoded value
        setValue("seller_country", locationData.country);
        setValue(
          "seller_city",
          locationData.city || locationData.components?.city || ""
        );
      }

      // Fill other fields
      setValue("seller_districts", locationData.district);
      setValue("seller_counties", locationData.district || locationData.city);

      toast.success("Location details filled from map");
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      toast.error("Failed to get location details. Please fill manually.");
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
        minimum_equity: formData.minimum_equity || 0,
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
        true // generate_content
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
                      )}
                      {errors.channel && (
                        <p className="text-sm text-red-500 mt-2 flex items-center">
                          <X className="w-4 h-4 mr-1" />
                          {errors.channel.message}
                        </p>
                      )}
                    </div>

                    {/* Budget */}
                    {campaignType === "buyer_finder" && (
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
                    )}
                    {/* Scheduled Date & Time Range */}
                    <div className="lg:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                        Scheduled Date & Time Range{" "}
                        <Text className="text-red-500 ml-1">*</Text>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Start Date <Text className="text-red-500">*</Text>
                          </label>
                          <input
                            {...register("scheduled_start_date")}
                            type="date"
                            className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-purple-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-purple-100"
                          />
                          {errors.scheduled_start_date && (
                            <p className="text-sm text-red-500 mt-2 flex items-center">
                              <X className="w-4 h-4 mr-1" />
                              {errors.scheduled_start_date.message}
                            </p>
                          )}
                        </div>

                        {/* End Date */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            End Date <Text className="text-red-500">*</Text>
                          </label>
                          <input
                            {...register("scheduled_end_date")}
                            type="date"
                            className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-purple-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-purple-100"
                          />
                          {errors.scheduled_end_date && (
                            <p className="text-sm text-red-500 mt-2 flex items-center">
                              <X className="w-4 h-4 mr-1" />
                              {errors.scheduled_end_date.message}
                            </p>
                          )}
                        </div>

                        {/* Start Time */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Start Time (Daily){" "}
                            <Text className="text-red-500">*</Text>
                          </label>
                          <input
                            {...register("scheduled_start_time")}
                            type="time"
                            className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-purple-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-purple-100"
                          />
                          {errors.scheduled_start_time && (
                            <p className="text-sm text-red-500 mt-2 flex items-center">
                              <X className="w-4 h-4 mr-1" />
                              {errors.scheduled_start_time.message}
                            </p>
                          )}
                        </div>

                        {/* End Time */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            End Time (Daily){" "}
                            <Text className="text-red-500">*</Text>
                          </label>
                          <input
                            {...register("scheduled_end_time")}
                            type="time"
                            className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-purple-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-purple-100"
                          />
                          {errors.scheduled_end_time && (
                            <p className="text-sm text-red-500 mt-2 flex items-center">
                              <X className="w-4 h-4 mr-1" />
                              {errors.scheduled_end_time.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        The time range (e.g., 9:00 AM to 9:00 PM) will apply to
                        all days in the selected date range.
                      </p>
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
                          value={selectedBuyerCountryId || ""}
                          onChange={(e) => {
                            const countryId = e.target.value
                              ? parseInt(e.target.value)
                              : null;
                            setSelectedBuyerCountryId(countryId);
                            setSelectedBuyerStateId(null);
                            setBuyerCities([]); // Clear cities when country changes
                            const countryName = countryId
                              ? countries.find((c) => c.id === countryId)?.name
                              : "";
                            setValue("buyer_country", countryName);
                            setValue("buyer_state", "");
                            setValue("buyer_city", ""); // Clear city when country changes
                          }}
                          disabled={loadingCountries}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.emoji} {country.name}
                            </option>
                          ))}
                        </select>
                        {loadingCountries && (
                          <p className="text-sm text-gray-500 mt-2">
                            Loading countries...
                          </p>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          State
                        </label>
                        <select
                          value={selectedBuyerStateId || ""}
                          onChange={(e) => {
                            const stateId = e.target.value
                              ? parseInt(e.target.value)
                              : null;
                            setSelectedBuyerStateId(stateId);
                            setBuyerCities([]); // Clear cities when state changes
                            const stateName = stateId
                              ? buyerStates.find((s) => s.id === stateId)?.name
                              : "";
                            setValue("buyer_state", stateName);
                            setValue("buyer_city", ""); // Clear city when state changes
                          }}
                          disabled={
                            !selectedBuyerCountryId || loadingBuyerStates
                          }
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {!selectedBuyerCountryId
                              ? "Select a country first"
                              : loadingBuyerStates
                              ? "Loading states..."
                              : "Select State"}
                          </option>
                          {buyerStates.map((state) => (
                            <option key={state.id} value={state.id}>
                              {state.name}{" "}
                              {state.state_code ? `(${state.state_code})` : ""}
                            </option>
                          ))}
                        </select>
                        {loadingBuyerStates && (
                          <p className="text-sm text-gray-500 mt-2">
                            Loading states...
                          </p>
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
                          value={
                            selectedBuyerStateId &&
                            buyerCities.some(
                              (c) => c.name === watch("buyer_city")
                            )
                              ? watch("buyer_city") || ""
                              : ""
                          }
                          onChange={(e) => {
                            setValue("buyer_city", e.target.value);
                          }}
                          disabled={!selectedBuyerStateId || loadingBuyerCities}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {!selectedBuyerStateId
                              ? "Select a state first"
                              : loadingBuyerCities
                              ? "Loading cities..."
                              : "Select City"}
                          </option>
                          {buyerCities.map((city) => (
                            <option key={city.id} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                        {loadingBuyerCities && (
                          <p className="text-sm text-gray-500 mt-2">
                            Loading cities...
                          </p>
                        )}
                        {errors.buyer_city && (
                          <p className="text-sm text-red-500 mt-2 flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {errors.buyer_city.message}
                          </p>
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

                    {/* Map Location Picker for Buyer */}
                    <div className="mb-6">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        Select Location on Map
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Click on the map to automatically fill location fields
                        above
                      </p>
                      <LocationPicker
                        onLocationSelect={handleBuyerLocationSelect}
                        initialPosition={buyerMapPosition || [20.5937, 78.9629]}
                        zoom={buyerMapPosition ? 10 : 5}
                        height={400}
                      />
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
                          value={selectedSellerCountryId || ""}
                          onChange={(e) => {
                            const countryId = e.target.value
                              ? parseInt(e.target.value)
                              : null;
                            setSelectedSellerCountryId(countryId);
                            setSelectedSellerStateId(null);
                            setSellerCities([]); // Clear cities when country changes
                            const countryName = countryId
                              ? countries.find((c) => c.id === countryId)?.name
                              : "";
                            setValue("seller_country", countryName);
                            setValue("seller_state", "");
                            setValue("seller_city", ""); // Clear city when country changes
                          }}
                          disabled={loadingCountries}
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.emoji} {country.name}
                            </option>
                          ))}
                        </select>
                        {loadingCountries && (
                          <p className="text-sm text-gray-500 mt-2">
                            Loading countries...
                          </p>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                          State
                        </label>
                        <select
                          value={selectedSellerStateId || ""}
                          onChange={(e) => {
                            const stateId = e.target.value
                              ? parseInt(e.target.value)
                              : null;
                            setSelectedSellerStateId(stateId);
                            setSellerCities([]); // Clear cities when state changes
                            const stateName = stateId
                              ? sellerStates.find((s) => s.id === stateId)?.name
                              : "";
                            setValue("seller_state", stateName);
                            setValue("seller_city", ""); // Clear city when state changes
                          }}
                          disabled={
                            !selectedSellerCountryId || loadingSellerStates
                          }
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {!selectedSellerCountryId
                              ? "Select a country first"
                              : loadingSellerStates
                              ? "Loading states..."
                              : "Select State"}
                          </option>
                          {sellerStates.map((state) => (
                            <option key={state.id} value={state.id}>
                              {state.name}{" "}
                              {state.state_code ? `(${state.state_code})` : ""}
                            </option>
                          ))}
                        </select>
                        {loadingSellerStates && (
                          <p className="text-sm text-gray-500 mt-2">
                            Loading states...
                          </p>
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
                          value={
                            selectedSellerStateId &&
                            sellerCities.some(
                              (c) => c.name === watch("seller_city")
                            )
                              ? watch("seller_city") || ""
                              : ""
                          }
                          onChange={(e) => {
                            setValue("seller_city", e.target.value);
                          }}
                          disabled={
                            !selectedSellerStateId || loadingSellerCities
                          }
                          className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {!selectedSellerStateId
                              ? "Select a state first"
                              : loadingSellerCities
                              ? "Loading cities..."
                              : "Select City"}
                          </option>
                          {sellerCities.map((city) => (
                            <option key={city.id} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                        {loadingSellerCities && (
                          <p className="text-sm text-gray-500 mt-2">
                            Loading cities...
                          </p>
                        )}
                        {errors.seller_city && (
                          <p className="text-sm text-red-500 mt-2 flex items-center">
                            <X className="w-4 h-4 mr-1" />
                            {errors.seller_city.message}
                          </p>
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

                    {/* Map Location Picker for Seller */}
                    <div className="mb-6">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                        Select Location on Map
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Click on the map to automatically fill location fields
                        above
                      </p>
                      <LocationPicker
                        onLocationSelect={handleSellerLocationSelect}
                        initialPosition={
                          sellerMapPosition || [20.5937, 78.9629]
                        }
                        zoom={sellerMapPosition ? 10 : 5}
                        height={400}
                      />
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
                      {/* <div>
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
                          </div> */}

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
                          "Inheritance",
                          "Job Loss",
                          "Medical Bills",
                          "Bankruptcy",
                          "Code Violations",
                          "Expired Listings",
                          "High Days on Market",
                          "Behind on Payments",
                          "Relocation",
                          "Downsizing",
                          "Property Damage",
                          "Landlord Burnout",
                          "Estate Sale",
                          "Absentee Owner",
                          "Delinquent HOA",
                          "Underwater Mortgage",
                          "Financial Hardship",
                          "Health Issues",
                          "Job Transfer",
                          "Retirement",
                          "Death in Family",
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
                        {aiGeneratedContent?.subject_line &&
                          fillMode === "ai" && (
                            <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                              AI Generated
                            </span>
                          )}
                      </label>
                      <input
                        {...register("subject_line")}
                        placeholder={
                          fillMode === "ai"
                            ? "Enter your compelling subject line or click 'Generate with AI'"
                            : "Enter your compelling subject line"
                        }
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
                        {aiGeneratedContent?.email_content &&
                          fillMode === "ai" && (
                            <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                              AI Generated
                            </span>
                          )}
                      </label>
                      <textarea
                        {...register("email_content")}
                        rows={12}
                        placeholder={
                          fillMode === "ai"
                            ? "Write your engaging email content here or click 'Generate with AI' to create personalized content based on your campaign data..."
                            : "Write your engaging email content here..."
                        }
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
                          AI will use all your campaign data (location, property
                          type, demographics, etc.) to create personalized
                          content
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
                      Updating Campaign...
                    </>
                  ) : (
                    <>
                      <Save className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      Update Campaign
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

export default EditCampaignForm;
