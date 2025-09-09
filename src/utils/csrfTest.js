// CSRF Test Utility
// import { getCsrfToken } from "../services/api";

export const testCsrfSetup = async () => {
  console.log("🔒 Testing CSRF Setup...");

  try {
    // 1. Fetch CSRF cookie
    console.log("Fetching CSRF cookie...");
    // await getCsrfToken();

    // 2. Check if token is now available
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="));
    console.log("CSRF token after fetch:", token ? "Found" : "Not found");

    if (token) {
      console.log("✅ CSRF setup successful!");
      console.log("Token preview:", token.substring(0, 30) + "...");
    } else {
      console.log("❌ CSRF setup failed - no token found");
    }

    return !!token;
  } catch (error) {
    console.error("❌ CSRF setup error:", error);
    return false;
  }
};
