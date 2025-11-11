import { lazy, Suspense } from "react";

// Lazy load LocationPicker to avoid SSR and Context issues
const LocationPicker = lazy(() => 
  import("./LocationPicker").catch(() => ({
    default: () => (
      <div className="w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        <div className="relative bg-gray-100 flex items-center justify-center" style={{ height: "400px" }}>
          <div className="text-center p-8">
            <p className="text-gray-600 mb-2">Map unavailable</p>
            <p className="text-sm text-gray-500">
              Location picker is temporarily unavailable.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please enter location details manually in the form fields above.
            </p>
          </div>
        </div>
      </div>
    )
  }))
);

/**
 * LocationPickerWrapper - Safely wraps LocationPicker with error boundary
 */
const LocationPickerWrapper = (props) => {
  return (
    <Suspense
      fallback={
        <div className="w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
          <div className="relative bg-gray-100 flex items-center justify-center" style={{ height: props.height || 400 }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        </div>
      }
    >
      <LocationPicker {...props} />
    </Suspense>
  );
};

export default LocationPickerWrapper;

