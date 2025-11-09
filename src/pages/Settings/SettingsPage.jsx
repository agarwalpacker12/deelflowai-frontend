import React, { useState, useEffect } from "react";
import { authAPI, TenantAPI, RbacAPI } from "../../services/api";

function OrganizationSettingsPage() {
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [tenantRoles, setTenantRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTenantRoles, setLoadingTenantRoles] = useState(false);
  const [error, setError] = useState(null);

  // Form state for assigning user
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedTenantRoleId, setSelectedTenantRoleId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user details from localStorage
        const userDetails = JSON.parse(localStorage.getItem("user") || "{}");
        const tenantId = userDetails.tenant_id;

        // Fetch all users
        const usersResponse = await authAPI.getAllUsersForSuperAdmin();
        setUsers(usersResponse.data.data.users);

        // Fetch tenants data
        const tenantsResponse = await TenantAPI.getTenants();
        setTenants(tenantsResponse.data.data.tenants);

        // Fetch all roles
        // const rolesResponse = await RbacAPI.getTenantRoles();
        // setRoles(rolesResponse.data.data.roles);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch tenant-specific roles when tenant is selected
  useEffect(() => {
    const fetchTenantRoles = async () => {
      if (!selectedTenantId) {
        setTenantRoles([]);
        return;
      }

      try {
        setLoadingTenantRoles(true);
        const response = await RbacAPI.getTenantRoles(selectedTenantId);
        setTenantRoles(response.data.data.roles);
      } catch (err) {
        console.error("Error fetching tenant roles:", err);
        setTenantRoles([]);
      } finally {
        setLoadingTenantRoles(false);
      }
    };

    fetchTenantRoles();
  }, [selectedTenantId]);

  const handleTenantChange = (e) => {
    const tenantId = e.target.value;
    setSelectedTenantId(tenantId || null);
  };

  const handleAssignUser = async (e) => {
    e.preventDefault();

    // Use tenant role if selected, otherwise use general role
    const roleToAssign = selectedTenantRoleId || selectedRoleId;

    if (!selectedUserId || !selectedTenantId || !roleToAssign) {
      alert("Please select a user, tenant, and role");
      return;
    }

    try {
      setAssignLoading(true);
      setAssignSuccess(false);

      const payload = {
        user_id: selectedUserId,
        tenant_id: selectedTenantId,
        role_id: roleToAssign,
      };

      await TenantAPI.AssignUserTenant(payload);

      setAssignSuccess(true);
      setSelectedUserId("");
      setSelectedRoleId("");
      setSelectedTenantRoleId("");

      setTimeout(() => {
        setAssignSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error assigning user:", err);
      alert(err.response?.data?.message || "Failed to assign user");
    } finally {
      setAssignLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Organization Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">
            Users ({users.length})
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          >
            <option value="" className="bg-slate-800">
              Select a user
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id} className="bg-slate-800">
                {user.email || user.username || user.name || `User ${user.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Tenants Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">
            Tenants ({tenants.length})
          </label>
          <select
            value={selectedTenantId || ""}
            onChange={handleTenantChange}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          >
            <option value="" className="bg-slate-800">
              Select a tenant
            </option>
            {tenants.map((tenant) => (
              <option
                key={tenant.id}
                value={tenant.id}
                className="bg-slate-800"
              >
                {tenant.name ||
                  tenant.organization_name ||
                  `Tenant ${tenant.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Roles Dropdown */}
      </div>

      {/* Tenant Roles Section */}
      {selectedTenantId && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Tenant Roles
            {loadingTenantRoles && (
              <span className="text-sm font-normal text-white/60 ml-2">
                Loading...
              </span>
            )}
          </h2>
          {!loadingTenantRoles && (
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
              {tenantRoles.length > 0 ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">
                    Select Role from Tenant Roles
                  </label>
                  <select
                    value={selectedTenantRoleId}
                    onChange={(e) => setSelectedTenantRoleId(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  >
                    <option value="" className="bg-slate-800">
                      Select a tenant role
                    </option>
                    {tenantRoles.map((role) => (
                      <option
                        key={role.id}
                        value={role.id}
                        className="bg-slate-800"
                      >
                        {role.name || `Role ${role.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="text-white/60">No roles found for this tenant.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Assign User Button */}
      <div className="mt-6">
        <button
          onClick={handleAssignUser}
          disabled={
            assignLoading ||
            !selectedUserId ||
            !selectedTenantId ||
            (!selectedRoleId && !selectedTenantRoleId)
          }
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {assignLoading ? "Assigning..." : "Assign User to Tenant"}
        </button>
        {assignSuccess && (
          <span className="ml-4 text-green-400 font-medium">
            ✓ User assigned successfully!
          </span>
        )}
      </div>
    </div>
  );
}

export default OrganizationSettingsPage;
