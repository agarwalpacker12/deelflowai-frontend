import { useEffect, useState } from "react";
import SimpleLocationInput from "./SimpleLocationInput";

// ENABLED: react-leaflet with React 18 compatibility fixes
// Set to true to enable map, false to use SimpleLocationInput fallback
const USE_LEAFLET = true; // Try enabling with React 18 fixes

// Lazy load react-leaflet components to avoid SSR and Context issues
let MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap, L;
let leafletLoaded = false;

// Try to import react-leaflet, but handle gracefully if it fails
const loadLeaflet = async () => {
  // If leaflet is disabled, don't try to load it
  if (!USE_LEAFLET) {
    return false;
  }
  
  if (leafletLoaded) return true;
  
  try {
    // Use dynamic import for better compatibility with Vite
    const [leafletModule, leafletL] = await Promise.all([
      import("react-leaflet"),
      import("leaflet")
    ]);
    
    // Import leaflet CSS
    await import("leaflet/dist/leaflet.css");
    
    // React 18 compatibility: Ensure we get the actual components, not wrapped versions
    MapContainer = leafletModule.MapContainer || leafletModule.default?.MapContainer;
    TileLayer = leafletModule.TileLayer || leafletModule.default?.TileLayer;
    Marker = leafletModule.Marker || leafletModule.default?.Marker;
    useMapEvents = leafletModule.useMapEvents || leafletModule.default?.useMapEvents;
    Popup = leafletModule.Popup || leafletModule.default?.Popup;
    useMap = leafletModule.useMap || leafletModule.default?.useMap;
    L = leafletL.default || leafletL;
    
    // Validate that we got actual functions, not undefined
    if (!MapContainer || typeof MapContainer !== 'function') {
      throw new Error("MapContainer is not a valid function");
    }
    if (!TileLayer || typeof TileLayer !== 'function') {
      throw new Error("TileLayer is not a valid function");
    }
    
    // Fix for default marker icon in React-Leaflet
    if (L && L.Icon && L.Icon.Default) {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    }
    
    leafletLoaded = true;
    return true;
  } catch (error) {
    console.warn("react-leaflet not available, LocationPicker will be disabled:", error);
    return false;
  }
};

/**
 * Map click handler component - must be inside MapContainer
 */
function MapClickHandler({ onLocationSelect, position }) {
  const [mapPosition, setMapPosition] = useState(position);
  
  // Check if hooks are available and are functions
  if (!useMap || typeof useMap !== 'function' || !useMapEvents || typeof useMapEvents !== 'function') {
    return null;
  }
  
  let map;
  try {
    map = useMap();
  } catch (error) {
    console.error("useMap hook error:", error);
    return null;
  }
  
  // Safely call useMapEvents
  try {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMapPosition([lat, lng]);
        onLocationSelect({ lat, lng });
      },
    });
  } catch (error) {
    console.error("useMapEvents error:", error);
    return null;
  }

  // Update position when prop changes
  useEffect(() => {
    if (position && map) {
      setMapPosition(position);
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  // Handle marker drag
  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setMapPosition([lat, lng]);
    onLocationSelect({ lat, lng });
  };

  if (!Marker || !Popup) {
    return null;
  }

  return mapPosition ? (
    <Marker 
      position={mapPosition} 
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">Selected Location</p>
          <p className="text-gray-600">
            {mapPosition[0].toFixed(4)}, {mapPosition[1].toFixed(4)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Drag marker to adjust
          </p>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

/**
 * LocationPicker Component
 * 
 * @param {Object} props
 * @param {Function} props.onLocationSelect - Callback when location is selected (receives {lat, lng})
 * @param {Array} props.initialPosition - Initial map center [lat, lng] (default: India)
 * @param {Number} props.zoom - Initial zoom level (default: 5)
 * @param {Number} props.height - Map height in pixels (default: 400)
 */
const LocationPicker = ({
  onLocationSelect,
  initialPosition = [20.5937, 78.9629], // India center
  zoom = 5,
  height = 400,
}) => {
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [leafletAvailable, setLeafletAvailable] = useState(false);

  // Only render on client side to avoid SSR issues and load leaflet
  useEffect(() => {
    setIsClient(true);
    // Only try to load leaflet if it's enabled
    if (USE_LEAFLET && typeof window !== 'undefined') {
      loadLeaflet().then(loaded => {
        setLeafletAvailable(loaded);
      }).catch(err => {
        console.warn("Failed to load react-leaflet, showing placeholder:", err);
        setLeafletAvailable(false);
      });
    } else {
      // Leaflet is disabled, mark as unavailable
      setLeafletAvailable(false);
    }
  }, []);

  const handleLocationSelect = async ({ lat, lng }) => {
    setPosition([lat, lng]);
    setIsLoading(true);
    
    try {
      // Call the callback with coordinates
      if (onLocationSelect) {
        await onLocationSelect({ lat, lng });
      }
    } catch (error) {
      console.error("Error handling location select:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if react-leaflet is available or if it's disabled
  // If not available, show a "coming soon" placeholder instead of crashing
  if (!USE_LEAFLET || !isClient || !leafletAvailable || !MapContainer || !TileLayer) {
    // Show a nice placeholder message instead of crashing
    return (
      <div className="w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center p-8 max-w-md">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
            <p className="text-gray-600 mb-4">
              Live interactive map will be integrated soon.
            </p>
            <p className="text-sm text-gray-500">
              Please use the location fields above to enter coordinates manually.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Additional validation: Ensure MapContainer and TileLayer are functions
  if (typeof MapContainer !== 'function' || typeof TileLayer !== 'function') {
    console.error("MapContainer or TileLayer is not a function, showing placeholder");
    return (
      <div className="w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center p-8 max-w-md">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
            <p className="text-gray-600 mb-4">
              Live interactive map will be integrated soon.
            </p>
            <p className="text-sm text-gray-500">
              Please use the location fields above to enter coordinates manually.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
      <style>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>
      <div className="relative" style={{ height: `${height}px` }}>
        <MapContainer
          center={initialPosition}
          zoom={zoom}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          scrollWheelZoom={true}
          key={`map-${isClient}`} // Force re-render on client
        >
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler
            onLocationSelect={handleLocationSelect}
            position={position}
          />
        </MapContainer>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md z-[1000]">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium text-gray-700">Loading location...</span>
            </div>
          </div>
        )}

        {/* Instructions overlay */}
        {!position && (
          <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-md z-[1000] max-w-xs">
            <p className="text-sm font-medium">Click on the map to select a location</p>
            <p className="text-xs text-blue-100 mt-1">You can drag the marker to adjust</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
