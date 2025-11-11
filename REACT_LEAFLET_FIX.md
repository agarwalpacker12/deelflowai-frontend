# React-Leaflet Installation Fix

## Problem
- `TypeError: render2 is not a function` - Context.Consumer error
- `npm i react-leaflet` requires `--force` to install
- Campaign page crashes when LocationPicker is used

## Root Cause
React-Leaflet v4.2.1 may have compatibility issues with React 18.2.0, causing Context API errors.

## Solution Applied

### 1. Updated LocationPicker Component
- Changed to use dynamic imports (Vite-compatible)
- Added client-side only rendering
- Added graceful fallback if react-leaflet fails to load
- Wrapped in Suspense for lazy loading

### 2. Created LocationPickerWrapper
- Wraps LocationPicker with error boundary
- Provides fallback UI if component fails
- Prevents app crashes

### 3. Updated Imports
- Campaign forms now use `LocationPickerWrapper` instead of `LocationPicker`
- This ensures safe loading even if react-leaflet has issues

## Installation Fix

If you still need to install react-leaflet:

```bash
# Remove existing installation
npm uninstall react-leaflet leaflet

# Clear cache
npm cache clean --force

# Install with specific versions that work with React 18
npm install react-leaflet@^4.2.1 leaflet@^1.9.4 --legacy-peer-deps

# Or if that doesn't work, try:
npm install react-leaflet@^4.2.1 leaflet@^1.9.4 --force
```

## Alternative: Make LocationPicker Optional

If react-leaflet continues to cause issues, you can:

1. **Remove LocationPicker entirely** - Users can enter coordinates manually
2. **Use a different map library** - Google Maps, Mapbox, etc.
3. **Use a simpler coordinate input** - Just text fields for lat/lng

## Testing

After applying the fix:

1. **Test Campaign Wizard**:
   - Navigate to `/app/campaigns`
   - Click "Campaign Wizard"
   - Should open without errors

2. **Test LocationPicker**:
   - If react-leaflet is installed: Map should load
   - If react-leaflet fails: Fallback message should show
   - App should NOT crash in either case

## Current Status

- ✅ LocationPickerWrapper created - prevents crashes
- ✅ Dynamic imports implemented - avoids SSR issues
- ✅ Fallback UI added - graceful degradation
- ✅ Campaign forms updated - use wrapper component

The campaign page should now work even if react-leaflet has issues!

