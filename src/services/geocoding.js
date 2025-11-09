/**
 * Geocoding service for reverse geocoding (coordinates to address)
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Reverse geocode coordinates to get address
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object>} Address information
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const url = `${NOMINATIM_BASE_URL}?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DeelFlowAI/1.0', // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return {
      success: true,
      address: data.display_name,
      components: {
        city: data.address?.city || data.address?.town || data.address?.village || '',
        town: data.address?.town || '',
        village: data.address?.village || '',
        municipality: data.address?.municipality || '',
        county: data.address?.county || '',
        suburb: data.address?.suburb || '',
        neighbourhood: data.address?.neighbourhood || '',
        state: data.address?.state || data.address?.region || '',
        country: data.address?.country || '',
        countryCode: data.address?.country_code?.toUpperCase() || '',
        postcode: data.address?.postcode || '',
        street: data.address?.road || '',
        houseNumber: data.address?.house_number || '',
      },
      coordinates: {
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
      },
      raw: data, // Include raw data for debugging
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      success: false,
      error: error.message,
      address: null,
      components: null,
    };
  }
};

/**
 * Forward geocode address to get coordinates
 * @param {string} address - Address string
 * @returns {Promise<Object>} Coordinates and address information
 */
export const forwardGeocode = async (address) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DeelFlowAI/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'Address not found',
        coordinates: null,
      };
    }

    const result = data[0];
    
    return {
      success: true,
      coordinates: {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      },
      address: result.display_name,
      components: {
        city: result.address?.city || result.address?.town || result.address?.village || '',
        state: result.address?.state || result.address?.region || '',
        country: result.address?.country || '',
        countryCode: result.address?.country_code?.toUpperCase() || '',
        postcode: result.address?.postcode || '',
      },
    };
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return {
      success: false,
      error: error.message,
      coordinates: null,
    };
  }
};


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

