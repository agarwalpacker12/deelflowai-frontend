// navigationConfig.js
// Complete navbar permission management for temporary soft launch

/**
 * Permission-based Navigation Configuration
 * This file implements navbar-level permission management for the soft launch
 *
 * IMPORTANT: This is a TEMPORARY solution for soft launch.
 * The final implementation will use route-level permission guards.
 */

// ==================== PERMISSION HELPER ====================

/**
 * Check if user has a specific permission
 * @param {string} permissionName - The permission name to check
 * @param {Array<string>} userPermissions - Array of user's permissions
 * @returns {boolean}
 */
export const hasPermission = (permissionName, userPermissions = []) => {
  if (!permissionName) return true; // No permission required, show it
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return userPermissions.includes(permissionName);
};

/**
 * Filter menu items by permission
 * @param {Array} menuItems - Array of menu items with has_permission property
 * @param {Array<string>} userPermissions - Array of user's permissions
 * @returns {Array} - Filtered menu items
 */
export const filterByPermission = (menuItems, userPermissions = []) => {
  return menuItems.filter((item) => {
    // If no permission required, show it
    if (!item.has_permission) return true;
    // Check if user has the required permission
    return hasPermission(item.has_permission, userPermissions);
  });
};

// ==================== NAVIGATION LINKS CONFIGURATION ====================

/**
 * Top Level Navigation Links
 */
export const topLevelNavLinks = [
  {
    to: "/app/dashboard",
    label: "Dashboard",
    has_permission: "view_dashboard",
  },
  {
    to: "/app/analytics",
    label: "Analytics",
    has_permission: "view_analytics",
  },
  {
    to: "/app/psychology",
    label: "Psychological Dashboard",
    has_permission: "view_dashboard", // Using dashboard permission
  },
];

/**
 * Property List Navigation Links
 */
export const propertyNavLinks = [
  {
    to: "/app/properties",
    label: "Property List",
    has_permission: "view_properties",
  },
];

/**
 * Marketplace Navigation Links
 */
export const marketplaceNavLinks = [
  {
    to: "/app/live-activity",
    label: "Live Feed",
    has_permission: "view_deals",
  },
  {
    to: "/app/deals",
    label: "Deals",
    has_permission: "view_deals",
  },
  {
    to: "/app/transaction",
    label: "Transaction",
    has_permission: "view_deals",
  },
  {
    to: "/app/Funding Partners",
    label: "Funding",
    has_permission: "view_deals",
  },
  {
    to: "/app/pricing",
    label: "Pricing",
    has_permission: "view_subscription",
  },
];

/**
 * Marketing Hub Navigation Links
 */
export const marketingHubNavLinks = [
  {
    to: "/app/campaigns",
    label: "Campaigns",
    has_permission: "view_campaigns",
  },
  {
    to: "/app/content-management",
    label: "Content Management",
    has_permission: "view_campaigns",
  },
  {
    to: "/app/duplicate",
    label: "Duplicate Management",
    has_permission: "view_leads",
  },
  {
    to: "/app/leads",
    label: "Leads",
    has_permission: "view_leads",
  },
  {
    to: "/app/clients",
    label: "Clients",
    has_permission: "view_leads",
  },
  {
    to: "/app/marketing/advanced",
    label: "Advanced",
    has_permission: "view_campaigns",
  },
  {
    to: "/app/marketing/contacts",
    label: "Contacts",
    has_permission: "view_leads",
  },
  {
    to: "/app/marketing/communications",
    label: "Communications",
    has_permission: "view_campaigns",
  },
];

/**
 * AI Features Navigation Links
 */
export const aiFeatureNavLinks = [
  {
    to: "/app/ai/vision",
    label: "Vision AI",
    has_permission: "use_vision_ai",
  },
  {
    to: "/app/ai/voice",
    label: "Voice AI",
    has_permission: "use_voice_ai",
  },
  {
    to: "/app/ai/nlp-center",
    label: "NLP Center",
    has_permission: "use_ai_services",
  },
];

/**
 * Analytics & Reports Navigation Links
 */
