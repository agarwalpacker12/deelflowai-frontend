import { useEffect, useState } from "react";
import StaticComponent from "./StaticComponent";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";
import { RbacAPI } from "../../services/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const RoleManagementPage = () => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  // 🧠 Sync selected permissions when they change from StaticComponent
  useEffect(() => {
    if (selectedPermissions?.length) {
      setPermissions(
        selectedPermissions.map((p) => ({
          ...p,
          status: !!p.status, // ensure boolean
        }))
      );
    } else {
      setPermissions([]);
    }
  }, [selectedPermissions]);

  // ✅ Handle checkbox toggle — multi-select supported
  const handleToggle = (id) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.id === id ? { ...perm, status: !perm.status } : perm
      )
    );
  };

  // console.log("permissions", permissions);

  // 🧭 API: Update Role Mutation
  const mutation = useMutation({
    mutationFn: async ({ roleId, data }) => {
      const res = await RbacAPI.UpdatePermission(roleId, data);
      return res;
    },
    onSuccess: (response) => {
      if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "Role updated successfully!");
      } else {
        throw toast.error(response?.data?.message || "Failed to update role");
      }
    },
    onError: (error) => {
      console.error("Error updating role:", error);
      toast.error(error?.response?.data?.message || "Failed to update role");
    },
  });

  // 🧾 Form submit
  const onSubmit = () => {
    if (!selectedRoleId) {
      toast.error("Please select a role first");
      return;
    }

    const formData = {
      permissions: permissions.map((perm) => ({
        id: perm.id,
        name: perm.name,
        label: perm.label,
        status: perm.status,
      })),
    };

    mutation.mutate({ roleId: selectedRoleId, data: formData });
  };

  return (
    <MainContentWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <StaticComponent
          setSelectedPermissions={setSelectedPermissions}
          setSelectedRoleId={setSelectedRoleId}
        />

        {/* Granular Permission Management */}
        {selectedRoleId && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Granular Permission Management
              </h2>

              <button
                onClick={() => onSubmit()}
                // className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                className={`w-100 p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mb-4 text-white`}
              >
                Update
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10 border-b border-white/10">
                    <tr>
                      <th className="text-left text-white p-4 font-semibold">
                        Permission Name
                      </th>
                      <th className="text-left text-white p-4 font-semibold">
                        Label
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions?.map((perm) => (
                      <tr
                        key={perm.id}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 text-slate-200">
                          <input
                            type="checkbox"
                            checked={!!perm.status}
                            onChange={() => handleToggle(perm.id)}
                            className="mx-4 accent-blue-500 cursor-pointer"
                          />
                          {perm?.name}
                        </td>
                        <td className="p-4 text-slate-300">{perm?.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainContentWrapper>
  );
};

export default RoleManagementPage;
