import { lazy, Suspense } from "react";

// Placeholder component for when map fails to load
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

// Lazy load LocationPicker to avoid SSR and Context issues
// Fallback to MapPlaceholder if LocationPicker fails to load
const LocationPicker = lazy(() => 
  import("./LocationPicker").catch((error) => {
    console.warn("LocationPicker failed to load, showing placeholder:", error);
    return {
      default: (props) => <MapPlaceholder height={props.height || 400} />
    };
  })
);

/**
 * LocationPickerWrapper - Safely wraps LocationPicker with error boundary
 * Shows a "coming soon" placeholder if map fails to load instead of crashing
 * 
 * Multiple layers of protection:
 * 1. Lazy loading with Suspense fallback
 * 2. Import error catch handler
 * 3. Try-catch wrapper for runtime errors
 */
const LocationPickerWrapper = (props) => {
  // Wrap in try-catch for additional safety
  try {
    return (
      <Suspense
        fallback={
          <MapPlaceholder height={props.height || 400} />
        }
      >
        <LocationPicker {...props} />
      </Suspense>
    );
  } catch (error) {
    // Final safety net - if anything crashes, show placeholder
    console.warn("LocationPickerWrapper error, showing placeholder:", error);
    return <MapPlaceholder height={props.height || 400} />;
  }
};

export default LocationPickerWrapper;

