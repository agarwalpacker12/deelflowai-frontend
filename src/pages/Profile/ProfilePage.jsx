import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mail, X, Check, Crown, Zap, Star, Shield, User, Building2, Phone, Lock, Eye, EyeOff, Save } from "lucide-react";
import SavedPropertiesPage from "../PropertiesSave/Table";
import DealsPage from "../Deals/DealsPage";
import PricingTable from "../pricing/page";
import { authAPI, PaymentAPI, OrganizationAPI } from "../../services/api";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [paymentMessage, setPaymentMessage] = useState(null);
  const [organizationName, setOrganizationName] = useState("");
  const [loadingOrg, setLoadingOrg] = useState(false);
  
  // Profile form state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Get user details from localStorage - use useState to prevent infinite loops
  const [userDetails, setUserDetails] = useState(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (e) {
      // Ignore parse errors
    }
    return null;
  });

  // Get user ID for stable dependency
  const userId = userDetails?.id || userDetails?.email || null;

  // Initialize profile form data
  useEffect(() => {
    if (userDetails) {
      setProfileFormData({
        first_name: userDetails.first_name || "",
        last_name: userDetails.last_name || "",
        phone: userDetails.phone || "",
        email: userDetails.email || "",
      });
    }
  }, [userId]); // Use userId instead of userDetails object

  // Fetch organization name
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoadingOrg(true);
        const response = await OrganizationAPI.getCurrentOrganization();
        if (response.data && response.data.status === "success" && response.data.data) {
          setOrganizationName(response.data.data.name || "");
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setLoadingOrg(false);
      }
    };
    
    if (userId) {
      fetchOrganization();
    }
  }, [userId]); // Use userId instead of userDetails object

  // Check for payment success/error query parameters
  useEffect(() => {
    const payment = searchParams.get("payment");
    const plan = searchParams.get("plan");
    const sessionId = searchParams.get("session_id");
    const errorMessage = searchParams.get("message");

    if (payment === "success") {
      setPaymentMessage({
        type: "success",
        message: `Payment successful! Your ${plan || "subscription"} plan has been activated.`,
      });
      // Refresh plan data after successful payment
      const fetchCurrentPlan = async () => {
        try {
          setLoadingPlan(true);
          const response = await PaymentAPI.getPacks();
          if (response.data && response.data.status === "success") {
            const plans = response.data.data.plans;
            if (Array.isArray(plans) && plans.length > 0) {
              const activePlan = plans.find(plan => plan.is_active === true);
              if (activePlan) {
                setCurrentPlan(activePlan);
              } else {
                const currentPlanFromResponse = response.data.data.current_plan;
                if (currentPlanFromResponse) {
                  setCurrentPlan(currentPlanFromResponse);
                } else {
                  const markedCurrentPlan = plans.find(plan => plan.is_current === true);
                  setCurrentPlan(markedCurrentPlan || null);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error refreshing plan after payment:", error);
        } finally {
          setLoadingPlan(false);
        }
      };
      fetchCurrentPlan();
      // Clean up URL parameters after showing message
      setTimeout(() => {
        setSearchParams({});
        setPaymentMessage(null);
      }, 5000);
    } else if (payment === "cancelled") {
      setPaymentMessage({
        type: "info",
        message: "Payment was cancelled. You can try again anytime.",
      });
      setTimeout(() => {
        setSearchParams({});
        setPaymentMessage(null);
      }, 5000);
    } else if (payment === "error") {
      setPaymentMessage({
        type: "error",
        message: errorMessage || "Payment verification failed. Please contact support.",
      });
      setTimeout(() => {
        setSearchParams({});
        setPaymentMessage(null);
      }, 5000);
    }
  }, [searchParams, setSearchParams]);

  // Fetch current plan
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        setLoadingPlan(true);
        const response = await PaymentAPI.getPacks();
        if (response.data && response.data.status === "success") {
          const plans = response.data.data.plans;
          if (Array.isArray(plans) && plans.length > 0) {
            const activePlan = plans.find(plan => plan.is_active === true);
            if (activePlan) {
              setCurrentPlan(activePlan);
            } else {
              const currentPlanFromResponse = response.data.data.current_plan;
              if (currentPlanFromResponse) {
                setCurrentPlan(currentPlanFromResponse);
              } else {
                const markedCurrentPlan = plans.find(plan => plan.is_current === true);
                setCurrentPlan(markedCurrentPlan || null);
              }
            }
          }
        }
      } catch (error) {
        if (error.code !== 'ERR_CONNECTION_REFUSED' && error.message !== 'Network Error') {
          console.error("Error fetching current plan:", error);
        }
        setCurrentPlan(null);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchCurrentPlan();
  }, []);

  const handleBackNavigation = () => {
    window.history.back();
  };

  const handleSaveProfile = async () => {
    if (!profileFormData.first_name || !profileFormData.last_name) {
      toast.error("First name and last name are required");
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await authAPI.updateProfile({
        first_name: profileFormData.first_name,
        last_name: profileFormData.last_name,
        phone: profileFormData.phone || null,
      });

      if (response.data && response.data.status === "success") {
        toast.success("Profile updated successfully!");
        setIsEditingProfile(false);
        
        // Update localStorage and state
        if (userDetails) {
          const updatedUser = {
            ...userDetails,
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            phone: response.data.data.phone,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUserDetails(updatedUser);
        }
      } else {
        toast.error(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.detail || "Failed to update profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordFormData.old_password || !passwordFormData.new_password || !passwordFormData.confirm_password) {
      toast.error("All password fields are required");
      return;
    }

    if (passwordFormData.new_password.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await authAPI.changePassword({
        old_password: passwordFormData.old_password,
        new_password: passwordFormData.new_password,
      });

      if (response.data && response.data.status === "success") {
        toast.success("Password changed successfully!");
        setShowPasswordChange(false);
        setPasswordFormData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        toast.error(response.data?.detail || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.detail || "Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Account</h1>
        <button
          onClick={handleBackNavigation}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
          aria-label="Go back"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Payment Success/Error/Cancel Message */}
      {paymentMessage && (
        <div
          className={`mb-6 p-4 rounded-lg backdrop-blur-sm border-2 ${
            paymentMessage.type === "success"
              ? "bg-green-500/20 border-green-400 text-green-100"
              : paymentMessage.type === "error"
              ? "bg-red-500/20 border-red-400 text-red-100"
              : "bg-blue-500/20 border-blue-400 text-blue-100"
          }`}
        >
          <div className="flex items-center gap-3">
            {paymentMessage.type === "success" ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : paymentMessage.type === "error" ? (
              <X className="w-5 h-5 text-red-400" />
            ) : (
              <X className="w-5 h-5 text-blue-400" />
            )}
            <p className="font-medium">{paymentMessage.message}</p>
            <button
              onClick={() => {
                setPaymentMessage(null);
                setSearchParams({});
              }}
              className="ml-auto p-1 rounded-full hover:bg-white/10 transition-all"
              aria-label="Close message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-white/20 mb-8">
        <ul className="flex flex-wrap gap-2">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-white/10 text-white border-b-2 border-purple-400"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
                activeTab === "subscription"
                  ? "bg-white/10 text-white border-b-2 border-purple-400"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Subscription
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("property")}
              className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
                activeTab === "property"
                  ? "bg-white/10 text-white border-b-2 border-purple-400"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Properties
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("deal-property")}
              className={`px-6 py-3 rounded-t-lg font-medium transition-all ${
                activeTab === "deal-property"
                  ? "bg-white/10 text-white border-b-2 border-purple-400"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Deals
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <div className="flex justify-center">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/10">
            <div className="space-y-6">
              {/* Profile Information Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  {!isEditingProfile ? (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditingProfile(false);
                          // Reset form data
                          if (userDetails) {
                            setProfileFormData({
                              first_name: userDetails.first_name || "",
                              last_name: userDetails.last_name || "",
                              phone: userDetails.phone || "",
                              email: userDetails.email || "",
                            });
                          }
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSavingProfile ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* First Name */}
                <div className="bg-white/5 rounded-xl p-4">
                  <label className="text-gray-400 text-sm mb-2 block">First Name</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileFormData.first_name}
                      onChange={(e) => setProfileFormData({ ...profileFormData, first_name: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter first name"
                    />
                  ) : (
                    <p className="text-white text-lg">{profileFormData.first_name || "Not set"}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="bg-white/5 rounded-xl p-4">
                  <label className="text-gray-400 text-sm mb-2 block">Last Name</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileFormData.last_name}
                      onChange={(e) => setProfileFormData({ ...profileFormData, last_name: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter last name"
                    />
                  ) : (
                    <p className="text-white text-lg">{profileFormData.last_name || "Not set"}</p>
                  )}
                </div>

                {/* Organization Name */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    <label className="text-gray-400 text-sm">Organization Name</label>
                  </div>
                  {loadingOrg ? (
                    <p className="text-gray-400">Loading...</p>
                  ) : (
                    <p className="text-white text-lg">{organizationName || "Not assigned"}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <label className="text-gray-400 text-sm">Phone</label>
                  </div>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      value={profileFormData.phone}
                      onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-white text-lg">{profileFormData.phone || "Not set"}</p>
                  )}
                </div>

                {/* Email */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <label className="text-gray-400 text-sm">Email</label>
                  </div>
                  <p className="text-white text-lg">{profileFormData.email || "Not set"}</p>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="border-t border-white/10 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Change Password</h2>
                  </div>
                  {!showPasswordChange && (
                    <button
                      onClick={() => setShowPasswordChange(true)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all"
                    >
                      Change Password
                    </button>
                  )}
                </div>

                {showPasswordChange && (
                  <div className="space-y-4 bg-white/5 rounded-xl p-4">
                    {/* Old Password */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Enter Old Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.old ? "text" : "password"}
                          value={passwordFormData.old_password}
                          onChange={(e) => setPasswordFormData({ ...passwordFormData, old_password: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter old password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Enter New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordFormData.new_password}
                          onChange={(e) => setPasswordFormData({ ...passwordFormData, new_password: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter new password (min 8 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordFormData.confirm_password}
                          onChange={(e) => setPasswordFormData({ ...passwordFormData, confirm_password: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Password Change Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setShowPasswordChange(false);
                          setPasswordFormData({
                            old_password: "",
                            new_password: "",
                            confirm_password: "",
                          });
                        }}
                        className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleChangePassword}
                        disabled={isChangingPassword}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isChangingPassword ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Changing...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Change Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <div className="border-t border-white/10 pt-6 mt-6">
                <button
                  className="w-full px-6 py-3 rounded-xl bg-red-600/80 hover:bg-red-700 text-white font-semibold transition-all"
                  onClick={async () => {
                    try {
                      await authAPI.logout();
                    } catch (e) {}
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="space-y-6">
          {/* Current Plan Section - Moved from Profile */}
          {currentPlan && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-3">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Current Plan</p>
                    {loadingPlan ? (
                      <p className="text-white font-semibold text-xl">Loading...</p>
                    ) : (
                      <p className="text-white font-semibold text-xl capitalize">
                        {currentPlan.name || "Free"}
                      </p>
                    )}
                  </div>
                </div>
                {currentPlan.amount && (
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Price</p>
                    <p className="text-white font-semibold text-xl">
                      {currentPlan.currency === "usd" ? "$" : "₹"}
                      {currentPlan.amount.toLocaleString()}
                      {currentPlan.interval && ` / ${currentPlan.interval}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Pricing Table */}
          <PricingTable />
        </div>
      )}

      {activeTab === "property" && <SavedPropertiesPage />}

      {activeTab === "deal-property" && <DealsPage />}

      {/* Upgrade Confirmation Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div
                className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${selectedPlan.color} flex items-center justify-center mb-4`}
              >
                {React.createElement(selectedPlan.icon, {
                  className: "w-10 h-10 text-white",
                })}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Upgrade to {selectedPlan.name}?
              </h3>
              <p className="text-gray-300">
                You'll be charged{" "}
                <span className="font-bold text-white">
                  {selectedPlan.price}
                </span>{" "}
                {selectedPlan.period}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-gray-300 text-sm mb-3">
                You'll get access to:
              </p>
              <ul className="space-y-2">
                {selectedPlan.features.slice(0, 3).map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-300 text-sm"
                  >
                    <Check className="w-4 h-4 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  // Handle upgrade logic
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all transform hover:scale-105"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
