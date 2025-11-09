import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError, selectAuth } from "../../store/slices/authSlice";
import {
  // getCsrfToken,
  OrganizationAPI,
} from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { useFilteredNavigation } from "../../../navigationConfig";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [orgLoading, setOrgLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);

  useEffect(() => {
    if (isAuthenticated) {
      // Get user from localStorage
      const userDetails = JSON.parse(localStorage.getItem("user") || "{}");
      const userPermissions = userDetails.permissions || [];

      // Get filtered navigation based on permissions
      const {
        topLevelNavLinks,
        propertyNavLinks,
        marketplaceNavLinks,
        marketingHubNavLinks,
        aiFeatureNavLinks,
        analyticsReportsNavLinks,
        systemSettingsNavLinks,
        aiManagementNavLinks,
        integrationNavLinks,
        baseSettingsNavLinks,
        super_adminSettingsNavLinks,
        saasManagementNavLinks,
        whiteLabelNavLinks,
        landingPageBuilderNavLinks,
      } = useFilteredNavigation(userPermissions);

      // Find the first available route based on priority order
      let firstRoute = "/app/properties"; // Default fallback

      if (topLevelNavLinks.length > 0) {
        firstRoute = topLevelNavLinks[0].to;
      } else if (saasManagementNavLinks.length > 0) {
        firstRoute = saasManagementNavLinks[0].to;
      } else if (propertyNavLinks.length > 0) {
        firstRoute = propertyNavLinks[0].to;
      } else if (aiFeatureNavLinks.length > 0) {
        firstRoute = aiFeatureNavLinks[0].to;
      } else if (marketingHubNavLinks.length > 0) {
        firstRoute = marketingHubNavLinks[0].to;
      } else if (marketplaceNavLinks.length > 0) {
        firstRoute = marketplaceNavLinks[0].to;
      } else if (analyticsReportsNavLinks.length > 0) {
        firstRoute = analyticsReportsNavLinks[0].to;
      } else if (aiManagementNavLinks.length > 0) {
        firstRoute = aiManagementNavLinks[0].to;
      } else if (systemSettingsNavLinks.length > 0) {
        firstRoute = systemSettingsNavLinks[0].to;
      } else if (integrationNavLinks.length > 0) {
        firstRoute = integrationNavLinks[0].to;
      } else if (whiteLabelNavLinks.length > 0) {
        firstRoute = whiteLabelNavLinks[0].to;
      } else if (landingPageBuilderNavLinks.length > 0) {
        firstRoute = landingPageBuilderNavLinks[0].to;
      } else if (baseSettingsNavLinks.length > 0) {
        firstRoute = baseSettingsNavLinks[0].to;
      } else if (super_adminSettingsNavLinks.length > 0) {
        firstRoute = super_adminSettingsNavLinks[0].to;
      }

      navigate(firstRoute);
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "email is required";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // await getCsrfToken();
      const resultAction = await dispatch(login(formData));

      // if (login.fulfilled.match(resultAction)) {
      //   setOrgLoading(true);

      //   try {
      //     const orgResponse = await OrganizationAPI.getOrganizationStatus();
      //     const status = orgResponse?.data?.data?.status;

      //     switch (status) {
      //       case "new":
      //         navigate("/app/payment");
      //         break;
      //       case "active":
      //         navigate("/app/dashboard");
      //         break;
      //       default:
      //         navigate("/app/dashboard");
      //     }
      //   } catch (orgError) {
      //     console.error("Organization status check failed:", orgError);
      //     navigate("/app/dashboard");
      //   } finally {
      //     setOrgLoading(false);
      //   }
      // }
    } catch (error) {
      console.error("Login failed:", error);
      setOrgLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-white/80 mb-2"
              htmlFor="email"
            >
              email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Enter your email"
              required
            />
            {formErrors.email && (
              <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-white/80 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Enter your password"
              required
            />
            {formErrors.password && (
              <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            disabled={loading || orgLoading}
          >
            {loading || orgLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner />
                <span>{loading ? "Signing in..." : "Loading..."}</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p className="text-center text-white/70 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
