/**
 * Geolocation Manager
 * Handles browser geolocation, location caching, and manual location entry
 */

const GeolocationManager = {
    // Current location cache
    currentLocation: null,
    watchId: null,

    /**
     * Get user's current location via browser GPS
     */
    async getCurrentLocation(options = {}) {
        const {
            timeout = 10000,
            maximumAge = 5 * 60 * 1000, // 5 minutes
            enableHighAccuracy = false,
            useCache = true
        } = options;

        // Return cached location if valid
        if (useCache && this.currentLocation && 
            Date.now() - this.currentLocation.timestamp < maximumAge) {
            return this.currentLocation;
        }

        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: Date.now(),
                            source: 'browser_geolocation'
                        };

                        // Cache the location
                        this.currentLocation = location;
                        localStorage.setItem('voyager_location', JSON.stringify(location));

                        resolve(location);
                    },
                    (error) => {
                        console.warn('Geolocation error:', error);
                        this.handleGeolocationError(error, resolve, reject);
                    },
                    {
                        enableHighAccuracy: enableHighAccuracy,
                        timeout: timeout,
                        maximumAge: maximumAge
                    }
                );
            } else {
                reject(new Error('Geolocation is not supported by this browser'));
            }
        });
    },

    /**
     * Watch user's location continuously
     */
    watchLocation(callback, options = {}) {
        const {
            enableHighAccuracy = false,
            timeout = 10000,
            maximumAge = 1000
        } = options;

        if ('geolocation' in navigator) {
            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        speed: position.coords.speed,
                        heading: position.coords.heading,
                        timestamp: Date.now(),
                        source: 'browser_geolocation_watch'
                    };

                    this.currentLocation = location;
                    callback(location);
                },
                (error) => {
                    console.warn('Location watch error:', error);
                    callback(null, error);
                },
                {
                    enableHighAccuracy: enableHighAccuracy,
                    timeout: timeout,
                    maximumAge: maximumAge
                }
            );
        }
    },

    /**
     * Stop watching location
     */
    stopWatchingLocation() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    },

    /**
     * Get location from address using geocoding
     */
    async getLocationFromAddress(address) {
        const primaryApi = APIConfig.getPrimaryApi();

        if (primaryApi === 'google' && APIConfig.google.isConfigured()) {
            return await this.geocodeWithGoogle(address);
        } else if (primaryApi === 'mapbox' && APIConfig.mapbox.isConfigured()) {
            return await this.geocodeWithMapbox(address);
        }

        return null;
    },

    /**
     * Geocode using Google Geocoding API
     */
    async geocodeWithGoogle(address) {
        try {
            const response = await fetch(
                `${APIConfig.google.endpoints.geocoding}/json?` +
                `address=${encodeURIComponent(address)}` +
                `&key=${APIConfig.google.apiKey}`
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                return {
                    latitude: result.geometry.location.lat,
                    longitude: result.geometry.location.lng,
                    address: result.formatted_address,
                    placeId: result.place_id,
                    source: 'google_geocoding'
                };
            }

            return null;
        } catch (error) {
            console.error('Google Geocoding error:', error);
            return null;
        }
    },

    /**
     * Geocode using Mapbox Geocoding API
     */
    async geocodeWithMapbox(address) {
        try {
            const response = await fetch(
                `${APIConfig.mapbox.endpoints.geocoding}/mapbox.places/` +
                `${encodeURIComponent(address)}.json?` +
                `access_token=${APIConfig.mapbox.accessToken}&limit=1`
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                return {
                    latitude: feature.center[1],
                    longitude: feature.center[0],
                    address: feature.place_name,
                    source: 'mapbox_geocoding'
                };
            }

            return null;
        } catch (error) {
            console.error('Mapbox Geocoding error:', error);
            return null;
        }
    },

    /**
     * Reverse geocoding - get address from coordinates
     */
    async getAddressFromLocation(latitude, longitude) {
        const primaryApi = APIConfig.getPrimaryApi();

        if (primaryApi === 'google' && APIConfig.google.isConfigured()) {
            return await this.reverseGeocodeWithGoogle(latitude, longitude);
        } else if (primaryApi === 'mapbox' && APIConfig.mapbox.isConfigured()) {
            return await this.reverseGeocodeWithMapbox(latitude, longitude);
        }

        return null;
    },

    /**
     * Reverse geocode using Google
     */
    async reverseGeocodeWithGoogle(latitude, longitude) {
        try {
            const response = await fetch(
                `${APIConfig.google.endpoints.geocoding}/json?` +
                `latlng=${latitude},${longitude}` +
                `&key=${APIConfig.google.apiKey}`
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                return {
                    address: data.results[0].formatted_address,
                    placeId: data.results[0].place_id
                };
            }

            return null;
        } catch (error) {
            console.error('Google Reverse Geocoding error:', error);
            return null;
        }
    },

    /**
     * Reverse geocode using Mapbox
     */
    async reverseGeocodeWithMapbox(latitude, longitude) {
        try {
            const response = await fetch(
                `${APIConfig.mapbox.endpoints.geocoding}/mapbox.places/` +
                `${longitude},${latitude}.json?` +
                `access_token=${APIConfig.mapbox.accessToken}&limit=1`
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                return {
                    address: data.features[0].place_name
                };
            }

            return null;
        } catch (error) {
            console.error('Mapbox Reverse Geocoding error:', error);
            return null;
        }
    },

    /**
     * Handle geolocation errors
     */
    handleGeolocationError(error, resolve, reject) {
        const cachedLocation = localStorage.getItem('voyager_location');
        
        if (cachedLocation) {
            // Use cached location as fallback
            const location = JSON.parse(cachedLocation);
            location.source = 'cache';
            resolve(location);
            return;
        }

        switch (error.code) {
            case error.PERMISSION_DENIED:
                reject(new Error('Location permission denied. Please enable location access.'));
                break;
            case error.POSITION_UNAVAILABLE:
                reject(new Error('Location information is unavailable.'));
                break;
            case error.TIMEOUT:
                reject(new Error('Location request timed out.'));
                break;
            default:
                reject(new Error('An unknown error occurred while getting location.'));
        }
    },

    /**
     * Check if browser supports geolocation
     */
    isSupported() {
        return 'geolocation' in navigator;
    },

    /**
     * Calculate distance between two coordinates (Haversine formula)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    /**
     * Get cached location
     */
    getCachedLocation() {
        if (this.currentLocation) {
            return this.currentLocation;
        }

        const cached = localStorage.getItem('voyager_location');
        if (cached) {
            return JSON.parse(cached);
        }

        return null;
    },

    /**
     * Clear cached location
     */
    clearCache() {
        this.currentLocation = null;
        localStorage.removeItem('voyager_location');
    }
};

// Export for use
window.GeolocationManager = GeolocationManager;
