/**
 * API Configuration Manager
 * Handles API keys, endpoints, and fallback strategies
 */

const APIConfig = {
    // Google APIs Configuration
    google: {
        // Get your API keys from:
        // https://console.cloud.google.com/
        // Make sure to enable: Places API, Maps JavaScript API, Directions API
        apiKey: '', // Will be set via environment or user input
        endpoints: {
            places: 'https://maps.googleapis.com/maps/api/place',
            directions: 'https://maps.googleapis.com/maps/api/directions',
            geocoding: 'https://maps.googleapis.com/maps/api/geocode'
        },
        isConfigured: function() {
            return this.apiKey && this.apiKey.length > 0;
        }
    },

    // Mapbox Configuration
    mapbox: {
        // Get your token from: https://account.mapbox.com/tokens/
        accessToken: '', // Set via environment or localStorage - DO NOT commit secrets
        endpoints: {
            geocoding: 'https://api.mapbox.com/geocoding/v5',
            directions: 'https://api.mapbox.com/directions/v5',
            search: 'https://api.mapbox.com/search/geocode/v6'
        },
        isConfigured: function() {
            return this.accessToken && this.accessToken.length > 0;
        }
    },

    // Configuration helper
    setGoogleApiKey: function(key) {
        this.google.apiKey = key;
        localStorage.setItem('voyager_google_api_key', key);
    },

    setMapboxToken: function(token) {
        this.mapbox.accessToken = token;
        localStorage.setItem('voyager_mapbox_token', token);
    },

    // Load from localStorage
    loadFromStorage: function() {
        const savedGoogle = localStorage.getItem('voyager_google_api_key');
        const savedMapbox = localStorage.getItem('voyager_mapbox_token');
        
        if (savedGoogle) this.google.apiKey = savedGoogle;
        if (savedMapbox) this.mapbox.accessToken = savedMapbox;
    },

    // Get primary API (Google) or fallback (Mapbox)
    getPrimaryApi: function() {
        if (this.google.isConfigured()) return 'google';
        if (this.mapbox.isConfigured()) return 'mapbox';
        return null;
    },

    // Check if any API is configured
    isAnyApiConfigured: function() {
        return this.google.isConfigured() || this.mapbox.isConfigured();
    },

    // Reset configuration
    reset: function() {
        this.google.apiKey = '';
        this.mapbox.accessToken = '';
        localStorage.removeItem('voyager_google_api_key');
        localStorage.removeItem('voyager_mapbox_token');
    }
};

// Load saved configuration on init
APIConfig.loadFromStorage();

// Export for use
window.APIConfig = APIConfig;
