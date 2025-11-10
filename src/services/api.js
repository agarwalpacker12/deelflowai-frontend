import axios from "axios";

// Base URLs - Use environment variables with fallbacks
// Priority: VITE_API_URL > VITE_API_HOST + VITE_API_PORT > default
const getBaseURL = () => {
  // For development mode, prefer localhost unless explicitly set to dev server
  const isDevelopment = import.meta.env.MODE === 'development';
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // If VITE_API_URL is set and valid, check if we should override it for local dev
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'undefined/api') {
    const url = import.meta.env.VITE_API_URL;
    
    // If running locally in development and URL points to dev server, use localhost instead
    if (isDevelopment && isLocalhost && url.includes('dev.deelflowai.com')) {
      const port = import.meta.env.VITE_API_PORT || '8140';
      console.log('🔄 Overriding dev server URL for local development. Using localhost instead.');
      return `http://localhost:${port}`;
    }
    
    // Remove trailing /api if present (we add it later)
    return url.replace(/\/api\/?$/, '');
  }
  
  // Otherwise, construct from host and port
  const host = import.meta.env.VITE_API_HOST || 'localhost';
  const port = import.meta.env.VITE_API_PORT || '8140';
  
  // Determine protocol based on environment
  const protocol = 'http';
  
  // For development mode, default to localhost
  // For production mode, use dev.deelflowai.com if host is still localhost
  if (import.meta.env.MODE === 'production' && host === 'localhost') {
    return `http://dev.deelflowai.com:${port}`;
  }
  
  // For development, use localhost
  if (import.meta.env.MODE === 'development' && host === 'localhost') {
    return `http://localhost:${port}`;
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
  updateProfile: (profileData) => api.put("/auth/profile", profileData),
  changePassword: (passwordData) => api.put("/auth/change-password", passwordData),
  getAllUsers: (tenantId) => api.get(`/tenants/${tenantId}/users/`),
  invite: (id, data) => api.post(`/tenants/${id}/invitations/`, data),
  getInvitation: (id) => api.get(`/tenants/${id}/invitations`),
  acceptInvitation: (id, data) => api.post(`/invitations/${id}/accept`, data),
  getAllUsersForSuperAdmin: () => api.get(`/users/`),
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
  generateAIEmail: (campaignData, recipientInfo = null, generateSubject = true, generateContent = true) =>
    AllPOSTHeader.post("/campaigns/generate-ai-email/", {
      campaign_data: campaignData,
      recipient_info: recipientInfo,
      generate_subject: generateSubject,
      generate_content: generateContent,
    }),
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

  AssignUserTenant: (data) => api.post(`/admin/tenants/assign-user`, data),
};

