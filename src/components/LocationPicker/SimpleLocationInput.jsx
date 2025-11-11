import { useState } from "react";
import { MapPin } from "lucide-react";

/**
 * SimpleLocationInput - Fallback component that doesn't require react-leaflet
 * Provides manual coordinate input when map is unavailable
 */
const SimpleLocationInput = ({ onLocationSelect, initialPosition = [20.5937, 78.9629], height = 400 }) => {
  const [latitude, setLatitude] = useState(initialPosition[0]?.toString() || "");
  const [longitude, setLongitude] = useState(initialPosition[1]?.toString() || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      if (onLocationSelect) {
        onLocationSelect({ lat, lng });
      }
    } else {
      alert("Please enter valid coordinates:\nLatitude: -90 to 90\nLongitude: -180 to 180");
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
      <div className="relative bg-gray-50 p-6" style={{ minHeight: `${height}px` }}>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Enter Location Coordinates</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Enter latitude and longitude coordinates manually. You can find coordinates using{" "}
          <a 
            href="https://www.google.com/maps" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Google Maps
          </a>{" "}
          or other mapping services.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="-90"
                max="90"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 25.7617"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Range: -90 to 90</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="-180"
                max="180"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., -80.1918"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Range: -180 to 180</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Use These Coordinates
          </button>
        </form>

        {latitude && longitude && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-1">Current Coordinates:</p>
            <p className="text-sm text-blue-700 font-mono">
              {parseFloat(latitude).toFixed(6)}, {parseFloat(longitude).toFixed(6)}
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            <strong>Tip:</strong> Right-click on any location in Google Maps and select "What's here?" to see coordinates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLocationInput;

