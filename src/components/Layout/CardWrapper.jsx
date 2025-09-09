import React from "react";

function CardWrapper({ children }) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
      {children}
    </div>
  );
}

export default CardWrapper;