export const analyticsReportsNavLinks = [
  {
    to: "/app/reports/overview",
    label: "Overview",
    has_permission: "view_analytics",
  },
  {
    to: "/app/reports/custom",
    label: "Custom Reports",
    has_permission: "view_analytics",
  },
  {
    to: "/app/reports/data-export",
    label: "Data Exports",
    has_permission: "view_analytics",
  },
];

/**
 * System Settings Navigation Links
 */
export const systemSettingsNavLinks = [
  {
    to: "/app/system/general",
    label: "General",
    has_permission: "manage_organization",
  },
  {
    to: "/app/system/security",
    label: "Security",
    has_permission: "manage_organization",
  },
  {
    to: "/app/system/notification",
    label: "Notification",
    has_permission: "manage_organization",
  },
  {
    to: "/app/system/backup",
    label: "Backup",
    has_permission: "manage_organization",
  },
];

/**
 * AI Management Navigation Links
 */
export const aiManagementNavLinks = [
  {
    to: "/app/ai-management/conversation",
    label: "AI Conversation",
    has_permission: "use_ai_services",
  },
  {
    to: "/app/ai-management/training",
    label: "Training",
    has_permission: "use_ai_services",
  },
  {
    to: "/app/ai-management/automation-rule",
    label: "Automation Rules",
    has_permission: "use_ai_services",
  },
];

/**
 * Integration Navigation Links
 */
export const integrationNavLinks = [
  {
    to: "/app/integrations/api",
    label: "API Keys",
    has_permission: "manage_organization",
  },
  {
    to: "/app/payment-gateway",
    label: "Payment Methods",
    has_permission: "manage_subscription",
  },
  {
    to: "/app/integrations/webhooks",
    label: "Webhooks",
    has_permission: "manage_organization",
  },
  {
    to: "/app/integrations/third-party",
    label: "Third Party Apps",
    has_permission: "manage_organization",
  },
];

/**
 * Base Settings Navigation Links (for admins/tenancy admins)
 */
export const baseSettingsNavLinks = [
  {
    to: "/app/org-settings",
    label: "Organization Settings",
    has_permission: "manage_tenant",
  },
  {
    to: "/app/user-management",
    label: "User Management",
    has_permission: "invite_users",
  },
  {
    to: "/app/billing",
    label: "Billing & Subscription",
    has_permission: "view_subscription",
  },
  {
    to: "/app/page-management",
    label: "Page Management",
    has_permission: "manage_tenant",
  },
];

/**
 * Super Admin Only Settings Navigation Links
 */
export const super_adminSettingsNavLinks = [
  {
    to: "/app/ai-settings",
    label: "AI Settings",
    has_permission: "manage_organization",
  },
];

/**
 * SAAS Management Navigation Links (Super Admin Only)
 */
export const saasManagementNavLinks = [
  {
    to: "/app/role-management",
    label: "Role Management",
    has_permission: "manage_organization",
  },
  {
    to: "/app/pricing",
    label: "Pricing Plans",
    has_permission: "manage_organization",
  },
  {
    to: "/app/billing",
    label: "Billing Settings",
    has_permission: "manage_organization",
  },
  {
    to: "/app/revenue",
    label: "Revenue Analytics",
    has_permission: "manage_organization",
  },
  {
    to: "/app/subscription",
    label: "Subscription",
    has_permission: "manage_organization",
  },
];

/**
 * White Label Navigation Links (Super Admin Only)
 */
export const whiteLabelNavLinks = [
  {
    to: "/app/tenant-management",
    label: "Tenant Management",
    has_permission: "manage_organization",
  },
  {
    to: "/app/white-label/branding-settings",
    label: "Branding Settings",
    has_permission: "manage_organization",
  },
  {
    to: "/app/white-label/domain-management",
    label: "Domain Management",
    has_permission: "manage_organization",
  },
];

/**
 * Landing Page Builder Navigation Links (Super Admin Only)
 */
export const landingPageBuilderNavLinks = [
  {
    to: "/app/landing-page-builder/templates",
    label: "Templates",
    has_permission: "manage_organization",
  },
  {
    to: "/app/landing-page-builder/page-builder",
    label: "Page Builder",
    has_permission: "manage_organization",
  },
  {
    to: "/app/landing-page-builder/ab-testing",
    label: "A/B Testing",
    has_permission: "manage_organization",
  },
];

