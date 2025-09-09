import React, { useEffect, useState } from "react";
import StaticComponent from "./StaticComponent";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";
import { RbacAPI } from "../../services/api";

const RoleManagementPage = () => {
  const [permissionState, setPermissionState] = useState();

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await RbacAPI.getPermissions();
        console.log("101", JSON.stringify(response.data.data));

        // Handle the API response format
        if (response.data.status === "success") {
          setPermissionState(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchInvitation();
  }, []);

  // Helper function to get role display name
  const getRoleDisplayName = (roleName) => {
    switch (roleName) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Organization Admin";
      case "staff":
        return "Organization Member";
      default:
        return roleName;
    }
  };

  // Handle toggle change
  // const handleToggleChange = async (roleId, permissionName, currentEnabled) => {
  //   try {
  //     const newEnabled = !currentEnabled;

  //     // Prepare the data for the API call
  //     const updateData = {
  //       permissions: {
  //         [permissionName]: newEnabled,
  //       },
  //     };

  //     // Call the API to update the permission
  //     await RbacAPI.UpdatePermission(roleId, updateData);

  //     // Update local state to reflect the change
  //     setPermissionState((prevState) => {
  //       const newState = { ...prevState };
  //       newState.permission_groups = newState.permission_groups.map(
  //         (group) => ({
  //           ...group,
  //           permissions: group.permissions.map((permission) => {
  //             if (permission.name === permissionName) {
  //               return {
  //                 ...permission,
  //                 roles: permission.roles.map((role) => {
  //                   if (role.name === roleName) {
  //                     return { ...role, enabled: newEnabled };
  //                   }
  //                   return role;
  //                 }),
  //               };
  //             }
  //             return permission;
  //           }),
  //         })
  //       );
  //       return newState;
  //     });

  //     console.log(`Updated ${permissionName} for ${roleName} to ${newEnabled}`);
  //   } catch (error) {
  //     console.error("Error updating permission:", error);
  //     // You might want to show a toast notification or error message here
  //   }
  // };

  // Handle toggle change
  const handleToggleChange = async (roleId, permissionName, currentEnabled) => {
    try {
      const newEnabled = !currentEnabled;

      // Get all currently enabled permissions for this role
      const enabledPermissions = [];

      permissionState.permission_groups.forEach((group) => {
        group.permissions.forEach((permission) => {
          const rolePermission = permission.roles.find(
            (role) => role.id === roleId
          );
          if (
            rolePermission &&
            rolePermission.enabled &&
            permission.name !== permissionName
          ) {
            // Add currently enabled permissions (except the one we're toggling)
            enabledPermissions.push(permission.name);
          }
        });
      });

      // If we're enabling the permission, add it to the array
      if (newEnabled) {
        enabledPermissions.push(permissionName);
      }
      // If we're disabling, it's already excluded from the array above

      // Prepare the data for the API call
      const updateData = {
        permissions: enabledPermissions,
      };

      // Call the API to update the permission
      await RbacAPI.UpdatePermission(roleId, updateData);

      // Update local state to reflect the change
      setPermissionState((prevState) => {
        const newState = { ...prevState };
        newState.permission_groups = newState.permission_groups.map(
          (group) => ({
            ...group,
            permissions: group.permissions.map((permission) => {
              if (permission.name === permissionName) {
                return {
                  ...permission,
                  roles: permission.roles.map((role) => {
                    if (role.id === roleId) {
                      return { ...role, enabled: newEnabled };
                    }
                    return role;
                  }),
                };
              }
              return permission;
            }),
          })
        );
        return newState;
      });

      console.log(
        `Updated ${permissionName} for role ${roleId} to ${newEnabled}`
      );
      console.log("Sent permissions array:", enabledPermissions);
    } catch (error) {
      console.error("Error updating permission:", error);
      // You might want to show a toast notification or error message here
    }
  };

  // Helper function to render toggle switch
  const renderToggle = (isEnabled, id, permissionName) => {
    return (
      <div
        onClick={() => handleToggleChange(id, permissionName, isEnabled)}
        className={`w-11 h-6 ${
          isEnabled ? "bg-green-500" : "bg-slate-600"
        } rounded-full mx-auto relative cursor-pointer transition-all ${
          isEnabled ? "hover:bg-green-400" : "hover:bg-slate-500"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 ${
            isEnabled ? "right-0.5" : "left-0.5"
          } shadow-md transition-all duration-200`}
        ></div>
      </div>
    );
  };

  // Get unique roles for table headers (sorted by ID)
  const getRoles = () => {
    if (!permissionState?.permission_groups?.[0]?.permissions?.[0]?.roles)
      return [];
    return permissionState.permission_groups[0].permissions[0].roles.sort(
      (a, b) => a.id - b.id
    );
  };

  const roles = getRoles();

  return (
    <MainContentWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <StaticComponent />

        {/* Granular Permission Management */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Granular Permission Management
            </h2>
            {/* <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
              Save Changes
            </button> */}
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-white font-semibold">
                      Module / Permission
                    </th>
                    {roles.map((role) => (
                      <th
                        key={role.id}
                        className="text-center p-4 text-white font-semibold min-w-[140px]"
                      >
                        {getRoleDisplayName(role.name)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {permissionState?.permission_groups?.map((group) => (
                    <React.Fragment key={group.group}>
                      {/* Group Header */}
                      <tr className="bg-white/10">
                        <td
                          className="p-4 text-white font-semibold"
                          colSpan={roles.length + 1}
                        >
                          {group.group}
                        </td>
                      </tr>
                      {/* Permissions for this group */}
                      {group.permissions.map((permission) => (
                        <tr
                          key={permission.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4 pl-8 text-slate-300">
                            {permission.name
                              .replace(/([a-z])([A-Z])/g, "$1 $2")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </td>
                          {roles.map((role) => {
                            const rolePermission = permission.roles.find(
                              (r) => r.id === role.id
                            );
                            return (
                              <td key={role.id} className="p-4 text-center">
                                {renderToggle(
                                  rolePermission?.enabled || false,
                                  role.id,
                                  permission.name
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
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
