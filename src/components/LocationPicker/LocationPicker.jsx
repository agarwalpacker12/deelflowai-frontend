import { useEffect, useState } from "react";

// Lazy load react-leaflet components to avoid SSR and Context issues
let MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap, L;
let leafletLoaded = false;

// Try to import react-leaflet, but handle gracefully if it fails
const loadLeaflet = async () => {
  if (leafletLoaded) return true;
  
  try {
    // Use dynamic import for better compatibility with Vite
    const [leafletModule, leafletL] = await Promise.all([
      import("react-leaflet"),
      import("leaflet")
    ]);
    
    // Import leaflet CSS
    await import("leaflet/dist/leaflet.css");
    
    MapContainer = leafletModule.MapContainer;
    TileLayer = leafletModule.TileLayer;
    Marker = leafletModule.Marker;
    useMapEvents = leafletModule.useMapEvents;
    Popup = leafletModule.Popup;
    useMap = leafletModule.useMap;
    L = leafletL.default || leafletL;
    
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
  
  // Check if hooks are available
  if (!useMap || !useMapEvents) {
    return null;
  }
  
  const map = useMap();
  
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMapPosition([lat, lng]);
      onLocationSelect({ lat, lng });
    },
  });

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
    // Load leaflet after component mounts (client-side only)
    if (typeof window !== 'undefined') {
      loadLeaflet().then(loaded => {
        setLeafletAvailable(loaded);
      }).catch(err => {
        console.error("Failed to load react-leaflet:", err);
        setLeafletAvailable(false);
      });
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

  // Check if react-leaflet is available
  if (!isClient || !leafletAvailable || !MapContainer || !TileLayer) {
    return (
      <div className="w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        <div className="relative bg-gray-100 flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center p-8">
            <p className="text-gray-600 mb-2">Map unavailable</p>
            <p className="text-sm text-gray-500">
              Please install react-leaflet: <code className="bg-gray-200 px-2 py-1 rounded">npm install react-leaflet leaflet</code>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Or enter coordinates manually in the location fields above.
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