// ==================== NAVIGATION HOOK ====================

/**
 * Custom hook to get filtered navigation links based on user permissions
 * @param {Array<string>} userPermissions - Array of user's permissions from login response
 * @returns {Object} - Object containing all filtered navigation link arrays
 */
export const useFilteredNavigation = (userPermissions = []) => {
  // Get user permissions from localStorage or context
  // If userPermissions not provided, try to get from user context/state

  return {
    topLevelNavLinks: filterByPermission(topLevelNavLinks, userPermissions),
    propertyNavLinks: filterByPermission(propertyNavLinks, userPermissions),
    marketplaceNavLinks: filterByPermission(
      marketplaceNavLinks,
      userPermissions
    ),
    marketingHubNavLinks: filterByPermission(
      marketingHubNavLinks,
      userPermissions
    ),
    aiFeatureNavLinks: filterByPermission(aiFeatureNavLinks, userPermissions),
    analyticsReportsNavLinks: filterByPermission(
      analyticsReportsNavLinks,
      userPermissions
    ),
    systemSettingsNavLinks: filterByPermission(
      systemSettingsNavLinks,
      userPermissions
    ),
    aiManagementNavLinks: filterByPermission(
      aiManagementNavLinks,
      userPermissions
    ),
    integrationNavLinks: filterByPermission(
      integrationNavLinks,
      userPermissions
    ),
    baseSettingsNavLinks: filterByPermission(
      baseSettingsNavLinks,
      userPermissions
    ),
    super_adminSettingsNavLinks: filterByPermission(
      super_adminSettingsNavLinks,
      userPermissions
    ),
    saasManagementNavLinks: filterByPermission(
      saasManagementNavLinks,
      userPermissions
    ),
    whiteLabelNavLinks: filterByPermission(whiteLabelNavLinks, userPermissions),
    landingPageBuilderNavLinks: filterByPermission(
      landingPageBuilderNavLinks,
      userPermissions
    ),
  };
};

// ==================== USAGE EXAMPLE ====================

/**
 * Example usage in a Navbar component:
 *
 * import { useFilteredNavigation } from './navigationConfig';
 * import { useSelector } from 'react-redux'; // or use your state management
 *
 * function Navbar() {
 *   // Get user permissions from your auth state/context
 *   const user = useSelector(state => state.auth.user);
 *   const userPermissions = user?.permissions || [];
 *
 *   // Get filtered navigation links
 *   const {
 *     topLevelNavLinks,
 *     propertyNavLinks,
 *     marketplaceNavLinks,
 *     // ... etc
 *   } = useFilteredNavigation(userPermissions);
 *
 *   return (
 *     <nav>
 *       {topLevelNavLinks.map(link => (
 *         <Link key={link.to} to={link.to}>{link.label}</Link>
 *       ))}
 *       {/* ... render other nav sections */
// }
//    *     </nav>
//    *   );
//    * }
//    */
// ==================== PERMISSION MAPPING REFERENCE ====================

/**
 * Permission Name Reference:
 *
 * Dashboard & Analytics:
 * - view_dashboard: Access to dashboard
 * - view_analytics: Access to analytics and reports
 *
 * Properties:
 * - view_properties: Access to property list and details
 *
 * Deals & Marketplace:
 * - view_deals: Access to deals, transactions, marketplace
 *
 * Marketing:
 * - view_campaigns: Access to campaigns and marketing tools
 * - view_leads: Access to leads, clients, contacts
 *
 * AI Features:
 * - use_vision_ai: Access to Vision AI features
 * - use_voice_ai: Access to Voice AI features
 * - use_ai_services: Access to AI services (NLP, AI management, etc.)
 *
 * Organization Management:
 * - manage_organization: Super admin level access (SAAS management, white label, etc.)
 * - manage_tenant: Tenant/organization settings management
 * - invite_users: Ability to invite users
 *
 * Subscription:
 * - view_subscription: View subscription details
 * - manage_subscription: Manage subscription and billing
 */

export default {
  hasPermission,
  filterByPermission,
  useFilteredNavigation,
  // Export all navigation links for direct use if needed
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
};
