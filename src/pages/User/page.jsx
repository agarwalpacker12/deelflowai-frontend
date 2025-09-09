import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Edit,
  Mail,
  MoreHorizontal,
  UserPlus,
  Shield,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";
import MainContentWrapper from "../../components/Layout/MainContentWrapper";
import StaticContent from "./StaticComponent.jsx";
import { authAPI, RbacAPI } from "../../services/api.js";

const UserManagement = () => {
  const token = localStorage.getItem("token");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRole, setEditRole] = useState("member");

  // Helper function to generate avatar initials
  const generateAvatar = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${first}${last}`;
  };

  // Helper function to calculate time since creation
  const getTimeSince = (dateString) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffInMinutes = Math.floor((now - createdAt) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months ago`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
  };

  // Helper function to format join date
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate stats based on real data
  const calculateStats = (usersData) => {
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(
      (user) => user.status === "active"
    ).length;
    const adminUsers = usersData.filter((user) => user.role === "admin").length;
    const pendingInvites = usersData.filter((user) => !user.is_verified).length;

    return [
      {
        value: totalUsers.toString(),
        label: "Total Users",
        sublabel: "50 user limit",
        icon: <Users className="h-6 w-6" />,
        color: "text-blue-400",
      },
      {
        value: activeUsers.toString(),
        label: "Active Users",
        sublabel: "Last 30 days",
        icon: <Users className="h-6 w-6" />,
        color: "text-green-400",
      },
      {
        value: adminUsers.toString(),
        label: "Admin",
        sublabel: "Including you",
        icon: <Shield className="h-6 w-6" />,
        color: "text-purple-400",
      },
      {
        value: pendingInvites.toString(),
        label: "Pending Invites",
        sublabel: "Awaiting response",
        icon: <Mail className="h-6 w-6" />,
        color: "text-orange-400",
      },
    ];
  };

  const [stats, setStats] = useState([
    {
      value: "0",
      label: "Total Users",
      sublabel: "50 user limit",
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-400",
    },
    {
      value: "0",
      label: "Active Users",
      sublabel: "Last 30 days",
      icon: <Users className="h-6 w-6" />,
      color: "text-green-400",
    },
    {
      value: "0",
      label: "Admin",
      sublabel: "Including you",
      icon: <Shield className="h-6 w-6" />,
      color: "text-purple-400",
    },
    {
      value: "0",
      label: "Pending Invites",
      sublabel: "Awaiting response",
      icon: <Mail className="h-6 w-6" />,
      color: "text-orange-400",
    },
  ]);

  const adminCount = users.filter(
    (user) => user.role === "admin" && user.status !== "invited"
  ).length;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "inactive":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "invited":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "member":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getAvatarColor = (avatar) => {
    // Generate a consistent color based on the avatar text
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
    ];

    // Simple hash function to get consistent color for same avatar
    let hash = 0;
    for (let i = 0; i < avatar.length; i++) {
      hash = avatar.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditRole(user.role); // ✅ pre-fill with current role
    setShowEditModal(true);
  };

  //   const handleRemoveUser = (user) => {
  //     if (user.role === "admin" && adminCount <= 1) {
  //       alert(
  //         "Cannot remove the last Organization Admin. At least one admin must remain in the organization."
  //       );
  //       return;
  //     }

  //     if (
  //       window.confirm(
  //         `Are you sure you want to remove ${user.full_name} from the organization? This action cannot be undone.`
  //       )
  //     ) {
  //       setUsers(users.filter((u) => u.id !== user.id));
  //     }
  //   };

  //   const handleResetPassword = (user) => {
  //     if (window.confirm(`Send password reset email to ${user.full_name}?`)) {
  //       alert(`Password reset email sent to ${user.full_name}`);
  //     }
  //   };

  //   const handleResendInvite = (user) => {
  //     if (window.confirm(`Resend invitation email to ${user.full_name}?`)) {
  //       alert(`Invitation resent to ${user.full_name}`);
  //     }
  //   };

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/20 bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all duration-200"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getAllUsers(token);

        // Handle the API response format
        if (response.data.status === "success") {
          const apiUsers = response.data.data.users;

          // Transform API data to match component structure
          const transformedUsers = apiUsers.map((user) => ({
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.role,
            status: user.is_active ? "active" : "inactive",
            lastActive: getTimeSince(user.updated_at),
            joined: formatJoinDate(user.created_at),
            avatar: generateAvatar(user.first_name, user.last_name),
            // Keep original API fields for reference
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            is_verified: user.is_verified,
            created_at: user.created_at,
            updated_at: user.updated_at,
          }));

          setUsers(transformedUsers);
          setStats(calculateStats(transformedUsers));
          console.log("Transformed users:", transformedUsers);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const updateRole = async (id, role) => {
    try {
      const formattedData = {
        id: id,
        roles: [role],
      };
      const response = await RbacAPI.UpdateRole(formattedData);
      console.log("response", response);
    } catch (error) {}
  };

  if (loading) {
    return (
      <MainContentWrapper>
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-white text-lg">Loading users...</div>
        </div>
      </MainContentWrapper>
    );
  }

  return (
    <MainContentWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <StaticContent
          stats={stats}
          UserPlus={UserPlus}
          setShowInviteModal={setShowInviteModal}
          showInviteModal={showInviteModal}
        />

        {/* Users Table */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-white font-semibold">
                    User
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Role
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Status
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Last Active
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Joined
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${getAvatarColor(
                              user.avatar
                            )} flex items-center justify-center text-white font-bold text-sm`}
                          >
                            {user.avatar}
                          </div>
                          <div>
                            <div className="text-white font-semibold">
                              {user.name}
                            </div>
                            <div className="text-slate-400 text-sm">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {user?.role && (
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                              user?.role
                            )}`}
                          >
                            {user.role === "admin"
                              ? "Organization Admin"
                              : "Organization Member"}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-300 text-sm">
                          {user.lastActive}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-300 text-sm">
                          {user.joined}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {/* <button
                            onClick={() => handleResetPassword(user)}
                            className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                            title="Reset Password"
                          >
                            <Mail className="h-4 w-4" />
                          </button> */}
                          {/* <button
                            onClick={() => handleRemoveUser(user)}
                            disabled={user.role === "admin" && adminCount <= 1}
                            className={`p-2 rounded-lg transition-colors ${
                              user.role === "admin" && adminCount <= 1
                                ? "text-gray-500 cursor-not-allowed"
                                : "text-red-400 hover:bg-red-500/20"
                            }`}
                            title="Remove User"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {users.slice(0, 3).map((user, index) => (
              <div key={user.id} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {user.name} joined the organization
                  </div>
                  <div className="text-slate-400 text-sm">
                    {user.lastActive}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite User Modal */}
      {/* <Modal
        show={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New User"
      >
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Email Address
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Role
              </label>
              <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white">
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Message (Optional)
              </label>
              <textarea
                rows="3"
                placeholder="Add a personal message to the invitation..."
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-white/20 flex justify-end gap-3">
          <button
            onClick={() => setShowInviteModal(false)}
            className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert("Invitation sent!");
              setShowInviteModal(false);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors"
          >
            Send Invitation
          </button>
        </div>
      </Modal> */}

      {/* Edit User Modal */}
      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit User - ${editingUser?.name || ""}`}
      >
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  First Name
                </label>
                <input
                  disabled
                  type="text"
                  defaultValue={editingUser?.first_name || ""}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Last Name
                </label>
                <input
                  disabled
                  type="text"
                  defaultValue={editingUser?.last_name || ""}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Email Address
              </label>
              <input
                disabled
                type="email"
                defaultValue={editingUser?.email || ""}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Role
              </label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)} // ✅ keep state updated
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Status
              </label>
              <select
                disabled
                defaultValue={editingUser?.status || "active"}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-white/20 flex justify-end gap-3">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateRole(editingUser.id, editRole); // ✅ pass new role
              setShowEditModal(false);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </MainContentWrapper>
  );
};

export default UserManagement;
