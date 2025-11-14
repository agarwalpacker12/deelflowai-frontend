import { useEffect, useState, useRef } from "react";
import SimpleLocationInput from "./SimpleLocationInput";

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao";
// Generate unique callback name for each load
const generateCallbackName = () => `initGoogleMaps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Map placeholder component
const MapPlaceholder = ({ height = 400 }) => (
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

// Load Google Maps script
const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.Map) {
      console.log("Google Maps already loaded");
      resolve(window.google.maps);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      console.log("Google Maps script already exists, waiting for load...");
      // Check if it's already loaded
      if (window.google && window.google.maps && window.google.maps.Map) {
        resolve(window.google.maps);
        return;
      }
      
      // Wait for it to load using polling
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          clearInterval(checkInterval);
          resolve(window.google.maps);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (window.google && window.google.maps && window.google.maps.Map) {
          resolve(window.google.maps);
        } else {
          reject(new Error("Google Maps failed to load within timeout"));
        }
      }, 10000);
      
      return;
    }

    console.log("Loading Google Maps script...");
    
    // Create unique callback function
    const callbackName = generateCallbackName();
    window[callbackName] = () => {
      console.log("Google Maps callback executed");
      if (window.google && window.google.maps && window.google.maps.Map) {
        delete window[callbackName]; // Clean up
        resolve(window.google.maps);
      } else {
        delete window[callbackName]; // Clean up
        reject(new Error("Google Maps API not available after callback"));
      }
    };
    
    // Create and load script with callback
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    
    // Timeout fallback
    const timeout = setTimeout(() => {
      if (window[callbackName]) {
        delete window[callbackName];
      }
      if (window.google && window.google.maps && window.google.maps.Map) {
        resolve(window.google.maps);
      } else {
        console.error("Google Maps failed to load within timeout");
        reject(new Error("Google Maps API not available after script load"));
      }
    }, 15000);
    
    script.onerror = () => {
      if (window[callbackName]) {
        delete window[callbackName];
      }
      clearTimeout(timeout);
      console.error("Failed to load Google Maps script");
      reject(new Error("Failed to load Google Maps script"));
    };
    
    document.head.appendChild(script);
  });
};

/**
 * LocationPicker Component with Google Maps
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
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(null);
  const [mapContainerReady, setMapContainerReady] = useState(false);

  // Callback ref to ensure we know when the container is ready
  const setMapRef = (node) => {
    mapRef.current = node;
    if (node) {
      setMapContainerReady(true);
    }
  };

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load Google Maps and initialize map
  useEffect(() => {
    if (!isClient || !mapContainerReady || !mapRef.current) {
      return;
    }

    let isMounted = true;
    let googleMapsInstance = null;
    let billingErrorHandler = null;

    // Listen for global Google Maps errors (like billing errors)
    billingErrorHandler = (event) => {
      const error = event.error || event;
      const errorMessage = error?.message || String(error) || '';
      const errorName = error?.name || '';
      
      if (
        errorName === 'BillingNotEnabledMapError' ||
        errorMessage.includes('BillingNotEnabled') ||
        errorMessage.includes('billing') ||
        errorMessage.includes('Billing') ||
        String(error).includes('BillingNotEnabled')
      ) {
        console.warn("Detected Google Maps billing error via global handler:", error);
        if (isMounted) {
          setError(new Error("Google Maps billing is not enabled. Please use the location fields above to enter coordinates manually."));
          setGoogleMapsLoaded(false);
          setIsLoading(false);
        }
        // Prevent default error handling
        event.preventDefault?.();
        return true;
      }
      return false;
    };

    // Add both error and unhandledrejection listeners
    window.addEventListener('error', billingErrorHandler, true);
    window.addEventListener('unhandledrejection', (event) => {
      if (billingErrorHandler(event)) {
        event.preventDefault();
      }
    });

    const initializeMap = async () => {
      if (!mapRef.current) {
        console.error("Map ref is null in initializeMap");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("Initializing Google Maps...");

        // Load Google Maps API
        const googleMaps = await loadGoogleMaps();
        googleMapsInstance = googleMaps;
        
        if (!isMounted) {
          console.log("Component unmounted, aborting map initialization");
          return;
        }

        if (!mapRef.current) {
          console.error("Map ref is null after loading Google Maps");
          throw new Error("Map container element not found");
        }

        console.log("Creating Google Map instance...");
        // Initialize map
        const map = new googleMaps.Map(mapRef.current, {
          center: { lat: initialPosition[0], lng: initialPosition[1] },
          zoom: zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });
        
        // Listen for map errors (like billing errors)
        googleMaps.event.addListenerOnce(map, 'tilesloaded', () => {
          console.log("Map tiles loaded successfully");
        });
        
        // Listen for errors
        googleMaps.event.addListener(map, 'error', (error) => {
          console.error("Google Maps error:", error);
          if (isMounted) {
            if (error && (error.message?.includes('BillingNotEnabled') || error.message?.includes('billing'))) {
              setError(new Error("Google Maps billing is not enabled. Please enable billing in Google Cloud Console."));
            } else {
              setError(new Error(error?.message || "Failed to load Google Maps"));
            }
            setGoogleMapsLoaded(false);
            setIsLoading(false);
          }
        });
        
        console.log("Map created successfully");

        mapInstanceRef.current = map;
        
        // Check for billing errors after a short delay
        const checkTimeout = setTimeout(() => {
          if (isMounted && mapRef.current) {
            // Check if Google's error overlay is present
            const mapDiv = mapRef.current;
            const hasErrorOverlay = mapDiv.querySelector('.gm-err-container') || 
                                   mapDiv.querySelector('[role="alert"]') ||
                                   mapDiv.querySelector('.gm-style > div[style*="opacity"]') ||
                                   mapDiv.textContent?.includes("can't load Google Maps") ||
                                   mapDiv.textContent?.includes("This page can't load Google Maps") ||
                                   mapDiv.textContent?.includes("Do you own this website");
            
            if (hasErrorOverlay) {
              console.warn("Detected Google Maps error overlay - billing likely not enabled");
              if (isMounted) {
                setError(new Error("Google Maps billing is not enabled. Please use the location fields above to enter coordinates manually."));
                setGoogleMapsLoaded(false);
                setIsLoading(false);
              }
              return;
            }
            
            // Also check if map tiles failed to load (another sign of billing error)
            // Wait a bit more to see if tiles load
            setTimeout(() => {
              if (isMounted && mapRef.current) {
                const mapTiles = mapRef.current.querySelectorAll('img[src*="maps.googleapis.com"]');
                const hasTiles = mapTiles.length > 0;
                const stillHasErrorOverlay = mapRef.current.querySelector('.gm-err-container') || 
                                            mapRef.current.querySelector('[role="alert"]') ||
                                            mapRef.current.textContent?.includes("can't load Google Maps");
                
                if (!hasTiles || stillHasErrorOverlay) {
                  // No map tiles loaded or error overlay still present - likely a billing issue
                  console.warn("No map tiles detected or error overlay present - billing may not be enabled");
                  if (isMounted) {
                    setError(new Error("Google Maps billing is not enabled. Please use the location fields above to enter coordinates manually."));
                    setGoogleMapsLoaded(false);
                    setIsLoading(false);
                    return;
                  }
                }
                
                // If no error detected, mark as loaded
                if (isMounted) {
                  setGoogleMapsLoaded(true);
                  setIsLoading(false);
                }
              }
            }, 1000);
          }
        }, 2000);
        
        // Store timeout for cleanup
        if (mapInstanceRef.current) {
          mapInstanceRef.current._checkTimeout = checkTimeout;
        }

        // Create initial marker if position is provided
        if (position) {
          markerRef.current = new googleMaps.Marker({
            position: { lat: position.lat, lng: position.lng },
            map: map,
            draggable: true,
            title: 'Selected Location',
          });

          // Add drag end listener
          markerRef.current.addListener('dragend', (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setPosition({ lat, lng });
            if (onLocationSelect) {
              onLocationSelect({ lat, lng });
            }
          });
        }

        // Add click listener to map
        const clickListener = map.addListener('click', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          setPosition({ lat, lng });
          
          // Update or create marker
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
          } else {
            markerRef.current = new googleMaps.Marker({
              position: { lat, lng },
              map: map,
              draggable: true,
              title: 'Selected Location',
            });

            // Add drag end listener
            markerRef.current.addListener('dragend', (e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              setPosition({ lat, lng });
              if (onLocationSelect) {
                onLocationSelect({ lat, lng });
              }
            });
          }

          // Call callback
          if (onLocationSelect) {
            onLocationSelect({ lat, lng });
          }
        });

        console.log("Map initialization complete");

        // Store listener for cleanup
        mapInstanceRef.current._clickListener = clickListener;
      } catch (err) {
        console.error("Failed to load Google Maps:", err);
        if (isMounted) {
          // Check for billing errors
          const errorMessage = err?.message || String(err) || '';
          if (errorMessage.includes('BillingNotEnabled') || errorMessage.includes('billing') || errorMessage.includes('Billing')) {
            setError(new Error("Google Maps billing is not enabled. Please use the location fields above to enter coordinates manually."));
          } else {
            setError(err instanceof Error ? err : new Error(String(err)));
          }
          setGoogleMapsLoaded(false);
          setIsLoading(false);
        }
      }
    };

    // Initialize map when container is ready
    initializeMap();

    return () => {
      isMounted = false;
      // Remove global error listeners
      if (billingErrorHandler) {
        window.removeEventListener('error', billingErrorHandler, true);
      }
      // Cleanup: remove map listeners if needed
      if (mapInstanceRef.current && googleMapsInstance) {
        if (mapInstanceRef.current._clickListener) {
          googleMapsInstance.event.removeListener(mapInstanceRef.current._clickListener);
        }
      }
    };
  }, [isClient, mapContainerReady, initialPosition, zoom, onLocationSelect]);

  // Update marker position when position changes
  useEffect(() => {
    if (position && markerRef.current && mapInstanceRef.current) {
      markerRef.current.setPosition({ lat: position.lat, lng: position.lng });
      mapInstanceRef.current.setCenter({ lat: position.lat, lng: position.lng });
    } else if (position && !markerRef.current && mapInstanceRef.current && window.google && window.google.maps) {
      // Create marker if it doesn't exist but position is set
      markerRef.current = new window.google.maps.Marker({
        position: { lat: position.lat, lng: position.lng },
        map: mapInstanceRef.current,
        draggable: true,
        title: 'Selected Location',
      });

      // Add drag end listener
      markerRef.current.addListener('dragend', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setPosition({ lat, lng });
        if (onLocationSelect) {
          onLocationSelect({ lat, lng });
        }
      });
    }
  }, [position, onLocationSelect]);

  // Show placeholder if not client-side yet
  if (!isClient) {
    return <MapPlaceholder height={height} />;
  }

  // Always render the map container so ref can be attached
  return (
    <div className="w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
      <div className="relative" style={{ height: `${height}px`, width: '100%' }}>
        {/* Google Maps container - always render so ref can be attached */}
        <div
          ref={setMapRef}
          style={{ width: '100%', height: '100%', minHeight: `${height}px` }}
          className="rounded-lg"
        />
        
        {/* Show placeholder overlay if map not loaded or error */}
        {(!googleMapsLoaded || error) && !isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center z-[9999]">
            <div className="text-center p-8 max-w-md">
              <div className="mb-4">
                {error ? (
                  <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {error ? "Map Unavailable" : "Interactive Map"}
              </h3>
              <p className="text-gray-600 mb-4">
                {error 
                  ? (error.message?.includes('billing') || error.message?.includes('BillingNotEnabled')
                      ? "Google Maps billing is not enabled. Please use the location fields above to enter coordinates manually."
                      : "Failed to load map. Please use the location fields above to enter coordinates manually.")
                  : "Loading map..."}
              </p>
              {error && error.message && !error.message.includes('billing') && (
                <p className="text-sm text-gray-500">
                  {error.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md z-[1000]">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium text-gray-700">Loading map...</span>
            </div>
          </div>
        )}

        {/* Instructions overlay */}
        {!position && !isLoading && (
          <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-md z-[1000] max-w-xs">
            <p className="text-sm font-medium">Click on the map to select a location</p>
            <p className="text-xs text-blue-100 mt-1">You can drag the marker to adjust</p>
          </div>
        )}

        {/* Selected location info */}
        {position && !isLoading && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md z-[1000]">
            <p className="text-xs font-semibold text-gray-700 mb-1">Selected Location</p>
            <p className="text-xs text-gray-600">
              {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
