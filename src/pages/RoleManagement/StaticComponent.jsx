import React, { useEffect, useState } from "react";
import AddForm from "./add/AddForm";
import { RbacAPI } from "../../services/api";

function StaticComponent({ setSelectedPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allRoles, setAllRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await RbacAPI.getRoles();

        // Handle the API response format
        if (response.data.status === "success") {
          setAllRoles(response.data.data.roles);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchRoles();
  }, []);

  const fetchSinglePermissionHandler = async (id) => {
    try {
      const response = await RbacAPI.getRoleById(id);
      console.log(response.data.data);

      // Handle the API response format
      if (response.data.status === "success") {
        console.log(JSON.stringify(response.data.data?.permissions));
        setSelectedPermissions(response?.data?.data?.permissions);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };
  const deleteRoleHandler = async (id) => {
    try {
      const response = await RbacAPI.deleteRole(id);
      console.log(response.data);

      // Handle the API response format
      if (response.data.status === "success") {
        setAllRoles(response.data.data.roles);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };

  const stats = [
    {
      value: "12",
      label: "Total Tenants",
      color: "text-indigo-400",
    },
    {
      value: "156",
      label: "Total Users",
      color: "text-purple-400",
    },
    {
      value: "3",
      label: "System Roles",
      color: "text-blue-400",
    },
    {
      value: "89%",
      label: "Active Tenants",
      color: "text-green-400",
      isWide: true,
    },
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
      {/* System Roles Overview */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            System Roles Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Super Admin Card */}

          {allRoles?.map((role) => {
            return (
              <>
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
                      {role?.name}
                    </h3>
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {role?.label}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Platform-wide administrator with complete system control.
                    Manages all tenants, subscriptions, and platform
                    configuration. No operational capabilities.
                  </p>
                </div>
              </>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <AddForm setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
        </div>
      )}
    </>
  );
}

export default StaticComponent;
