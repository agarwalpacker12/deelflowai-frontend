import axios from "axios";

// Base URLs - Use environment variables with fallbacks
// Priority: VITE_API_URL > VITE_API_HOST + VITE_API_PORT > default
const getBaseURL = () => {
  // If VITE_API_URL is set and valid, use it
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'undefined/api') {
    const url = import.meta.env.VITE_API_URL;
    // Remove trailing /api if present (we add it later)
    return url.replace(/\/api\/?$/, '');
  }
  
  // Otherwise, construct from host and port
  const host = import.meta.env.VITE_API_HOST || 'localhost';
  const port = import.meta.env.VITE_API_PORT || '8140';
  
  // Determine protocol based on environment
  const protocol = import.meta.env.MODE === 'production' ? 'http' : 'http';
  
  // For production/dev server, use dev.deelflowai.com
  if (import.meta.env.MODE === 'production' && host === 'localhost') {
    return `http://dev.deelflowai.com:${port}`;
  }
  
  return `${protocol}://${host}:${port}`;
};

const BASE_URL = getBaseURL();
const API_BASE_URL = `${BASE_URL}/api`;

// Debug logging (only in development)
if (import.meta.env.DEV) {
  console.log('=== API Configuration ===');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('VITE_API_HOST:', import.meta.env.VITE_API_HOST);
  console.log('VITE_API_PORT:', import.meta.env.VITE_API_PORT);
  console.log('BASE_URL:', BASE_URL);
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('MODE:', import.meta.env.MODE);
}

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

// const AllPOSTHeader = axios.create({
//   baseURL: BASE_URL, // Use base URL without /api prefix
//   // withCredentials: true,
//   // credentials: "include", // 👈 REQUIRED for session cookies
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     "X-Requested-With": "XMLHttpRequest",
//   },
// });

const AllPOSTHeader = axios.create({
  baseURL: BASE_URL, // Use base URL without /api prefix
  withCredentials: true,
  credentials: "include", // 👈 REQUIRED for session cookies
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

AllPOSTHeader.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
AllGETHeader.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
  register: (userData) => AllPOSTHeader.post("/api/auth/register", userData), // Matches your URL pattern
  logout: () => api.post("/logout/"),
  getCurrentUser: () => api.get("/auth/me/"),
  getAllUsers: (tenantId) => api.get(`/tenants/${tenantId}/users/`),
  invite: (id, data) => api.post(`/tenants/${id}/invitations/`, data),
  getInvitation: (id) => api.get(`/tenants/${id}/invitations`),
  acceptInvitation: (id, data) => api.post(`/invitations/${id}/accept`, data),

  getCurrentUser: () => api.get("/subscription/payment/success"),
};

export const leadsAPI = {
  getLeads: (params) => AllGETHeader.get("/leads/", { params }),
  getLead: (id) => AllGETHeader.get(`/leads/${id}/`),

  createLead: (data) => AllPOSTHeader.post("/leads/", data),
  updateLead: (id, data) => AllPOSTHeader.put(`/leads/${id}/`, data),
  deleteLead: (id) => AllPOSTHeader.delete(`/leads/${id}/`),
  getAIScore: (id) => AllGETHeader.get(`/leads/${id}/ai-score/`),
};

export const propertiesAPI = {
  getProperties: (params) => api.get("/properties/", { params }),
  getProperty: (id) => api.get(`/properties/${id}/`),
  createProperty: (data) => api.post("/properties/", data),
  updateProperty: (id, data) => api.put(`/properties/${id}/`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}/`),
  getAIAnalysis: (id) => api.get(`/properties/${id}/ai-analysis/`),

  getCombinedProperties: (params) =>
    api.get("/properties/combined", { params }),
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
  getCampaign: (id) => AllGETHeader.get(`/campaigns/${id}/`),
  createCampaign: (data) => AllPOSTHeader.post("/campaigns/", data),
  updateCampaign: (id, data) => AllPOSTHeader.put(`/campaigns/${id}/`, data),
  deleteCampaign: (id) => AllPOSTHeader.delete(`/campaigns/${id}/`),
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
  getTenants: (params) => api.get("/admin/tenants/", { params }),
  getTenant: (id) => api.get(`/admin/tenants/${id}/`),
  createTenant: (data) => api.post("/admin/tenants/", data),
  updateTenant: (id, data) => api.put(`/admin/tenants/${id}/`, data),
  suspendTenant: (data) =>
    api.post(`/admin/tenants/${data.tenant_id}/suspend/`),
  activateTenant: (data) =>
    api.post(`/admin/tenants/${data.tenant_id}/activate/`),
};

export const OrganizationAPI = {
  getOrganizationStatus: () => api.get(`/organizations/status/`),
  getOrganization: () => api.get(`/organizations/`),
  UpdateOrganization: (id, data) => api.put(`/organizations/${id}/`, data),
};

export const RbacAPI = {
  createRole: (data) => api.post("/roles/", data),
  getRoles: () => api.get("/roles/"),
  getPermissions: () => api.get("/permissions/"),
  UpdatePermission: (id, data) => api.put(`/roles/${id}/`, data),
  AssignUser: (data) =>
    api.post(`/roles/${data.role_id}/assign-user/${data.user_id}`, data),
  getRoleById: (id) => api.get(`/roles/${id}`),
  deleteRole: (roleId) => api.delete(`/roles/${roleId}`),

  getTenantRoles: (id) => api.get(`/tenants/${id}/roles`),
  createTenantRole: (data) =>
    api.post(`/tenants/${data.tenant_id}/roles`, data),
};

export const PaymentAPI = {
  getSubscriptionPack: () => AllPOSTHeader.get(`/subscription-packs/`),
  createCheckout: (id) => AllPOSTHeader.post(`/create-checkout-session/`, id),
  createCustomerPortal: () =>
    AllPOSTHeader.post(`/create-customer-portal-session/`),
  getTransactionList: () => AllPOSTHeader.post(`/stripe-invoice/`),
  getCurrentPack: () => AllPOSTHeader.get(`/current-subscription/`),
  getPacks: () => api.get(`/plans`),
  getPaymentResponse: () => api.get(`/subscription/payment/success`),
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

export const geographicAPI = {
  getCountries: (search) => {
    const params = search ? { search } : {};
    return AllGETHeader.get("/api/countries/", { params });
  },
  getStatesByCountry: (countryId, search) => {
    const params = search ? { search } : {};
    return AllGETHeader.get(`/api/countries/${countryId}/states/`, { params });
  },
  getCitiesByState: (stateId, search, page = 1, perPage = 50) => {
    // Ensure stateId is a number
    const numericStateId = parseInt(stateId, 10);
    if (isNaN(numericStateId)) {
      return Promise.reject(new Error(`Invalid state ID: ${stateId}`));
    }
    const params = { page, per_page: perPage };
    if (search) params.search = search;
    return AllGETHeader.get(`/api/states/${numericStateId}/cities/`, { params });
  },
};

export default api;
