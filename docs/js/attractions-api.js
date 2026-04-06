/**
 * Attractions API Manager
 * Fetches attractions from Google Places API and Mapbox with fallback to static data
 */

const AttractionsAPI = {
    // Cache for fetched attractions
    cache: {
        attractions: [],
        lastFetch: 0,
        ttl: 3600000 // 1 hour in milliseconds
    },

    // Static seed attractions (fallback)
    staticAttractions: [],

    /**
     * Fetch attractions near a location using Google Places API
     */
    async fetchFromGooglePlaces(latitude, longitude, radius = 5000, keyword = 'tourist_attraction') {
        if (!APIConfig.google.isConfigured()) {
            console.log('Google API not configured');
            return null;
        }

        try {
            const response = await fetch(
                `${APIConfig.google.endpoints.places}/nearbysearch/json?` +
                `location=${latitude},${longitude}` +
                `&radius=${radius}` +
                `&keyword=${keyword}` +
                `&key=${APIConfig.google.apiKey}` +
                `&type=point_of_interest`
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.status === 'OK') {
                return data.results.map(place => ({
                    id: place.place_id,
                    name: place.name,
                    location: place.vicinity || 'Location unavailable',
                    coordinates: {
                        lat: place.geometry.location.lat,
                        lon: place.geometry.location.lng
                    },
                    rating: place.rating || 0,
                    userRatings: place.user_ratings_total || 0,
                    image: place.photos?.[0]?.photo_reference ? this.getGooglePhotoUrl(place.photos[0].photo_reference) : 'https://via.placeholder.com/400x300?text=No+Image',
                    description: `Popular tourist attraction. ${place.opening_hours?.open_now ? 'Currently open' : 'Check hours'}`,
                    category: this.categorizePlace(place.types),
                    source: 'Google Places',
                    placeId: place.place_id
                }));
            }
            
            return null;
        } catch (error) {
            console.error('Google Places API error:', error);
            return null;
        }
    },

    /**
     * Fetch attractions using Mapbox Geocoding API
     */
    async fetchFromMapbox(latitude, longitude, query = 'attraction') {
        if (!APIConfig.mapbox.isConfigured()) {
            console.log('Mapbox API not configured');
            return null;
        }

        try {
            const types = ['poi']; // Points of Interest
            const proximity = `${longitude},${latitude}`;
            
            const response = await fetch(
                `${APIConfig.mapbox.endpoints.search}` +
                `?q=${query}` +
                `&proximity=${proximity}` +
                `&limit=20` +
                `&type=${types.join(',')}` +
                `&access_token=${APIConfig.mapbox.accessToken}`
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                return data.features.map(feature => ({
                    id: feature.id,
                    name: feature.properties.name || 'Unnamed Location',
                    location: feature.properties.full_address || feature.properties.address || 'Location unavailable',
                    coordinates: {
                        lat: feature.center[1],
                        lon: feature.center[0]
                    },
                    rating: 4.0, // Mapbox doesn't return ratings by default
                    userRatings: 0,
                    image: 'https://via.placeholder.com/400x300?text=Mapbox+Attraction',
                    description: feature.properties.description || 'Notable point of interest',
                    category: feature.properties.category || 'landmark',
                    source: 'Mapbox',
                    bbox: feature.bbox
                }));
            }
            
            return null;
        } catch (error) {
            console.error('Mapbox API error:', error);
            return null;
        }
    },

    /**
     * Get attractions with automatic API selection and fallback
     */
    async getAttractions(latitude, longitude, options = {}) {
        const {
            maxResults = 20,
            radius = 5000,
            useCache = true,
            forceRefresh = false
        } = options;

        // Check cache first
        if (useCache && !forceRefresh && this.cache.attractions.length > 0) {
            const cacheAge = Date.now() - this.cache.lastFetch;
            if (cacheAge < this.cache.ttl) {
                return this.cache.attractions;
            }
        }

        let attractions = [];

        // Try primary API
        const primaryApi = APIConfig.getPrimaryApi();
        
        if (primaryApi === 'google') {
            attractions = await this.fetchFromGooglePlaces(latitude, longitude, radius) || [];
        } else if (primaryApi === 'mapbox') {
            attractions = await this.fetchFromMapbox(latitude, longitude) || [];
        }

        // If primary failed, try secondary
        if (attractions.length === 0) {
            if (primaryApi === 'google' && APIConfig.mapbox.isConfigured()) {
                attractions = await this.fetchFromMapbox(latitude, longitude) || [];
            } else if (primaryApi === 'mapbox' && APIConfig.google.isConfigured()) {
                attractions = await this.fetchFromGooglePlaces(latitude, longitude, radius) || [];
            }
        }

        // Fallback to static attractions
        if (attractions.length === 0) {
            attractions = this.staticAttractions;
        }

        // Limit results
        attractions = attractions.slice(0, maxResults);

        // Update cache
        this.cache.attractions = attractions;
        this.cache.lastFetch = Date.now();

        return attractions;
    },

    /**
     * Google Places photo URL builder
     */
    getGooglePhotoUrl(photoReference, maxWidth = 400) {
        return `https://maps.googleapis.com/maps/api/place/photo?` +
               `maxwidth=${maxWidth}` +
               `&photo_reference=${photoReference}` +
               `&key=${APIConfig.google.apiKey}`;
    },

    /**
     * Categorize Google Places type into our categories
     */
    categorizePlace(types) {
        if (!types) return 'cities';
        
        const typeStr = types.join(',').toLowerCase();
        
        if (typeStr.includes('beach') || typeStr.includes('natural_feature')) return 'beaches';
        if (typeStr.includes('mountain') || typeStr.includes('park')) return 'mountains';
        if (typeStr.includes('city') || typeStr.includes('establishment')) return 'cities';
        
        return 'cities'; // default
    },

    /**
     * Set static attractions as fallback
     */
    setStaticAttractions(attractions) {
        this.staticAttractions = attractions;
    }
};

// Export for use
window.AttractionsAPI = AttractionsAPI;
