import React, { useEffect, useState } from "react";
import CreateOrganizationForm from "./add/Form";
import { OrganizationAPI } from "../../services/api";

function AddOrganizationSettings() {
  const [orgState, setOrgState] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchOrganizationHandler = async () => {
      setLoading(true);
      try {
        const response = await OrganizationAPI.getOrganization();
        // console.log("edit", response.data.data);

        setOrgState(response.data.data); // Adjust if your API response is nested differently
      } catch (err) {
        setError("Failed to fetch campaign details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizationHandler();
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Add New Organization Settings
            </h2>
            <p className="text-purple-100">
              Manage your organization's profile and preferences
            </p>
          </div>

          <div className="space-y-6">
            <CreateOrganizationForm orgState={orgState} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddOrganizationSettings;
