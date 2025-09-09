import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

// Store
import { store } from "./store/store";

// Environment test
import { testEnvVars } from "./utils/envTest";

// API utilities
// import { getCsrfToken } from "./services/api";
import { testCsrfSetup } from "./utils/csrfTest";

// Contexts
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { Web3Provider } from "./contexts/Web3Context.jsx";
import { PsychologyProvider } from "./contexts/PsychologyContext.jsx";
import { AIProvider } from "./contexts/AIContext.jsx";

// Components
import Layout from "./components/Layout/Layout.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import LoadingSpinner from "./components/UI/LoadingSpinner.jsx";

// Pages
import LandingPage from "./pages/Landing/LandingPage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import LeadsPage from "./pages/Leads/LeadsPage.jsx";
import PropertiesPage from "./pages/Properties/PropertiesPage.jsx";
import DealsPage from "./pages/Deals/DealsPage.jsx";
import CampaignsPage from "./pages/Campaigns/CampaignsPage.jsx";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";

// Styles
import "./index.css";
import AddLead from "./pages/Leads/add/index.jsx";
import EditLead from "./pages/Leads/[id]/index.jsx";

import AddProperty from "./pages/Properties/add/index.jsx";
import AddDealsMilestone from "./pages/Deals_Milestone/add/index.jsx";
import DealsMileStonePage from "./pages/Deals_Milestone/DealsMilestonePage.jsx";

import AddCampaign from "./pages/Campaigns/add/index.jsx";
import CampaignsRecipientPage from "./pages/Campaigns_Recipients/RecipientPage.jsx";
import AchievementsTable from "./pages/Achievement/AchievementPage.jsx";
import AddAchievement from "./pages/Achievement/add/index.jsx";
import EditProperty from "./pages/Properties/[id]/index.jsx";
import VycentraPaymentGateway from "./pages/Payment.jsx";
import BidIndex from "./pages/Properties/[id]/bid/BidIndex.jsx";
import EditCampaign from "./pages/Campaigns/[id]/index.jsx";
import AnalyticsPage from "./pages/Analytics/page.jsx";
import ContentManagementPage from "./pages/Content_Management/page.jsx";
import ClientPage from "./pages/Client/page.jsx";
import AdvancedPage from "./pages/Advance/page.jsx";
import AiSettingsPage from "./pages/Ai-settings/page.jsx";
import LiveActivityPage from "./pages/LiveActivity/page.jsx";
import TenantManagementPage from "./pages/TenantManagement/page.jsx";
import RoleManagementPage from "./pages/RoleManagement/page.jsx";
import BillingPage from "./pages/Billing/page.jsx";
import OrganizationSettingsPage from "./pages/Settings/SettingsPage.jsx";

