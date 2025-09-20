import { useState, useRef } from "react";

// Icon components as SVGs
const Eye = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const Upload = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const Camera = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const Image = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21,15 16,10 5,21" />
  </svg>
);

const Zap = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  </svg>
);

const Home = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const BarChart3 = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const RefreshCw = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);

const Download = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const Share2 = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const Settings = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
);

const Maximize2 = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polyline points="15,3 21,3 21,9" />
    <polyline points="9,21 3,21 3,15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const X = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Filter = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </svg>
);

const Search = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const Grid3X3 = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const List = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const VisionAIPage = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const fileInputRef = useRef(null);

  // Sample analyzed properties data
  const analyzedProperties = [
    {
      id: 1,
      address: "1247 Pine Street, Dallas, TX 75201",
      images: 8,
      uploadDate: "2024-01-15",
      repairEstimate: 23000,
      conditionScore: 76,
      profitPotential: 45000,
      marketValue: 180000,
      status: "analyzed",
      thumbnail: "/api/placeholder/300/200",
      roomAnalysis: {
        kitchen: {
          condition: "Fair",
          repairs: ["Cabinets", "Countertops"],
          cost: 8500,
        },
        bathroom: {
          condition: "Poor",
          repairs: ["Tile", "Fixtures", "Vanity"],
          cost: 6200,
        },
        livingRoom: {
          condition: "Good",
          repairs: ["Paint", "Flooring"],
          cost: 3800,
        },
        exterior: {
          condition: "Fair",
          repairs: ["Roof", "Siding"],
          cost: 4500,
        },
      },
      stagedImages: 3,
      arVisualization: true,
    },
    {
      id: 2,
      address: "892 Oak Avenue, Austin, TX 78701",
      images: 12,
      uploadDate: "2024-01-14",
      repairEstimate: 18500,
      conditionScore: 82,
      profitPotential: 38000,
      marketValue: 165000,
      status: "analyzed",
      thumbnail: "/api/placeholder/300/200",
      roomAnalysis: {
        kitchen: { condition: "Good", repairs: ["Minor updates"], cost: 3500 },
        bathroom: {
          condition: "Fair",
          repairs: ["Fixtures", "Paint"],
          cost: 4200,
        },
        livingRoom: { condition: "Excellent", repairs: [], cost: 0 },
        exterior: {
          condition: "Poor",
          repairs: ["Roof", "Foundation"],
          cost: 10800,
        },
      },
      stagedImages: 5,
      arVisualization: true,
    },
    {
      id: 3,
      address: "456 Elm Street, Houston, TX 77001",
      images: 6,
      uploadDate: "2024-01-13",
      repairEstimate: 31200,
      conditionScore: 64,
      profitPotential: 52000,
      marketValue: 210000,
      status: "processing",
      thumbnail: "/api/placeholder/300/200",
      stagedImages: 0,
      arVisualization: false,
    },
  ];

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedImages(files);
    setAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      setAnalyzing(false);
      setActiveTab("results");
    }, 3000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedImages(files);
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      setActiveTab("results");
    }, 3000);
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Excellent":
        return "text-emerald-400 bg-emerald-900/20";
      case "Good":
        return "text-emerald-400 bg-emerald-900/20";
      case "Fair":
        return "text-amber-400 bg-amber-900/20";
      case "Poor":
        return "text-red-400 bg-red-900/20";
      default:
        return "text-gray-400 bg-gray-800/20";
    }
  };

  const tabs = [
    { id: "upload", label: "Upload & Analyze", icon: Upload },
    { id: "results", label: "Analysis Results", icon: BarChart3 },
    { id: "staging", label: "Virtual Staging", icon: Home },
    { id: "ar", label: "AR Visualization", icon: Eye },
    { id: "settings", label: "AI Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="px-6 py-6 border-b border-purple-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Eye className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Vision AI</h1>
              <p className="text-purple-200 mt-1">
                Advanced computer vision for property analysis
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300">94.2%</div>
              <div className="text-sm text-purple-400">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">2,847</div>
              <div className="text-sm text-purple-400">Properties Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">$1.2M</div>
              <div className="text-sm text-purple-400">Value Generated</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-2 py-4 border-b-2 font-medium transition-all ${
                    activeTab === tab.id
                      ? "border-purple-400 text-purple-300"
                      : "border-transparent text-purple-500 hover:text-purple-300 hover:border-purple-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "upload" && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 shadow-xl">
              <div className="p-6 border-b border-purple-800/30">
                <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                  <Upload className="w-6 h-6 text-purple-400" />
                  Property Image Upload
                </h3>
                <p className="text-purple-300 mt-2">
                  Upload property images for AI analysis and repair estimation
                </p>
              </div>

              <div className="p-6">
                <div
                  className="border-2 border-dashed border-purple-600/50 rounded-xl p-12 text-center hover:border-purple-400/70 transition-all cursor-pointer bg-purple-900/10"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="mb-6">
                    {analyzing ? (
                      <RefreshCw className="w-16 h-16 text-purple-400 mx-auto animate-spin" />
                    ) : (
                      <Camera className="w-16 h-16 text-purple-500 mx-auto" />
                    )}
                  </div>

                  <h4 className="text-xl font-semibold text-white mb-3">
                    {analyzing
                      ? "AI Analyzing Images..."
                      : "Upload Property Images"}
                  </h4>

                  <p className="text-purple-300 mb-6">
                    {analyzing
                      ? "Processing images with computer vision AI"
                      : "Drag and drop images here, or click to browse"}
                  </p>

                  {!analyzing && (
                    <div className="flex justify-center gap-4">
                      <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center gap-3 shadow-lg transition-all">
                        <Upload className="w-5 h-5" />
                        Select Images
                      </button>
                      <button className="px-8 py-3 border border-purple-600 text-purple-300 rounded-lg hover:bg-purple-900/30 flex items-center gap-3 transition-all">
                        <Camera className="w-5 h-5" />
                        Take Photo
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Upload Progress */}
                {analyzing && (
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm text-purple-300">
                      <span>Analyzing property condition...</span>
                      <span>73%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full animate-pulse shadow-lg"
                        style={{ width: "73%" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-lg">
                    Instant Analysis
                  </h4>
                </div>
                <p className="text-purple-300 mb-6">
                  Get repair estimates and condition scores in seconds
                </p>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                  Start Analysis
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-lg">
                    Virtual Staging
                  </h4>
                </div>
                <p className="text-purple-300 mb-6">
                  Generate staged versions of empty properties automatically
                </p>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg">
                  Create Staging
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white text-lg">
                    AR Visualization
                  </h4>
                </div>
                <p className="text-purple-300 mb-6">
                  Launch augmented reality property viewer
                </p>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg">
                  Launch AR
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div className="space-y-6">
            {/* Filters and View Options */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-purple-400" />
                    <input
                      type="text"
                      placeholder="Search properties..."
                      className="bg-slate-700/50 border border-purple-700/50 rounded-lg px-4 py-2 text-white placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-purple-700/50 rounded-lg text-purple-300 hover:bg-purple-900/30 transition-all">
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-purple-700/50 text-purple-300"
                        : "text-purple-500 hover:bg-purple-900/30"
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-purple-700/50 text-purple-300"
                        : "text-purple-500 hover:bg-purple-900/30"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {analyzedProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 overflow-hidden hover:shadow-xl hover:scale-105 transition-all shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={property.thumbnail}
                      alt={property.address}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          property.status === "analyzed"
                            ? "bg-emerald-900/80 text-emerald-300"
                            : "bg-amber-900/80 text-amber-300"
                        }`}
                      >
                        {property.status}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-slate-800/90 text-white transition-all">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-white text-sm leading-tight">
                        {property.address}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-purple-400">
                        <Image className="w-3 h-3" />
                        {property.images}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-purple-400 mb-1">
                          Repair Estimate
                        </div>
                        <div className="text-lg font-bold text-red-400">
                          ${property.repairEstimate.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-purple-400 mb-1">
                          Condition Score
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full"
                              style={{ width: `${property.conditionScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {property.conditionScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                      <div>
                        <span className="text-purple-400">
                          Profit Potential:
                        </span>
                        <div className="font-semibold text-emerald-400">
                          ${property.profitPotential.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-purple-400">Market Value:</span>
                        <div className="font-semibold text-white">
                          ${property.marketValue.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-purple-800/30">
                      <div className="flex items-center gap-2">
                        {property.stagedImages > 0 && (
                          <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full">
                            {property.stagedImages} staged
                          </span>
                        )}
                        {property.arVisualization && (
                          <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full">
                            AR Ready
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-all"
                      >
                        View Details
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs content would go here with similar purple theming... */}
        {activeTab !== "upload" && activeTab !== "results" && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              {activeTab === "staging" && (
                <Home className="w-8 h-8 text-white" />
              )}
              {activeTab === "ar" && <Eye className="w-8 h-8 text-white" />}
              {activeTab === "settings" && (
                <Settings className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === "staging" && "Virtual Staging Studio"}
              {activeTab === "ar" && "AR Visualization Center"}
              {activeTab === "settings" && "AI Settings"}
            </h3>
            <p className="text-purple-300 mb-6">
              {activeTab === "staging" &&
                "Transform empty properties with AI-generated furniture and decor"}
              {activeTab === "ar" &&
                "Immersive augmented reality property experiences"}
              {activeTab === "settings" &&
                "Configure AI models, accuracy thresholds, and processing options"}
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg">
              Coming Soon
            </button>
          </div>
        )}

        {/* Property Details Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-700/30">
              <div className="flex items-center justify-between p-6 border-b border-purple-700/30">
                <h3 className="text-xl font-semibold text-white">
                  {selectedProperty.address}
                </h3>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-2 hover:bg-purple-900/30 rounded-full text-purple-300 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Room Analysis */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Room-by-Room Analysis
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedProperty.roomAnalysis).map(
                      ([room, analysis]) => (
                        <div
                          key={room}
                          className="bg-slate-700/50 border border-purple-700/30 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize text-white">
                              {room.replace(/([A-Z])/g, " $1")}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getConditionColor(
                                analysis.condition
                              )}`}
                            >
                              {analysis.condition}
                            </span>
                          </div>
                          <div className="text-sm text-purple-300 mb-2">
                            Repairs needed:{" "}
                            {analysis.repairs.length > 0
                              ? analysis.repairs.join(", ")
                              : "None"}
                          </div>
                          <div className="font-semibold text-red-400">
                            ${analysis.cost.toLocaleString()}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-purple-700/30">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 transition-all shadow-lg">
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 transition-all shadow-lg">
                    <Home className="w-4 h-4" />
                    Virtual Staging
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 flex items-center gap-2 transition-all shadow-lg">
                    <Eye className="w-4 h-4" />
                    Launch AR
                  </button>
                  <button className="px-6 py-3 border border-purple-700/50 text-purple-300 rounded-lg hover:bg-purple-900/30 flex items-center gap-2 transition-all">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionAIPage;
