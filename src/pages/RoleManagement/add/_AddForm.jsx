import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DefaultValues, RoleSchema } from "./utilities";
import { RbacAPI } from "../../../services/api";

function AddForm({ setIsModalOpen }) {
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(RoleSchema),
    defaultValues: DefaultValues,
  });

  // Fetch permissions from API
  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => RbacAPI.getPermissions(),
  });
  const handlePermissionChange = (groupId, moduleId, permission, checked) => {
    const permissionKey = moduleId
      ? `${groupId}.${moduleId}.${permission}`
      : `${groupId}.${permission}`;

    let updatedPermissions;
    if (checked) {
      updatedPermissions = [...selectedPermissions, permissionKey];
    } else {
      updatedPermissions = selectedPermissions.filter(
        (p) => p !== permissionKey
      );
    }

    setSelectedPermissions(updatedPermissions);
    setValue("permissions", updatedPermissions);
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
        reset();
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
    // Dispatch loading state
    // dispatch(setLoading(true));
    // dispatch(setError(null));

    const formData = {
      ...data,
      permissions: selectedPermissions,
    };

    mutation.mutate(formData);
  };
  return (
    <div className="bg-black backdrop-blur-lg rounded-xl p-6 border border-white/20 w-full max-w-md mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Create New Role</h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-white/60 hover:text-white transition-colors"
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

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Role Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500 focus:bg-white/20"
            placeholder="Enter role name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Label
          </label>
          <input
            type="text"
            {...register("label")}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500 focus:bg-white/20"
            placeholder="Enter label"
          />
          {/* <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500 focus:bg-white/20 resize-none"
                  placeholder="Enter role description"
                /> */}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Permissions
          </label>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {permissionsLoading ? (
              <div className="text-white/60 text-sm">
                Loading permissions...
              </div>
            ) : permissions?.data?.data ? (
              permissions.data.data.map((group) => (
                <div
                  key={group.group}
                  className="border border-white/10 rounded-lg p-3"
                >
                  <div className="font-medium text-white mb-2">
                    {group.group}
                  </div>

                  {/* Group-level permissions */}
                  {group.permissions &&
                    Object.keys(group.permissions).length > 0 && (
                      <div className="ml-4 mb-2">
                        <div className="text-sm text-white/80 mb-1">
                          Group Permissions:
                        </div>
                        {Object.keys(group.permissions).map((permission) => (
                          <label
                            key={`${group.group}.${permission}`}
                            className="flex items-center mb-1"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(
                                `${group.group}.${permission}`
                              )}
                              onChange={(e) =>
                                handlePermissionChange(
                                  group.group,
                                  null,
                                  permission,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-2 text-xs text-white">
                              {permission}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                  {/* Module-level permissions */}
                  {group.modules &&
                    group.modules.map((module) => (
                      <div key={module.code} className="ml-4 mb-2">
                        <div className="text-sm text-white/80 mb-1">
                          {module.name}:
                        </div>
                        {Object.keys(module.permissions).map((permission) => (
                          <label
                            key={`${group.group}.${module.code}.${permission}`}
                            className="flex items-center mb-1"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(
                                `${group.group}.${module.code}.${permission}`
                              )}
                              onChange={(e) =>
                                handlePermissionChange(
                                  group.group,
                                  module.code,
                                  permission,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="ml-2 text-xs text-white">
                              {permission}
                            </span>
                          </label>
                        ))}
                      </div>
                    ))}
                </div>
              ))
            ) : (
              <div className="text-white/60 text-sm">
                No permissions available
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 border border-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
          >
            Create Role
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddForm;
