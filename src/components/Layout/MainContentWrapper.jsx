import React from "react";

function MainContentWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {children}
    </div>
  );
}

export default MainContentWrapper;
