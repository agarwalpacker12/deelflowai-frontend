/**
 * Reverse Geocoding Service
 * Converts latitude/longitude to address components
 */

/**
 * Reverse geocode using OpenCage API (free tier available)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Location details with country, state, city, district
 */
export const reverseGeocodeOpenCage = async (lat, lng) => {
  const API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
  
  if (!API_KEY) {
    throw new Error("OpenCage API key not found. Please set VITE_OPENCAGE_API_KEY in your .env file");
  }

  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}&limit=1`
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("No location found for these coordinates");
    }

    const result = data.results[0];
    const components = result.components;

    // Extract location components
    const locationData = {
      country: components.country || "",
      state: components.state || components.state_district || "",
      city: components.city || components.town || components.village || "",
      district: components.county || components.state_district || "",
      postal_code: components.postcode || "",
      formatted_address: result.formatted || "",
      latitude: lat,
      longitude: lng,
    };

    return locationData;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    throw error;
  }
};

/**
 * Reverse geocode using Nominatim (OpenStreetMap - free, no API key needed)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Location details with country, state, city, district
 */
export const reverseGeocodeNominatim = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "DeelflowAI/1.0", // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.address) {
      throw new Error("No location found for these coordinates");
    }

    const address = data.address;

    // Extract location components (Nominatim uses different field names)
    const locationData = {
      country: address.country || "",
      state: address.state || address.region || "",
      city: address.city || address.town || address.village || address.municipality || "",
      district: address.county || address.state_district || "",
      postal_code: address.postcode || "",
      formatted_address: data.display_name || "",
      latitude: lat,
      longitude: lng,
    };

    return locationData;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    throw error;
  }
};

/**
 * Main reverse geocoding function
 * Tries OpenCage first, falls back to Nominatim if no API key
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Location details
 */
export const reverseGeocode = async (lat, lng) => {
  const API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

  // Try OpenCage if API key is available
  if (API_KEY) {
    try {
      return await reverseGeocodeOpenCage(lat, lng);
    } catch (error) {
      console.warn("OpenCage geocoding failed, falling back to Nominatim:", error);
    }
  }

  // Fallback to Nominatim (free, no API key needed)
  return await reverseGeocodeNominatim(lat, lng);
};

/**
 * Forward geocode - convert address to coordinates
 * @param {string} address - Address string
 * @returns {Promise<Object>} Coordinates {lat, lng}
 */
export const forwardGeocode = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          "User-Agent": "DeelflowAI/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("No location found for this address");
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      formatted_address: data[0].display_name,
    };
  } catch (error) {
    console.error("Forward geocoding error:", error);
    throw error;
  }
};

