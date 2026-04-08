/**
 * Directions & Routes Manager
 * Handles routes, directions, travel time, and transport options
 */

const DirectionsManager = {
    // Cache routes for performance
    cache: new Map(),

    // Transport modes available
    modes: {
        google: ['driving', 'walking', 'bicycling', 'transit'],
        mapbox: ['driving', 'walking', 'cycling']
    },

    /**
     * Get directions from Google Directions API
     */
    async getGoogleDirections(origin, destination, mode = 'driving') {
        if (!APIConfig.google.isConfigured()) return null;

        const cacheKey = `${origin.lat},${origin.lon}->${destination.lat},${destination.lon}-${mode}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(
                `${APIConfig.google.endpoints.directions}/json?` +
                `origin=${origin.lat},${origin.lon}` +
                `&destination=${destination.lat},${destination.lon}` +
                `&mode=${mode}` +
                `&key=${APIConfig.google.apiKey}`
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();

            if (data.status === 'OK' && data.routes.length > 0) {
                const route = data.routes[0];
                const leg = route.legs[0];

                const result = {
                    distance: leg.distance.text,
                    distanceValue: leg.distance.value, // meters
                    duration: leg.duration.text,
                    durationValue: leg.duration.value, // seconds
                    steps: leg.steps.map(step => ({
                        instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
                        distance: step.distance.text,
                        duration: step.duration.text,
                        start: step.start_location,
                        end: step.end_location
                    })),
                    polyline: route.overview_polyline.points,
                    mode: mode,
                    source: 'Google'
                };

                this.cache.set(cacheKey, result);
                return result;
            }
            
            return null;
        } catch (error) {
            console.error('Google Directions API error:', error);
            return null;
        }
    },

    /**
     * Get directions from Mapbox Directions API
     */
    async getMapboxDirections(origin, destination, mode = 'driving') {
        if (!APIConfig.mapbox.isConfigured()) return null;

        // Map our modes to Mapbox profile names
        const profileMap = {
            driving: 'driving',
            walking: 'walking',
            cycling: 'cycling',
            transit: 'driving' // Mapbox doesn't have transit, use driving
        };

        const profile = profileMap[mode] || 'driving';
        const cacheKey = `${origin.lat},${origin.lon}->${destination.lat},${destination.lon}-${mode}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(
                `${APIConfig.mapbox.endpoints.directions}/${profile}/` +
                `${origin.lon},${origin.lat};${destination.lon},${destination.lat}` +
                `?steps=true&geometries=geojson&overview=full` +
                `&access_token=${APIConfig.mapbox.accessToken}`
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];

                const result = {
                    distance: this.formatDistance(route.distance),
                    distanceValue: route.distance, // meters
                    duration: this.formatDuration(route.duration),
                    durationValue: route.duration, // seconds
                    steps: route.legs.flatMap((leg, legIdx) => 
                        leg.steps.map(step => ({
                            instruction: step.maneuver?.instruction || 'Continue',
                            distance: this.formatDistance(step.distance),
                            duration: this.formatDuration(step.duration),
                            start: { lat: step.geometry.coordinates[0][1], lng: step.geometry.coordinates[0][0] },
                            end: { lat: step.geometry.coordinates[step.geometry.coordinates.length - 1][1], lng: step.geometry.coordinates[step.geometry.coordinates.length - 1][0] }
                        }))
                    ),
                    geometry: route.geometry,
                    mode: mode,
                    source: 'Mapbox'
                };

                this.cache.set(cacheKey, result);
                return result;
            }
            
            return null;
        } catch (error) {
            console.error('Mapbox Directions API error:', error);
            return null;
        }
    },

    /**
     * Get routes with all available transport modes
     */
    async getRoutes(origin, destination, options = {}) {
        const {
            modes = ['driving', 'walking', 'bicycling', 'transit'],
            usePrimaryApi = true
        } = options;

        const routes = {};
        const primaryApi = APIConfig.getPrimaryApi();

        for (const mode of modes) {
            let route = null;

            if (primaryApi === 'google' && APIConfig.google.isConfigured()) {
                route = await this.getGoogleDirections(origin, destination, mode);
            } else if (primaryApi === 'mapbox' && APIConfig.mapbox.isConfigured()) {
                route = await this.getMapboxDirections(origin, destination, mode);
            }

            // Fallback to other API
            if (!route && primaryApi === 'google' && APIConfig.mapbox.isConfigured()) {
                route = await this.getMapboxDirections(origin, destination, mode);
            } else if (!route && primaryApi === 'mapbox' && APIConfig.google.isConfigured()) {
                route = await this.getGoogleDirections(origin, destination, mode);
            }

            if (route) {
                routes[mode] = route;
            }
        }

        return routes;
    },

    /**
     * Format distance from meters to miles/km
     */
    formatDistance(meters) {
        if (meters < 1000) {
            return `${Math.round(meters)} m`;
        } else {
            const km = (meters / 1000).toFixed(1);
            return `${km} km`;
        }
    },

    /**
     * Format duration from seconds to readable time
     */
    formatDuration(seconds) {
        if (seconds < 60) {
            return `${Math.round(seconds)} sec`;
        } else if (seconds < 3600) {
            const minutes = Math.round(seconds / 60);
            return `${minutes} min`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.round((seconds % 3600) / 60);
            return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
        }
    },

    /**
     * Convert duration to minutes for sorting/calculations
     */
    getDurationInMinutes(durationValue) {
        return Math.round(durationValue / 60);
    },

    /**
     * Convert distance to miles
     */
    getDistanceInMiles(distanceValue) {
        return (distanceValue / 1609.34).toFixed(1);
    },

    /**
     * Get estimated costs for different transport modes
     */
    getEstimatedCosts(distanceInMiles) {
        return {
            driving: (distanceInMiles * 0.625).toFixed(2), // $0.625 per mile avg
            transit: Math.max(2.50, (distanceInMiles * 0.15).toFixed(2)), // ~$0.15 per mile, min $2.50
            walking: 0, // Free
            bicycling: 0, // Free
            flight: Math.max(150, (distanceInMiles * 0.25).toFixed(2)) // ~$0.25 per mile, min $150 base fare
        };
    },

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
};

// Export for use
window.DirectionsManager = DirectionsManager;
