/**
 * City matching utility for matching geocoded city names with database cities
 * Handles variations, abbreviations, and fuzzy matching
 */

/**
 * Normalize a string for comparison (remove special chars, lowercase, trim)
 */
const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

/**
 * Check if two strings are similar (fuzzy match)
 */
const areSimilar = (str1, str2, threshold = 0.7) => {
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);
  
  // Exact match after normalization
  if (normalized1 === normalized2) return true;
  
  // One contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  // Calculate similarity using Levenshtein distance (simple version)
  const longer = normalized1.length > normalized2.length ? normalized1 : normalized2;
  const shorter = normalized1.length > normalized2.length ? normalized2 : normalized1;
  
  if (longer.length === 0) return true;
  
  // Simple similarity check
  const distance = levenshteinDistance(normalized1, normalized2);
  const similarity = 1 - (distance / longer.length);
  
  return similarity >= threshold;
};

/**
 * Simple Levenshtein distance calculation
 */
const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

/**
 * Extract city name variations from geocoded data
 */
export const extractCityVariations = (geocodeComponents) => {
  const variations = [];
  
  if (!geocodeComponents) return variations;
  
  // Primary city name
  if (geocodeComponents.city) {
    variations.push(geocodeComponents.city);
  }
  
  // Alternative names from Nominatim
  if (geocodeComponents.town) {
    variations.push(geocodeComponents.town);
  }
  
  if (geocodeComponents.village) {
    variations.push(geocodeComponents.village);
  }
  
  if (geocodeComponents.municipality) {
    variations.push(geocodeComponents.municipality);
  }
  
  if (geocodeComponents.county) {
    variations.push(geocodeComponents.county);
  }
  
  if (geocodeComponents.suburb) {
    variations.push(geocodeComponents.suburb);
  }
  
  if (geocodeComponents.neighbourhood) {
    variations.push(geocodeComponents.neighbourhood);
  }
  
  // Remove duplicates and empty strings
  return [...new Set(variations.filter(v => v && v.trim()))];
};

/**
 * Find the best matching city from a list of cities
 * @param {string|Array<string>} geocodedCityNames - City name(s) from geocoding
 * @param {Array} databaseCities - Array of city objects from database
 * @returns {Object|null} - Best matching city object or null
 */
export const findBestMatchingCity = (geocodedCityNames, databaseCities) => {
  if (!geocodedCityNames || !databaseCities || databaseCities.length === 0) {
    return null;
  }
  
  // Convert single string to array
  const cityNames = Array.isArray(geocodedCityNames) 
    ? geocodedCityNames 
    : [geocodedCityNames];
  
  // Try exact match first
  for (const cityName of cityNames) {
    const exactMatch = databaseCities.find(
      city => normalizeString(city.name) === normalizeString(cityName)
    );
    if (exactMatch) {
      return exactMatch;
    }
  }
  
  // Try contains match
  for (const cityName of cityNames) {
    const containsMatch = databaseCities.find(
      city => 
        normalizeString(city.name).includes(normalizeString(cityName)) ||
        normalizeString(cityName).includes(normalizeString(city.name))
    );
    if (containsMatch) {
      return containsMatch;
    }
  }
  
  // Try fuzzy match with higher threshold
  for (const cityName of cityNames) {
    const fuzzyMatch = databaseCities.find(
      city => areSimilar(city.name, cityName, 0.8)
    );
    if (fuzzyMatch) {
      return fuzzyMatch;
    }
  }
  
  // Try fuzzy match with lower threshold
  for (const cityName of cityNames) {
    const fuzzyMatch = databaseCities.find(
      city => areSimilar(city.name, cityName, 0.6)
    );
    if (fuzzyMatch) {
      return fuzzyMatch;
    }
  }
  
  return null;
};

/**
 * Find city by coordinates (nearest city)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Array} databaseCities - Array of city objects with latitude/longitude
 * @param {number} maxDistanceKm - Maximum distance in kilometers (default: 50)
 * @returns {Object|null} - Nearest city object or null
 */
export const findCityByCoordinates = (lat, lng, databaseCities, maxDistanceKm = 50) => {
  if (!lat || !lng || !databaseCities || databaseCities.length === 0) {
    return null;
  }
  
  let nearestCity = null;
  let minDistance = Infinity;
  
  for (const city of databaseCities) {
    if (city.latitude && city.longitude) {
      const distance = calculateDistance(
        lat, 
        lng, 
        parseFloat(city.latitude), 
        parseFloat(city.longitude)
      );
      
      if (distance < minDistance && distance <= maxDistanceKm) {
        minDistance = distance;
        nearestCity = city;
      }
    }
  }
  
  return nearestCity;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

