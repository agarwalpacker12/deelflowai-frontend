import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component to handle map click events
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
}

// Component to update map center when location changes
function MapCenterUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

const LocationPicker = ({
  initialPosition = { lat: 25.7617, lng: -80.1918 }, // Default to Miami
  onLocationChange,
  height = '400px',
  className = '',
  markerColor = 'blue',
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const markerRef = useRef(null);

  useEffect(() => {
    if (initialPosition && (initialPosition.lat !== position.lat || initialPosition.lng !== position.lng)) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  const handleLocationSelect = (location) => {
    setPosition(location);
    if (onLocationChange) {
      onLocationChange(location);
    }
  };

  const handleMarkerDragEnd = (e) => {
    const marker = e.target;
    const newPosition = marker.getLatLng();
    setPosition({ lat: newPosition.lat, lng: newPosition.lng });
    if (onLocationChange) {
      onLocationChange({ lat: newPosition.lat, lng: newPosition.lng });
    }
    setIsDragging(false);
  };

  const handleMarkerDragStart = () => {
    setIsDragging(true);
  };

  // Create custom marker icon based on color
  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            width: 12px;
            height: 12px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <div className={`location-picker ${className}`} style={{ height, position: 'relative' }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '12px', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution=""
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        <MapCenterUpdater center={[position.lat, position.lng]} />
        <Marker
          position={[position.lat, position.lng]}
          icon={createCustomIcon(markerColor)}
          draggable={true}
          ref={markerRef}
          eventHandlers={{
            dragend: handleMarkerDragEnd,
            dragstart: handleMarkerDragStart,
          }}
        />
      </MapContainer>
      {isDragging && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-10">
          Dragging marker...
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-gray-600 shadow-lg z-10">
        <div className="font-semibold">📍 Selected Location</div>
        <div>Lat: {position.lat.toFixed(6)}</div>
        <div>Lng: {position.lng.toFixed(6)}</div>
      </div>
    </div>
  );
};

export default LocationPicker;

