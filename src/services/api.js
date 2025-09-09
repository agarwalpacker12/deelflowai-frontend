// // Updated services/api.js with strict origin and CSRF token support
// import axios from "axios";

// // Base URLs - using consistent localhost format
// const BASE_URL = "http://127.0.0.1:8000";
// const API_BASE_URL = `${BASE_URL}/api`;

// // Login API instance (for auth endpoints without /api prefix)
// const loginApiPath = axios.create({
//   baseURL: BASE_URL,
//   credentials: "include",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     "X-Requested-With": "XMLHttpRequest",
//   },
// });

// // Main API instance (for all other endpoints with /api prefix)
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     "X-Requested-With": "XMLHttpRequest",
//   },
// });

// // CSRF token handling for Django
// let csrfToken = null;
// // Function to get Django CSRF token
// export const getCsrfToken = async () => {
//   try {
//     const response = await loginApiPath.get("/csrf/"); // You'll need to create this endpoint in Django
//     csrfToken = response.data.csrfToken;
//     // Set CSRF token for future requests
//     api.defaults.headers.common["X-CSRFToken"] = csrfToken;
//     return csrfToken;
//   } catch (error) {
//     console.error("Failed to fetch CSRF cookie:", error);
//   }
// };

// // Request interceptor for login API
// loginApiPath.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Request interceptor for main API
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for both instances
// const handleAuthError = (error) => {
//   if (error.response?.status === 401) {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   }
//   return Promise.reject(error);
// };

// loginApiPath.interceptors.response.use((response) => response, handleAuthError);
// api.interceptors.response.use((response) => response, handleAuthError);

// // Auth API - using loginApiPath for auth endpoints
// export const authAPI = {
//   login: (credentials) => loginApiPath.post("/login", credentials), // Fixed: removed trailing slash
//   register: (userData) => api.post("/register", userData),
//   logout: () => api.post("/logout"),
//   getCurrentUser: () => api.get("/user"),
//   getAllUsers: () => api.get("/users"),

//   invite: (data) => api.post("/invitations", data),
//   getInvitation: (invitationtoken) =>
//     api.get(`/validate-invitation?token=${invitationtoken}`),
//   inviteeRegister: (userData) => api.post("/invitee-register", userData),
// };

// // All other APIs using the main api instance
// export const leadsAPI = {
//   getLeads: (params) => api.get("/leads", { params }),
//   getLead: (id) => api.get(`/leads/${id}`),
//   createLead: (data) => api.post("/leads", data),
//   updateLead: (id, data) => api.put(`/leads/${id}`, data),
//   deleteLead: (id) => api.delete(`/leads/${id}`),
//   getAIScore: (id) => api.get(`/leads/${id}/ai-score`),
// };

// export const propertiesAPI = {
//   getProperties: (params) => api.get("/properties", { params }),
//   getProperty: (id) => api.get(`/properties/${id}`),
//   createProperty: (data) => api.post("/properties", data),
//   updateProperty: (id, data) => api.put(`/properties/${id}`, data),
//   deleteProperty: (id) => api.delete(`/properties/${id}`),
//   getAIAnalysis: (id) => api.get(`/properties/${id}/ai-analysis`),
// };

// export const dealsAPI = {
//   getDeals: (params) => api.get("/deals", { params }),
//   getDeal: (id) => api.get(`/deals/${id}`),
//   createDeal: (data) => api.post("/deals", data),
//   updateDeal: (id, data) => api.put(`/deals/${id}`, data),
//   deleteDeal: (id) => api.delete(`/deals/${id}`),
//   getMilestones: (id) => api.get(`/deals/${id}/milestones`),
// };

// export const dealMilestonesAPI = {
//   getMilestones: (params) => api.get("/deal-milestones", { params }),
//   getMilestone: (id) => api.get(`/deal-milestones/${id}`),
//   createMilestone: (data) => api.post("/deal-milestones", data),
//   updateMilestone: (id, data) => api.put(`/deal-milestones/${id}`, data),
//   deleteMilestone: (id) => api.delete(`/deal-milestones/${id}`),
//   completeMilestone: (id) => api.patch(`/deal-milestones/${id}/complete`),
// };

