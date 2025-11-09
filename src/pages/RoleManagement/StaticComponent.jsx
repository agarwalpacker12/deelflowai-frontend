import React, { useEffect, useState, useCallback } from "react";
import AddForm from "./add/AddForm";
import { RbacAPI } from "../../services/api";
import toast from "react-hot-toast";

function StaticComponent({ setSelectedPermissions, setSelectedRoleId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ new loading state

  // ✅ useCallback to avoid redefining on every render
  // const fetchRoles = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const response = await RbacAPI.getRoles();

  //     if (response.data.status === "success") {
  //       setAllRoles(response.data.data.roles);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching roles:", err);
  //     toast.error("Failed to load roles");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const fetchRoles = useCallback(async () => {
    // Fetch tenant roles when modal opens
    const userDetails = JSON.parse(localStorage.getItem("user") || "{}");
    const tenantId = userDetails.tenant_id;
    try {
      setLoading(true);
      const response = await RbacAPI.getRoles();
      // const response = await RbacAPI.getTenantRoles(tenantId);
      if (response.data.status === "success") {
        setAllRoles(response.data.data.roles);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const fetchSinglePermissionHandler = async (id) => {
    try {
      const response = await RbacAPI.getRoleById(id);

      if (response.data.status === "success") {
        setSelectedPermissions(response?.data?.data?.permissions);
        setSelectedRoleId(id);
      }
    } catch (err) {
      console.error("Error fetching role:", err);
    }
  };

  const deleteRoleHandler = async (id, e) => {
    e.stopPropagation(); // ✅ prevent triggering fetchSinglePermissionHandler
    try {
      const response = await RbacAPI.deleteRole(id);

      if (response.data.status === "success") {
        toast.success(response?.data?.message || "Role deleted successfully!");
        await fetchRoles(); // ✅ reload roles with loading indicator
      }
    } catch (err) {
      console.error("Error deleting role:", err);
      toast.error("Failed to delete role");
    }
  };

  // Standardize role names
  const formatRoleName = (name) => {
    if (!name) return "";
    return name
      .trim()
      .replace(/[_-]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const stats = [
    { value: "12", label: "Total Tenants", color: "text-indigo-400" },
    { value: "156", label: "Total Users", color: "text-purple-400" },
    { value: "3", label: "System Roles", color: "text-blue-400" },
    { value: "89%", label: "Active Tenants", color: "text-green-400" },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Role Management
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-50 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 transition-colors flex items-center justify-center gap-2"
        >
          Create Role
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Packages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">System Packages</h2>
        </div>

        {loading ? ( // ✅ Show skeleton while loading
          <div className="mx-auto w-full rounded-md border border-blue-300 p-4">
            <div className="flex animate-pulse space-x-4">
              <div className="flex-1 space-y-6 py-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 h-10 rounded bg-gray-200 opacity-40"></div>
                    <div className="col-span-2 h-10 rounded bg-gray-200 opacity-40"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {allRoles?.map((role) => (
              <div
                key={role.id}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 relative hover:border-red-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => fetchSinglePermissionHandler(role.id)}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-t-xl"></div>

                {/* Delete Icon */}
                <button
                  onClick={(e) => deleteRoleHandler(role.id, e)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 group"
                  title="Delete Role"
                >
                  <svg
                    className="w-4 h-4 text-red-400 group-hover:text-red-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="flex justify-between items-start mb-4 pr-8">
                  <h3 className="text-white text-xl font-bold">
                    {formatRoleName(role?.name)}
                  </h3>
                </div>

                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Platform-wide administrator with complete system control.
                  Manages all tenants, subscriptions, and platform
                  configuration.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <AddForm
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            fetchRoles={fetchRoles}
          />
        </div>
      )}
    </>
  );
}

export default StaticComponent;
