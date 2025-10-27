import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { RbacAPI } from "../../../services/api";

function AddForm({ setIsModalOpen, fetchRoles }) {
  const [roleName, setRoleName] = useState("");
  const [roleLabel, setRoleLabel] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // 🟢 Fetch all permissions dynamically
  const {
    data: permissions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await RbacAPI.getPermissions(); // Must return { data: { data: { permissions: [...] } } }
      return res.data.data.permissions;
    },
  });

  // 🧠 Group permissions by inferred category name
  const groupedPermissions = useMemo(() => {
    if (!permissions) return [];

    const groups = {};

    permissions.forEach((perm) => {
      // Infer group name from last word in snake_case
      const parts = perm.name.split("_");
      const suffix = parts[parts.length - 1]; // e.g., users, billing, reports
      const groupName =
        suffix.charAt(0).toUpperCase() + suffix.slice(1).replace("_", " ");

      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(perm);
    });

    return Object.entries(groups).map(([group, perms]) => ({
      group,
      permissions: perms,
    }));
  }, [permissions]);

  // 🧩 Checkbox logic
  const handlePermissionChange = (permissionName, checked) => {
    setSelectedPermissions((prev) =>
      checked
        ? [...prev, permissionName]
        : prev.filter((p) => p !== permissionName)
    );
  };

  const handleSelectAll = (groupPermissions, checked) => {
    const names = groupPermissions.map((p) => p.name);
    setSelectedPermissions((prev) => {
      if (checked) {
        const newOnes = names.filter((n) => !prev.includes(n));
        return [...prev, ...newOnes];
      } else {
        return prev.filter((p) => !names.includes(p));
      }
    });
  };

  const isGroupFullySelected = (groupPermissions) =>
    groupPermissions.every((p) => selectedPermissions.includes(p.name));

  const isGroupPartiallySelected = (groupPermissions) =>
    groupPermissions.some((p) => selectedPermissions.includes(p.name)) &&
    !isGroupFullySelected(groupPermissions);

  // 🧭 API: Create Role Mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await RbacAPI.createRole(data);
      return res;
    },
    onSuccess: (response) => {
      if (response.data.status === "success") {
        toast.success(response.data.message || "Role created successfully!");
        resetForm();
        setIsModalOpen(false);
        fetchRoles();
      } else {
        throw toast.error(response.data.message || "Failed to create role");
      }
    },
    onError: (error) => {
      console.error("Error creating role:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while creating the role"
      );
    },
  });

  // 🧾 Form submit
  const onSubmit = () => {
    if (!roleName || !roleLabel) {
      toast.error("Please fill in both Role Name and Label");
      return;
    }
    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    const groupedSelection = groupedPermissions
      .map((group) => {
        const selectedInGroup = group.permissions.filter((p) =>
          selectedPermissions.includes(p.name)
        );
        return {
          group: group.group,
          count: `${selectedInGroup.length} / ${group.permissions.length}`,
          permissions: selectedInGroup.map((p) => ({
            id: p.id,
            name: p.name,
            label: p.label,
            enabled: true,
          })),
        };
      })
      .filter((g) => g.permissions.length > 0);

    const formData = {
      name: roleName.trim().toLowerCase(),
      label: roleLabel.trim(),
      permissions: groupedSelection,
    };

    mutation.mutate(formData);
  };

  const resetForm = () => {
    setRoleName("");
    setRoleLabel("");
    setSelectedPermissions([]);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  // 🕓 Loading & Error States
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-lg">
        Loading permissions...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center text-red-400 text-lg">
        Failed to load permissions.
      </div>
    );
  }

  // 🧱 Modal UI
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Role</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-white p-1"
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

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Role Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g., content_manager"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Display Label <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={roleLabel}
                onChange={(e) => setRoleLabel(e.target.value)}
                placeholder="e.g., Content Manager"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Permissions */}
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
              {groupedPermissions.map((group) => (
                <div
                  key={group.group}
                  className="border border-gray-700 rounded-lg p-4 bg-gray-800/50"
                >
                  {/* Group Header */}
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

                  {/* Group Permissions */}
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

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={selectedPermissions.length === 0 || mutation.isPending}
              className="flex-1 px-4 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
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
