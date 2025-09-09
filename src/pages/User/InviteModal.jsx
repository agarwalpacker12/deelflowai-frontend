import React from "react";

function InviteModal({ showInviteModal, setShowInviteModal }) {
  return (
    <div>
      <Modal
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
      </Modal>
    </div>
  );
}

export default InviteModal;