export const OrganizationAPI = {
  getOrganizationStatus: () => api.get(`/organizations/status/`),
  getOrganization: () => api.get(`/organizations/`),
  getCurrentOrganization: () => api.get(`/organization/`),
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

// Geographic Data API
export const geographicAPI = {
  // Get all countries
  getCountries: async (search = null) => {
    const params = search ? { search } : {};
    const response = await AllGETHeader.get('/api/countries/', { params });
    return response.data;
  },

  // Get states by country ID
  getStatesByCountry: async (countryId, search = null) => {
    const params = search ? { search } : {};
    const response = await AllGETHeader.get(`/api/countries/${countryId}/states/`, { params });
    return response.data;
  },

  // Get cities by state ID (fetches all cities with pagination if needed)
  getCitiesByState: async (stateId, search = null) => {
    let allCities = [];
    let page = 1;
    let hasMore = true;
    const perPage = 500; // Maximum allowed by backend
    
    while (hasMore) {
      const params = { page, per_page: perPage };
      if (search) params.search = search;
      
      try {
        const response = await AllGETHeader.get(`/api/states/${stateId}/cities/`, { params });
        const data = response.data;
        
        if (data?.status === 'success' && data?.data) {
          allCities = [...allCities, ...data.data];
          
          // Check if there are more pages
          if (data.total_pages && page < data.total_pages) {
            page++;
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
    }
    
    // Return in the same format as other endpoints
    return {
      status: 'success',
      data: allCities,
      total: allCities.length
    };
  }
};

// Content Management API
export const contentAPI = {
  // Get all content with filtering, search, and pagination
  getContentList: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      per_page: filters.per_page || 50,
    };
    if (filters.search) params.search = filters.search;
    if (filters.content_type) params.content_type = filters.content_type;
    if (filters.status) params.status = filters.status;
    
    const response = await api.get('/content/', { params });
    return response.data;
  },

  // Get single content by ID
  getContent: async (contentId) => {
    const response = await api.get(`/content/${contentId}/`);
    return response.data;
  },

  // Create new content
  createContent: async (contentData) => {
    const response = await api.post('/content/', contentData);
    return response.data;
  },

  // Update content
  updateContent: async (contentId, contentData) => {
    const response = await api.put(`/content/${contentId}/`, contentData);
    return response.data;
  },

  // Delete content
  deleteContent: async (contentId) => {
    const response = await api.delete(`/content/${contentId}/`);
    return response.data;
  },

  // Publish content
  publishContent: async (contentId) => {
    const response = await api.post(`/content/${contentId}/publish/`);
    return response.data;
  },

  // Duplicate content
  duplicateContent: async (contentId) => {
    const response = await api.post(`/content/${contentId}/duplicate/`);
    return response.data;
  },

  // Template Management
  // Get all templates
  getTemplates: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      per_page: filters.per_page || 50,
    };
    if (filters.search) params.search = filters.search;
    if (filters.template_type) params.template_type = filters.template_type;
    if (filters.is_predefined !== undefined) params.is_predefined = filters.is_predefined;
    
    const response = await api.get('/content/templates/', { params });
    return response.data;
  },

  // Get single template by ID
  getTemplate: async (templateId) => {
    const response = await api.get(`/content/templates/${templateId}/`);
    return response.data;
  },

  // Create template
  createTemplate: async (templateData) => {
    const response = await api.post('/content/templates/', templateData);
    return response.data;
  },

  // Update template
  updateTemplate: async (templateId, templateData) => {
    const response = await api.put(`/content/templates/${templateId}/`, templateData);
    return response.data;
  },

  // Delete template
  deleteTemplate: async (templateId) => {
    const response = await api.delete(`/content/templates/${templateId}/`);
    return response.data;
  },

  // Use template to create content
  useTemplate: async (templateId, templateVariables, contentData = null) => {
    const requestBody = {
      template_variables: templateVariables,
      content_data: contentData
    };
    const response = await api.post(`/content/templates/${templateId}/use/`, requestBody);
    return response.data;
  },

  // AI Content Generation
  generateAIContent: async (generateData) => {
    const response = await api.post('/content/generate/', generateData);
    return response.data;
  },

  // Calendar Management
  // Get content calendar
  getCalendar: async (filters = {}) => {
    const params = {};
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    if (filters.status) params.status = filters.status;
    
    const response = await api.get('/content/calendar/', { params });
    return response.data;
  },

  // Schedule content
  scheduleContent: async (scheduleData) => {
    const response = await api.post('/content/calendar/', scheduleData);
    return response.data;
  },

  // Update schedule
  updateSchedule: async (calendarId, scheduleData) => {
    const response = await api.put(`/content/calendar/${calendarId}/`, scheduleData);
    return response.data;
  },

  // Cancel schedule
  cancelSchedule: async (calendarId) => {
    const response = await api.delete(`/content/calendar/${calendarId}/`);
    return response.data;
  },

  // Analytics
  // Get analytics overview
  getAnalyticsOverview: async (filters = {}) => {
    const params = {};
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    
    const response = await api.get('/content/analytics/overview/', { params });
    return response.data;
  },

  // Get performance metrics
  getPerformanceMetrics: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      per_page: filters.per_page || 50,
    };
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    if (filters.content_type) params.content_type = filters.content_type;
    
    const response = await api.get('/content/analytics/performance/', { params });
    return response.data;
  },

  // Get content-specific analytics
  getContentAnalytics: async (contentId, filters = {}) => {
    const params = {};
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    
    const response = await api.get(`/content/${contentId}/analytics/`, { params });
    return response.data;
  }
};

export default api;
