import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { RbacAPI } from "../../../services/api";

function AddForm({ isModalOpen, setIsModalOpen }) {
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Static permissions data based on your structure
  const staticPermissions = [
    {
      group: "User Management",
      permissions: [
        {
          id: 1,
          name: "create_users",
          label: "Create Users",
          enabled: true,
        },
        {
          id: 3,
          name: "view_users",
          label: "View Users",
          enabled: true,
        },
        {
          id: 4,
          name: "edit_users",
          label: "Edit Users",
          enabled: true,
        },
        {
          id: 5,
          name: "delete_users",
          label: "Delete Users",
          enabled: true,
        },
      ],
    },
    {
      group: "Billing",
      permissions: [
        {
          id: 2,
          name: "manage_billing",
          label: "Manage Billing",
          enabled: true,
        },
        {
          id: 6,
          name: "view_billing",
          label: "View Billing",
          enabled: true,
        },
        {
          id: 7,
          name: "export_billing",
          label: "Export Billing Reports",
          enabled: true,
        },
      ],
    },
    {
      group: "Content Management",
      permissions: [
        {
          id: 8,
          name: "create_content",
          label: "Create Content",
          enabled: true,
        },
        {
          id: 9,
          name: "edit_content",
          label: "Edit Content",
          enabled: true,
        },
        {
          id: 10,
          name: "delete_content",
          label: "Delete Content",
          enabled: true,
        },
        {
          id: 11,
          name: "publish_content",
          label: "Publish Content",
          enabled: true,
        },
      ],
    },
    {
      group: "Reports",
      permissions: [
        {
          id: 12,
          name: "view_reports",
          label: "View Reports",
          enabled: true,
        },
        {
          id: 13,
          name: "export_reports",
          label: "Export Reports",
          enabled: true,
        },
        {
          id: 14,
          name: "create_reports",
          label: "Create Custom Reports",
          enabled: true,
        },
      ],
    },
  ];

  const handlePermissionChange = (permissionName, checked) => {
    let updatedPermissions;
    if (checked) {
      updatedPermissions = [...selectedPermissions, permissionName];
    } else {
      updatedPermissions = selectedPermissions.filter(
        (p) => p !== permissionName
      );
    }
    setSelectedPermissions(updatedPermissions);
  };

  const handleSelectAll = (groupPermissions, checked) => {
    const groupPermissionNames = groupPermissions.map((p) => p.name);

    let updatedPermissions;
    if (checked) {
      // Add all group permissions that aren't already selected
      const newPermissions = groupPermissionNames.filter(
        (name) => !selectedPermissions.includes(name)
      );
      updatedPermissions = [...selectedPermissions, ...newPermissions];
    } else {
      // Remove all group permissions
      updatedPermissions = selectedPermissions.filter(
        (p) => !groupPermissionNames.includes(p)
      );
    }
    setSelectedPermissions(updatedPermissions);
  };

  const isGroupFullySelected = (groupPermissions) => {
    return groupPermissions.every((p) => selectedPermissions.includes(p.name));
  };

  const isGroupPartiallySelected = (groupPermissions) => {
    return (
      groupPermissions.some((p) => selectedPermissions.includes(p.name)) &&
      !isGroupFullySelected(groupPermissions)
    );
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await RbacAPI.createRole(data);
      return res;
    },
    onSuccess: (response) => {
      if (response.data.status === "success") {
        const newRole = response.data.data;
        console.log("Role created successfully:", newRole);

        toast.success(response.data.message || "Role created successfully!");

        // Reset form and close modal
        document.querySelector('input[name="name"]').value = "";
        document.querySelector('input[name="label"]').value = "";
        setSelectedPermissions([]);
        setIsModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to create role");
      }
    },
    onError: (error) => {
      console.error("Error creating role:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while creating the role";

      toast.error(errorMessage);
    },
  });

  const onSubmit = (data) => {
    // Group selected permissions by their categories
    const groupedPermissions = staticPermissions
      .map((group) => {
        const selectedPermissionsInGroup = group.permissions.filter(
          (permission) => selectedPermissions.includes(permission.name)
        );

        return {
          group: group.group,
          count: `${selectedPermissionsInGroup.length} / ${group.permissions.length}`,
          permissions: selectedPermissionsInGroup.map((permission) => ({
            id: permission.id,
            name: permission.name,
            label: permission.label,
            enabled: true,
          })),
        };
      })
      .filter((group) => group.permissions.length > 0); // Only include groups with selected permissions

    const formData = {
      ...data,
      permissions: groupedPermissions,
    };

    console.log(JSON.stringify(formData, null, 2));

    // Uncomment when ready to make API call
    mutation.mutate(formData);
  };

  const handleCloseModal = () => {
    // Reset form when closing
    const nameInput = document.querySelector('input[name="name"]');
    const labelInput = document.querySelector('input[name="label"]');
    if (nameInput) nameInput.value = "";
    if (labelInput) labelInput.value = "";
    setSelectedPermissions([]);
    setIsModalOpen(false);
  };

  // Show button to open modal when closed
  //   if (!isModalOpen) {
  //     return (
  //       <div className="flex items-center justify-center min-h-screen bg-gray-900">
  //         <button
  //           onClick={() => setIsModalOpen(true)}
  //           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
  //         >
  //           Create New Role
  //         </button>
  //       </div>
  //     );
  //   }

  // Show modal when open
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 backdrop-blur-lg rounded-xl p-6 border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Role</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Role Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g., content_manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Display Label <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="label"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g., Content Manager"
              />
            </div>
          </div>

          {/* Permissions Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-white">
                Permissions <span className="text-red-400">*</span>
              </label>
              <div className="text-sm text-gray-400">
                {selectedPermissions.length} selected
              </div>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {staticPermissions.map((group) => (
                <div
                  key={group.group}
                  className="border border-gray-700 rounded-lg p-4 bg-gray-800/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isGroupFullySelected(group.permissions)}
                        ref={(el) => {
                          if (el)
                            el.indeterminate = isGroupPartiallySelected(
                              group.permissions
                            );
                        }}
                        onChange={(e) =>
                          handleSelectAll(group.permissions, e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                      />
                      <span className="ml-3 font-semibold text-white text-lg">
                        {group.group}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {
                        group.permissions.filter((p) =>
                          selectedPermissions.includes(p.name)
                        ).length
                      }{" "}
                      / {group.permissions.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-7">
                    {group.permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center p-2 rounded-md hover:bg-gray-700/50 transition-colors cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(
                            permission.name
                          )}
                          onChange={(e) =>
                            handlePermissionChange(
                              permission.name,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <span className="text-sm text-white group-hover:text-blue-300 transition-colors">
                            {permission.label}
                          </span>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {permission.name}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedPermissions.length === 0 && (
              <div className="mt-2 text-sm text-red-400">
                Please select at least one permission
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const roleName =
                  document.querySelector('input[name="name"]')?.value;
                const roleLabel = document.querySelector(
                  'input[name="label"]'
                )?.value;

                if (!roleName || !roleLabel) {
                  toast.error("Please fill in both role name and label");
                  return;
                }

                if (selectedPermissions.length === 0) {
                  toast.error("Please select at least one permission");
                  return;
                }

                const data = {
                  name: roleName,
                  label: roleLabel,
                };

                onSubmit(data);
              }}
              disabled={selectedPermissions.length === 0 || mutation.isPending}
              className="flex-1 px-4 py-3 bg-blue-600 border border-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Creating..." : "Create Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddForm;