// export const campaignsAPI = {
//   getCampaigns: (params) => api.get("/campaigns", { params }),
//   getCampaign: (id) => api.get(`/campaigns/${id}`),
//   createCampaign: (data) => api.post("/campaigns", data),
//   updateCampaign: (id, data) => api.put(`/campaigns/${id}`, data),
//   deleteCampaign: (id) => api.delete(`/campaigns/${id}`),
//   getRecipients: (id) => api.get(`/campaigns/${id}/recipients`),
// };

// export const propertySaveAPI = {
//   getPropertySave: (params) => api.get("/property-saves", { params }),
//   getSinglePropertySave: (id) => api.get(`/property-saves/${id}`),
//   createPropertySave: (data) => api.post("/property-saves", data),
//   updatePropertySave: (id, data) => api.put(`/property-saves/${id}`, data),
//   deletePropertySave: (id) => api.delete(`/property-saves/${id}`),
// };

// export const TenantAPI = {
//   getTenants: (params) => api.get("/tenant", { params }),
//   getTenant: (id) => api.get(`/tenant/${id}`),
//   createTenant: (data) => api.post("/tenant", data),
//   updateTenant: (id, data) => api.put(`/tenant/${id}`, data),
//   deleteTenant: (id) => api.delete(`/tenant/${id}`),
// };

// export const OrganizationAPI = {
//   getOrganizationStatus: () => api.get(`/organizations/status`),
//   getOrganization: () => api.get(`/organizations`),
//   UpdateOrganization: (id, data) => api.put(`/organizations/${id}`, data),
// };

// export const RbacAPI = {
//   getRoles: () => api.get("/rbac/roles"),
//   getPermissions: () => api.get("/rbac/permissions"),
//   UpdatePermission: (id, data) => api.put(`/rbac/roles/${id}`, data),
//   UpdateRole: (data) => api.put(`users/${data.id}/roles`, data),
// };

// export const PaymentAPI = {
//   getSubscriptionPack: () => api.get(`/subscription-packs`),
//   createCheckout: (id) => api.post(`/create-checkout-session`, id),
//   createCustomerPortal: () => api.post(`/create-customer-portal-session`),
//   getTransactionList: () => api.post(`/stripe-invoice`),
//   getCurrentPack: () => api.get(`/current-subscription`),
// };

// export const DashboardAPI = {
//   getTotalRevenue: () => api.get(`/total-revenue`),
//   getActiveUsers: () => api.get(`/active-users`),
//   getAiConversations: () => api.get(`/ai-conversations`),
//   getTotalDeals: () => api.get(`/total-deals`),
//   getMonthlyProfit: () => api.get(`/monthly-profit`),
//   getVoiceCallsCount: () => api.get(`/voice-calls-count`),
//   getComplianceStatus: () => api.get(`/compliance-status`),
//   getLiveActivityFeed: () => api.get(`/live-activity-feed`),
//   getDealCompletions: () => api.get(`/deal-completions-scheduling`),
//   getChartData: () => api.get(`/revenue-user-growth-chart-data`),

//   // New AI Performance Metrics endpoints
//   getVoiceAIMetrics: () => api.get(`/voice-calls-count`),
//   getVisionAnalysisMetrics: () => api.get(`/vision-analysis`),
//   getNLPProcessingMetrics: () => api.get(`/nlp-processing`),
//   getBlockchainMetrics: () => api.get(`/blockchain-txns`),

//   // New Tenant Management endpoints
//   getTenantStats: () => api.get(`/tenant-management/stats`),
//   getRecentTenantActivity: () => api.get(`/tenant-management/recent-activity`),

//   // New Opportunity Cost Analysis endpoint
//   getOpportunityCostAnalysis: () =>
//     api.get(`/analytics/opportunity-cost-analysis`),
//   // New AI Accuracy endpoint for Business Metrics
//   getAiAccuracy: () => api.get(`/ai-metrics/overall-accuracy`),

//   getComplianceStatus: () => api.get(`/compliance-status`),

