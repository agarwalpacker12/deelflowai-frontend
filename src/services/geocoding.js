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

