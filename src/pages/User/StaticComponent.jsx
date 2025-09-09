import { UserPlus, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
function StaticContent({ stats }) {
  const navigate = useNavigate();
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-slate-400">Manage users in your organization</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            // onClick={() => setShowInviteModal(true)}
            onClick={() => navigate("/app/invite")}
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <UserPlus className="h-5 w-5 relative z-10" />
            <span className="relative z-10">Invite User</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
          </button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color}`}>{stat.icon}</div>
            </div>
            <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-white font-medium mb-1">{stat.label}</div>
            <div className="text-slate-400 text-sm">{stat.sublabel}</div>
          </div>
        ))}
      </div>
      {/* Warnings */}
      <div className="space-y-4">
        <div className="bg-orange-500/10 backdrop-blur-md border border-orange-500/30 p-4 rounded-xl flex items-center gap-3 text-orange-300">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span>
            You're approaching your user limit. You have 26 slots remaining.
            Consider upgrading to a higher plan.
          </span>
        </div>

        <div className="bg-blue-500/10 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl flex items-center gap-3 text-blue-300">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span>
            Your organization currently has only one Organization Admin.
            Consider adding another admin for better access management and
            continuity.
          </span>
        </div>
      </div>
      {/* Search and Filters */}
      {/* <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
     
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

         
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
          >
            <option value="All Roles">All Roles</option>
            <option value="Organization Admin">Organization Admin</option>
            <option value="Organization Member">Organization Member</option>
          </select>
 
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-black [&>option]:bg-white"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Invited">Invited</option>
          </select>
        </div>
      </div> */}
    </>
  );
}

export default StaticContent;
