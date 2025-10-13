import axios from "axios";

// Base URLs - matching your Django server
// const BASE_URL = "http://localhost:8140";
const BASE_URL = "http://dev.deelflowai.com:8140";
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

const AllGETHeader = axios.create({
  baseURL: BASE_URL, // Use base URL without /api prefix
  // withCredentials: true,
  // credentials: "include", // 👈 REQUIRED for session cookies
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

const AllPOSTHeader = axios.create({
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
  login: (credentials) => AllPOSTHeader.post("/api/auth/login", credentials), // Matches your URL pattern
  register: (userData) => AllPOSTHeader.post("/create-user/", userData), // Matches your URL pattern
  logout: () => api.post("/logout/"),
  getCurrentUser: () => api.get("/user/"),
  getAllUsers: () => api.get("/users/"),
  invite: (data) => api.post("/invitations/", data),
  getInvitation: (invitationtoken) =>
    api.get(`/validate-invitation/?token=${invitationtoken}`),
  inviteeRegister: (userData) => api.post("/invitee-register/", userData),
};

export const leadsAPI = {
  getLeads: (params) => api.get("/leads/", { params }),
  getLead: (id) => api.get(`/leads/${id}/`),
  createLead: (data) => api.post("/leads/", data),
  updateLead: (id, data) => api.put(`/leads/${id}/`, data),
  deleteLead: (id) => api.delete(`/leads/${id}/`),
  getAIScore: (id) => api.get(`/leads/${id}/ai-score/`),
};

export const propertiesAPI = {
  getProperties: (params) => api.get("/properties/", { params }),
  getProperty: (id) => api.get(`/properties/${id}/`),
  createProperty: (data) => api.post("/properties/", data),
  updateProperty: (id, data) => api.put(`/properties/${id}/`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}/`),
  getAIAnalysis: (id) => api.get(`/properties/${id}/ai-analysis/`),
};

export const dealsAPI = {
  getDeals: (params) => api.get("/deals/", { params }),
  getDeal: (id) => api.get(`/deals/${id}/`),
  createDeal: (data) => api.post("/deals/", data),
  updateDeal: (id, data) => api.put(`/deals/${id}/`, data),
  deleteDeal: (id) => api.delete(`/deals/${id}/`),
  getMilestones: (id) => api.get(`/deals/${id}/milestones/`),
};

export const dealMilestonesAPI = {
  getMilestones: (params) => api.get("/deal-milestones/", { params }),
  getMilestone: (id) => api.get(`/deal-milestones/${id}/`),
  createMilestone: (data) => api.post("/deal-milestones/", data),
  updateMilestone: (id, data) => api.put(`/deal-milestones/${id}/`, data),
  deleteMilestone: (id) => api.delete(`/deal-milestones/${id}/`),
  completeMilestone: (id) => api.patch(`/deal-milestones/${id}/complete/`),
};

export const campaignsAPI = {
  getCampaigns: (params) => AllGETHeader.get("/campaigns/", { params }),
  getCampaign: (id) => api.get(`/campaigns/${id}/`),
  createCampaign: (data) => AllPOSTHeader.post("/campaigns/", data),
  updateCampaign: (id, data) => api.put(`/campaigns/${id}/`, data),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}/`),
  getRecipients: (id) => api.get(`/campaigns/${id}/recipients/`),
  getActiveCampaigns: () => AllGETHeader.get("/active_campaign_summary/"),
  getCampaignStats: () => AllGETHeader.get("/campaign_property_stats/"),
  getPerformanceOverview: () =>
    AllGETHeader.get("/campaign_performance_overview/"),
  getChannelResponseRates: () => AllGETHeader.get("/channel_response_rates/"),
  getLeadConversionFunnel: () => AllGETHeader.get("/lead_conversion_funnel/"),
};

export const propertySaveAPI = {
  getPropertySave: (params) => api.get("/property-saves/", { params }),
  getSinglePropertySave: (id) => api.get(`/property-saves/${id}/`),
  createPropertySave: (data) => api.post("/property-saves/", data),
  updatePropertySave: (id, data) => api.put(`/property-saves/${id}/`, data),
  deletePropertySave: (id) => api.delete(`/property-saves/${id}/`),
};

export const TenantAPI = {
  getTenants: (params) => api.get("/tenant/", { params }),
  getTenant: (id) => api.get(`/tenant/${id}/`),
  createTenant: (data) => api.post("/tenant/", data),
  updateTenant: (id, data) => api.put(`/tenant/${id}/`, data),
  deleteTenant: (id) => api.delete(`/tenant/${id}/`),
};

export const OrganizationAPI = {
  getOrganizationStatus: () => api.get(`/organizations/status/`),
  getOrganization: () => api.get(`/organizations/`),
  UpdateOrganization: (id, data) => api.put(`/organizations/${id}/`, data),
};

export const RbacAPI = {
  createRole: (data) => AllPOSTHeader.post("/create_role/", data),
  getRoles: () => AllGETHeader.get("/get_roles/"),
  getPermissions: () => AllGETHeader.get("/get_permissions/"),
  UpdatePermission: (id, data) => AllPOSTHeader.put(`/rbac/roles/${id}/`, data),
  UpdateRole: (data) => AllPOSTHeader.put(`/users/${data.id}/roles/`, data),
  getRoleById: (data) => AllPOSTHeader.post(`/get_role_by_id/`, data),
  deleteRole: (roleId) =>
    AllPOSTHeader.post(`/delete_role`, {
      role_id: roleId,
    }),
};

export const PaymentAPI = {
  getSubscriptionPack: () => api.get(`/subscription-packs/`),
  createCheckout: (id) => api.post(`/create-checkout-session/`, id),
  createCustomerPortal: () => api.post(`/create-customer-portal-session/`),
  getTransactionList: () => api.post(`/stripe-invoice/`),
  getCurrentPack: () => api.get(`/current-subscription/`),
};

export const DashboardAPI = {
  getTotalRevenue: () => api.get(`/total-revenue/`),
  getActiveUsers: () => api.get(`/active-users/`),
  getPropertiesListed: () => api.get(`/properties-listed/`),
  getAiConversations: () => api.get(`/ai-conversations/`),
  getTotalDeals: () => api.get(`/total-deals/`),
  getMonthlyProfit: () => api.get(`/monthly-profit/`),
  getVoiceCallsCount: () => api.get(`/voice-calls-count/`),
  getComplianceStatus: () => api.get(`/compliance-status/`),
  getLiveActivityFeed: () => api.get(`/live-activity-feed/`),
  getDealCompletions: () => api.get(`/deal-completions-scheduling/`),
  getChartData: () => api.get(`/revenue-user-growth-chart-data/`),

  // New AI Performance Metrics endpoints
  getVoiceAIMetrics: () => api.get(`/voice-ai-calls-count/`),
  getVisionAnalysisMetrics: () => api.get(`/vision-analysis/`),
  getNLPProcessingMetrics: () => api.get(`/nlp-processing/`),
  getBlockchainMetrics: () => api.get(`/blockchain-txns/`),

  // New Tenant Management endpoints
  getTenantStats: () => api.get(`/tenant-management/stats/`),
  getRecentTenantActivity: () => AllPOSTHeader.post(`/recent_activity/`),

  // New Opportunity Cost Analysis endpoint
  getOpportunityCostAnalysis: () =>
    api.get(`/analytics/opportunity-cost-analysis/`),
  // New AI Accuracy endpoint for Business Metrics
  getAiAccuracy: () => api.get(`/ai-metrics/overall-accuracy/`),

  // Optional: Enhanced compliance details
  getComplianceDetails: () => api.get(`/compliance-status/details/`),

  // New Market Alerts endpoint
  getMarketAlerts: () => api.get(`/market-alerts/recent/`),
};

export default api;
