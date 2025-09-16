const ProgressBar = ({ percentage, color = "bg-purple-400" }) => (
  <div className="w-full bg-white/20 rounded-full h-2">
    <div
      className={`h-2 rounded-full transition-all duration-500 ${color}`}
      style={{ width: `${percentage}%` }}
    />
  </div>
);
export default ProgressBar;