import InviteeRegister from "./pages/Auth/InviteRegister.jsx";
import PaymentAfterLogin from "./pages/payment/page.jsx";
import UserManagement from "./pages/User/page.jsx";
import InvitationForm from "./pages/UserManagement/page.jsx";
import PaymentSuccess from "./pages/payment/PaymentSuccess.jsx";
import PaymentFailedPage from "./pages/payment/PaymentFailed.jsx";
import Invoice from "./pages/payment/_Invoice.jsx";
import CompletePsychologicalDashboard from "./pages/Psychology/PsychologyDashboard.jsx";
import VisionAiPage from "./pages/AI/Vision/VisionAiPage.jsx";
import VoiceAiPage from "./pages/AI/Voice/VoiceAiPage.jsx";
import NlpAiPage from "./pages/AI/nlp/NlpAiPage.jsx";
import DuplicateManagementDashboard from "./pages/Duplicate/page.jsx";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  // Initialize app on load
  useEffect(() => {
    const initializeApp = async () => {
      // Test environment variables
      testEnvVars();

      // Initialize and test CSRF setup for Laravel Sanctum
      try {
        // await getCsrfToken();
        // console.log("CSRF cookie initialized successfully");
        // Run CSRF test in development
        // if (process.env.NODE_ENV === "development") {
        //   await testCsrfSetup();
        // }
      } catch (error) {
        console.error("Failed to initialize CSRF cookie:", error);
      }
    };

    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Web3Provider>
          <AuthProvider>
            <PsychologyProvider>
              <AIProvider>
                <Router>
                  <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
                    <AnimatePresence mode="wait">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                          path="/pay"
                          element={<VycentraPaymentGateway />}
                        />
                        {/* <Route
                          path="/comingsoon"
                          element={<ComingSoonPage />}
                        /> */}

                        {/* Protected Routes */}
                        <Route
                          path="/app"
                          element={
                            <ProtectedRoute>
                              <Layout />
                            </ProtectedRoute>
                          }
                        >
                          <Route
                            index
                            element={<Navigate to="/app/dashboard" replace />}
                          />

                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="leads" element={<LeadsPage />} />
                          <Route path="leads/add" element={<AddLead />} />
                          <Route path="leads/:id" element={<EditLead />} />

                          <Route
                            path="properties"
                            element={<PropertiesPage />}
                          />
                          <Route
                            path="properties/add"
                            element={<AddProperty />}
                          />
                          <Route
                            path="properties/:id"
                            element={<EditProperty />}
                          />

                          <Route path="deals" element={<DealsPage />} />
                          <Route
                            path="properties/:propertyId/bid"
                            element={<BidIndex />}
                          />

                          <Route
                            path="milestone"
                            element={<DealsMileStonePage />}
                          />
                          <Route
                            path="milestone/add"
                            element={<AddDealsMilestone />}
                          />
                          <Route path="ai/vision" element={<VisionAiPage />} />
                          <Route path="ai/voice" element={<VoiceAiPage />} />
                          <Route path="ai/nlp-center" element={<NlpAiPage />} />

                          <Route path="campaigns" element={<CampaignsPage />} />
                          <Route
                            path="campaigns/add"
                            element={<AddCampaign />}
                          />
                          <Route
                            path="campaigns/:id"
                            element={<EditCampaign />}
                          />
                          <Route
                            path="duplicate"
                            element={<DuplicateManagementDashboard />}
                          />
                          <Route
                            path="recipients"
                            element={<CampaignsRecipientPage />}
                          />

                          <Route
                            path="achievements/add"
                            element={<AddAchievement />}
                          />
                          <Route
                            path="achievements"
                            element={<AchievementsTable />}
                          />
                          <Route path="profile" element={<ProfilePage />} />
                          <Route path="analytics" element={<AnalyticsPage />} />
                          <Route
                            path="content-management"
                            element={<ContentManagementPage />}
                          />
                          <Route path="clients" element={<ClientPage />} />
                          <Route
                            path="marketing/advanced"
                            element={<AdvancedPage />}
                          />
                          <Route
                            path="ai-settings"
                            element={<AiSettingsPage />}
                          />
                          <Route
                            path="settings"
                            element={<OrganizationSettingsPage />}
                          />
                          <Route
                            path="live-activity"
                            element={<LiveActivityPage />}
                          />
                          <Route
                            path="tenant-management"
                            element={<TenantManagementPage />}
                          />
                          <Route
                            path="user-management"
                            element={<UserManagement />}
                          />
                          <Route path="invite" element={<InvitationForm />} />
                          <Route
                            path="role-management"
                            element={<RoleManagementPage />}
                          />
                          <Route path="billing" element={<BillingPage />} />
                          <Route
                            path="invitee-register"
                            element={<InviteeRegister />}
                          />
                          <Route
                            path="payment"
                            element={<PaymentAfterLogin />}
                          />
                          <Route
                            path="payment-success"
                            element={<PaymentSuccess />}
                          />
                          <Route
                            path="payment-cancel"
                            element={<PaymentFailedPage />}
                          />
                          <Route path="invoice" element={<Invoice />} />
                          <Route
                            path="psychology"
                            element={<CompletePsychologicalDashboard />}
                          />
                          {/* <Route
                            path="marketplace"
                            element={<MarketplacePage />}
                          />

                          <Route
                            path="blockchain"
                            element={<BlockchainPage />}
                          />
                          <Route path="analytics" element={<AnalyticsPage />} />
                          <Route
                            path="psychology"
                            element={<PsychologyDashboard />}
                          />
                          <Route path="profile" element={<ProfilePage />} />
                          <Route path="settings" element={<SettingsPage />} />
                          <Route
                            path="white-label"
                            element={<WhiteLabelPage />}
                          /> */}
                        </Route>

                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </AnimatePresence>

                    {/* Global Toast Notifications */}
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: "rgba(15, 23, 42, 0.95)",
                          color: "#fff",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          backdropFilter: "blur(10px)",
                        },
                        success: {
                          iconTheme: {
                            primary: "#10b981",
                            secondary: "#fff",
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: "#ef4444",
                            secondary: "#fff",
                          },
                        },
                      }}
                    />

                    {/* Global Loading Overlay */}
                    <LoadingSpinner />
                  </div>
                </Router>
              </AIProvider>
            </PsychologyProvider>
          </AuthProvider>
        </Web3Provider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
