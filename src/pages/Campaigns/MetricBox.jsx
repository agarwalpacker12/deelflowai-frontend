const MetricBox = ({ label, value, trend, color = "text-white" }) => (
  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-white/70">{label}</div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
      </div>
      {trend && <span className="text-sm text-green-300">↑ {trend}</span>}
    </div>
  </div>
);
export default MetricBox;
