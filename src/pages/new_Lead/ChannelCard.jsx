function ChannelCard({ icon, name, status }) {
  return (
    <div className="text-center p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
      <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xl">
        {icon}
      </div>
      <div className="text-xs font-semibold text-white">{name}</div>
      <div
        className={`text-sm ${
          status === "Active" ? "text-green-300" : "text-yellow-300"
        }`}
      >
        {status}
      </div>
    </div>
  );
}

export default ChannelCard;