//   // Optional: Enhanced compliance details
//   getComplianceDetails: () => api.get(`/compliance-status/details`),
//   getChartData: () => api.get(`/revenue-user-growth-chart-data`),

//   // New Market Alerts endpoint
//   getMarketAlerts: () => api.get(`/market-alerts/recent`),
// };

// export default api;

// Updated services/api.js with proper CORS and JWT authentication

import axios from "axios";

// Base URLs - matching your Django server
const BASE_URL = "http://dev.deelflowai.com:8000";
const API_BASE_URL = `${BASE_URL}/api`;

// Create a single API instance for all requests
const api = axios.create({
  baseURL: API_BASE_URL, // Use base URL without /api prefix
  withCredentials: true,
  credentials: "include", // 👈 REQUIRED for session cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

const LoginHeader = axios.create({
  baseURL: BASE_URL, // Use base URL without /api prefix
  // withCredentials: true,
  // credentials: "include", // 👈 REQUIRED for session cookies
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// No CSRF token needed for JWT authentication

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API - Fixed URLs to match your Django urls.py
export const authAPI = {
  login: (credentials) => LoginHeader.post("/login/", credentials), // Matches your URL pattern
  register: (userData) => api.post("/create_user/", userData), // Matches your URL pattern
  logout: () => api.post("/logout/"),
  getCurrentUser: () => api.get("/api/user/"),
  getAllUsers: () => api.get("/api/users/"),
  invite: (data) => api.post("/api/invitations/", data),
  getInvitation: (invitationtoken) =>
    api.get(`/api/validate-invitation/?token=${invitationtoken}`),
  inviteeRegister: (userData) => api.post("/api/invitee-register/", userData),
};

// All other APIs using the main api instance with /api prefix
export const leadsAPI = {
  getLeads: (params) => api.get("/api/leads/", { params }),
  getLead: (id) => api.get(`/api/leads/${id}/`),
  createLead: (data) => api.post("/api/leads/", data),
  updateLead: (id, data) => api.put(`/api/leads/${id}/`, data),
  deleteLead: (id) => api.delete(`/api/leads/${id}/`),
  getAIScore: (id) => api.get(`/api/leads/${id}/ai-score/`),
};

export const propertiesAPI = {
  getProperties: (params) => api.get("/api/properties/", { params }),
  getProperty: (id) => api.get(`/api/properties/${id}/`),
  createProperty: (data) => api.post("/api/properties/", data),
  updateProperty: (id, data) => api.put(`/api/properties/${id}/`, data),
  deleteProperty: (id) => api.delete(`/api/properties/${id}/`),
  getAIAnalysis: (id) => api.get(`/api/properties/${id}/ai-analysis/`),
};

export const dealsAPI = {
  getDeals: (params) => api.get("/api/deals/", { params }),
  getDeal: (id) => api.get(`/api/deals/${id}/`),
  createDeal: (data) => api.post("/api/deals/", data),
  updateDeal: (id, data) => api.put(`/api/deals/${id}/`, data),
  deleteDeal: (id) => api.delete(`/api/deals/${id}/`),
  getMilestones: (id) => api.get(`/api/deals/${id}/milestones/`),
};

export const dealMilestonesAPI = {
  getMilestones: (params) => api.get("/api/deal-milestones/", { params }),
  getMilestone: (id) => api.get(`/api/deal-milestones/${id}/`),
  createMilestone: (data) => api.post("/api/deal-milestones/", data),
  updateMilestone: (id, data) => api.put(`/api/deal-milestones/${id}/`, data),
  deleteMilestone: (id) => api.delete(`/api/deal-milestones/${id}/`),
  completeMilestone: (id) => api.patch(`/api/deal-milestones/${id}/complete/`),
};

export const campaignsAPI = {
  getCampaigns: (params) => api.get("/api/campaigns/", { params }),
  getCampaign: (id) => api.get(`/api/campaigns/${id}/`),
  createCampaign: (data) => api.post("/api/campaigns/", data),
  updateCampaign: (id, data) => api.put(`/api/campaigns/${id}/`, data),
  deleteCampaign: (id) => api.delete(`/api/campaigns/${id}/`),
  getRecipients: (id) => api.get(`/api/campaigns/${id}/recipients/`),
};

export const propertySaveAPI = {
  getPropertySave: (params) => api.get("/api/property-saves/", { params }),
  getSinglePropertySave: (id) => api.get(`/api/property-saves/${id}/`),
  createPropertySave: (data) => api.post("/api/property-saves/", data),
  updatePropertySave: (id, data) => api.put(`/api/property-saves/${id}/`, data),
  deletePropertySave: (id) => api.delete(`/api/property-saves/${id}/`),
};

export const TenantAPI = {
  getTenants: (params) => api.get("/api/tenant/", { params }),
  getTenant: (id) => api.get(`/api/tenant/${id}/`),
  createTenant: (data) => api.post("/api/tenant/", data),
  updateTenant: (id, data) => api.put(`/api/tenant/${id}/`, data),
  deleteTenant: (id) => api.delete(`/api/tenant/${id}/`),
};

export const OrganizationAPI = {
  getOrganizationStatus: () => api.get(`/api/organizations/status/`),
  getOrganization: () => api.get(`/api/organizations/`),
  UpdateOrganization: (id, data) => api.put(`/api/organizations/${id}/`, data),
};

export const RbacAPI = {
  getRoles: () => api.get("/api/rbac/roles/"),
  getPermissions: () => api.get("/api/rbac/permissions/"),
  UpdatePermission: (id, data) => api.put(`/api/rbac/roles/${id}/`, data),
  UpdateRole: (data) => api.put(`/api/users/${data.id}/roles/`, data),
};

export const PaymentAPI = {
  getSubscriptionPack: () => api.get(`/api/subscription-packs/`),
  createCheckout: (id) => api.post(`/api/create-checkout-session/`, id),
  createCustomerPortal: () => api.post(`/api/create-customer-portal-session/`),
  getTransactionList: () => api.post(`/api/stripe-invoice/`),
  getCurrentPack: () => api.get(`/api/current-subscription/`),
};

export const DashboardAPI = {
  getTotalRevenue: () => api.get(`/api/total-revenue/`),
  getActiveUsers: () => api.get(`/api/active-users/`),
  getAiConversations: () => api.get(`/api/ai-conversations/`),
  getTotalDeals: () => api.get(`/api/total-deals/`),
  getMonthlyProfit: () => api.get(`/api/monthly-profit/`),
  getVoiceCallsCount: () => api.get(`/api/voice-calls-count/`),
  getComplianceStatus: () => api.get(`/api/compliance-status/`),
  getLiveActivityFeed: () => api.get(`/api/live-activity-feed/`),
  getDealCompletions: () => api.get(`/api/deal-completions-scheduling/`),
  getChartData: () => api.get(`/api/revenue-user-growth-chart-data/`),

  // New AI Performance Metrics endpoints
  getVoiceAIMetrics: () => api.get(`/api/voice-calls-count/`),
  getVisionAnalysisMetrics: () => api.get(`/api/vision-analysis/`),
  getNLPProcessingMetrics: () => api.get(`/api/nlp-processing/`),
  getBlockchainMetrics: () => api.get(`/api/blockchain-txns/`),

  // New Tenant Management endpoints
  getTenantStats: () => api.get(`/api/tenant-management/stats/`),
  getRecentTenantActivity: () =>
    api.get(`/api/tenant-management/recent-activity/`),

  // New Opportunity Cost Analysis endpoint
  getOpportunityCostAnalysis: () =>
    api.get(`/api/analytics/opportunity-cost-analysis/`),
  // New AI Accuracy endpoint for Business Metrics
  getAiAccuracy: () => api.get(`/api/ai-metrics/overall-accuracy/`),

  // Optional: Enhanced compliance details
  getComplianceDetails: () => api.get(`/api/compliance-status/details/`),

  // New Market Alerts endpoint
  getMarketAlerts: () => api.get(`/api/market-alerts/recent/`),
};

export default api;
