import React, { useEffect, useState } from "react";
import StaticComponent from "./StaticComponent";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";
import { RbacAPI } from "../../services/api";

const RoleManagementPage = () => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [allPermission, setAllPermission] = useState([]);

  // Permissions array provided by user

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await RbacAPI.getPermissions();
        console.log("101", JSON.stringify(response?.data?.data?.permissions));

        // Handle the API response format
        if (response.data.status === "success") {
          setAllPermission(response?.data?.data?.permissions);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchInvitation();
  }, []);

  const handlePermissionToggle = (permissionName) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((name) => name !== permissionName)
        : [...prev, permissionName]
    );
  };

  // Check if a permission is selected by comparing names
  const isPermissionChecked = (permissionName) => {
    return selectedPermissions.includes(permissionName);
  };

  return (
    <MainContentWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <StaticComponent
          setSelectedPermissions={setSelectedPermissions}
          selectedPermissions={selectedPermissions}
        />

        {/* Granular Permission Management */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Granular Permission Management
            </h2>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-white font-semibold">
                      Permission
                    </th>
                    <th className="text-left p-4 text-white font-semibold">
                      Key
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {allPermission.map((permission) => (
                    <tr
                      key={permission.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-slate-300 flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isPermissionChecked(permission.name)}
                          onChange={() => handlePermissionToggle(permission.name)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        />
                        <span>{permission.label}</span>
                      </td>
                      <td className="p-4 text-slate-400 text-sm">
                        {permission.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainContentWrapper>
  );
};

export default RoleManagementPage;
