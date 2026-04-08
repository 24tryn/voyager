/**
 * Routes Page Logic
 * Handles route calculations, display, and trip management
 */

/**
 * Convert coordinates to user-friendly text format
 */
function formatCoordinates(latitude, longitude) {
    const latDirection = latitude >= 0 ? 'N' : 'S';
    const lonDirection = longitude >= 0 ? 'E' : 'W';
    const latValue = Math.abs(latitude).toFixed(2);
    const lonValue = Math.abs(longitude).toFixed(2);
    
    return `${latValue}°${latDirection}, ${lonValue}°${lonDirection}`;
}

/**
 * Get general area from coordinates (direction + distance approximation)
 */
function getAreaFromCoordinates(latitude, longitude) {
    // Determine general direction
    let latText = latitude > 0 ? 'Northern' : 'Southern';
    let lonText = longitude > 0 ? 'Eastern' : 'Western';
    
    // Get hemisphere info
    const hemisphere = latitude > 0 ? 'Northern Hemisphere' : 'Southern Hemisphere';
    
    return {
        formatted: `${latText}, ${lonText} Location`,
        full: `${latText}, ${lonText} - ${hemisphere}`
    };
}

// Static attractions for suggestions/fallback
const staticAttractions = [
    { name: "Machu Picchu", location: "Peru, South America", lat: -13.1631, lon: -72.5450 },
    { name: "Santorini", location: "Greece, Europe", lat: 36.3932, lon: 25.4615 },
    { name: "Tokyo", location: "Japan, Asia", lat: 35.6762, lon: 139.6503 },
    { name: "Amalfi Coast", location: "Italy, Europe", lat: 40.6333, lon: 14.6029 },
    { name: "Eiffel Tower", location: "France, Europe", lat: 48.8584, lon: 2.2945 },
    { name: "Maldives", location: "Indian Ocean, Asia", lat: 4.1694, lon: 73.5093 },
    { name: "Swiss Alps", location: "Switzerland, Europe", lat: 46.8182, lon: 8.2275 },
    { name: "New York City", location: "USA, North America", lat: 40.7128, lon: -74.0060 },
    { name: "Bali Beaches", location: "Indonesia, Asia", lat: -8.6705, lon: 115.2126 },
    { name: "Rocky Mountains", location: "Canada, North America", lat: 53.1109, lon: -117.2171 },
    { name: "Paris", location: "France, Europe", lat: 48.8566, lon: 2.3522 },
    { name: "Barcelona", location: "Spain, Europe", lat: 41.3851, lon: 2.1734 },
    { name: "Rome", location: "Italy, Europe", lat: 41.9028, lon: 12.4964 },
    { name: "London", location: "UK, Europe", lat: 51.5074, lon: -0.1278 },
    { name: "Sydney", location: "Australia, Oceania", lat: -33.8688, lon: 151.2093 },
    { name: "Dubai", location: "UAE, Asia", lat: 25.2048, lon: 55.2708 },
    { name: "Singapore", location: "Singapore, Asia", lat: 1.3521, lon: 103.8198 },
    { name: "Bangkok", location: "Thailand, Asia", lat: 13.7563, lon: 100.5018 },
    { name: "Mexico City", location: "Mexico, North America", lat: 19.4326, lon: -99.1332 },
    { name: "Toronto", location: "Canada, North America", lat: 43.6532, lon: -79.3832 }
];

let currentTrip = {
    id: 'trip_' + Date.now(),
    name: 'My Trip',
    startLocation: null,
    endLocation: null,
    routes: {},
    attractions: [],
    totalDistance: 0,
    totalCost: 0,
    startDate: new Date().toISOString(),
    notes: ''
};

// DOM Elements
const detectLocationBtn = document.getElementById('detect-location-btn');
const fromLocationInput = document.getElementById('from-location-input');
const toLocationInput = document.getElementById('to-location-input');
const destinationSuggestions = document.getElementById('destination-suggestions');
const routesSection = document.getElementById('routes-section');
const routesContainer = document.getElementById('routes-container');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const exportSection = document.getElementById('export-section');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    AttractionsAPI.setStaticAttractions(getStaticAttractions());
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
    detectLocationBtn.addEventListener('click', handleDetectLocation);
    fromLocationInput.addEventListener('change', handleLocationChange);
    
    // Destination input with real-time suggestions
    toLocationInput.addEventListener('input', handleDestinationInput);
    toLocationInput.addEventListener('keyup', handleDestinationKeyup);
    toLocationInput.addEventListener('change', handleDestinationChange);
    toLocationInput.addEventListener('blur', function() {
        // Hide suggestions after a short delay (allows click on suggestion)
        setTimeout(() => {
            destinationSuggestions.classList.add('hidden');
        }, 200);
    });
}

/**
 * Handle destination input for autocomplete
 */
function handleDestinationInput(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length === 0) {
        destinationSuggestions.classList.add('hidden');
        return;
    }

    // Filter attractions based on search query
    const filtered = staticAttractions.filter(attr => 
        attr.name.toLowerCase().includes(query) || 
        attr.location.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        destinationSuggestions.classList.add('hidden');
        return;
    }

    // Display suggestions
    destinationSuggestions.innerHTML = filtered.map(attr => `
        <div class="px-4 py-3 border-b border-outline-variant/10 cursor-pointer hover:bg-surface-container transition-colors" onclick="selectDestinationSuggestion('${attr.name}', ${attr.lat}, ${attr.lon}, '${attr.location}')">
            <div class="font-semibold text-on-surface">${attr.name}</div>
            <div class="text-xs text-on-surface-variant">${attr.location}</div>
        </div>
    `).join('');

    destinationSuggestions.classList.remove('hidden');
}

/**
 * Handle destination keyup for Enter key
 */
function handleDestinationKeyup(e) {
    if (e.key === 'Enter') {
        destinationSuggestions.classList.add('hidden');
        handleDestinationChange();
    }
}

/**
 * Select a destination from suggestions
 */
async function selectDestinationSuggestion(name, lat, lon, location) {
    toLocationInput.value = name;
    destinationSuggestions.classList.add('hidden');
    
    // Set destination directly without geocoding
    currentTrip.endLocation = {
        name: name,
        location: location,
        coordinates: {
            lat: lat,
            lon: lon
        }
    };

    document.getElementById('to-location-display').classList.remove('hidden');
    document.getElementById('to-location-text').textContent = `${name}, ${location}`;

    // Calculate routes immediately
    await calculateRoutes();
}

/**
 * Handle detecting user location
 */
async function handleDetectLocation() {
    showLoading(true);
    clearError();

    try {
        const location = await GeolocationManager.getCurrentLocation();
        
        currentTrip.startLocation = {
            name: 'Your Location',
            coordinates: {
                lat: location.latitude,
                lon: location.longitude
            }
        };

        // Get address from coordinates
        const address = await GeolocationManager.getAddressFromLocation(
            location.latitude,
            location.longitude
        );

        if (address) {
            currentTrip.startLocation.name = address.address;
            fromLocationInput.value = address.address;
        } else {
            // If address lookup fails, show user-friendly coordinate format
            const areaInfo = getAreaFromCoordinates(location.latitude, location.longitude);
            const coordFormat = formatCoordinates(location.latitude, location.longitude);
            currentTrip.startLocation.name = areaInfo.formatted;
            fromLocationInput.value = `${areaInfo.formatted} (${coordFormat})`;
        }

        document.getElementById('from-location-display').classList.remove('hidden');
        document.getElementById('from-location-text').textContent = currentTrip.startLocation.name;

        showLoading(false);
    } catch (error) {
        showError(error.message);
        showLoading(false);
    }
}

/**
 * Handle manual location entry
 */
async function handleLocationChange() {
    const address = fromLocationInput.value.trim();
    if (!address) return;

    showLoading(true);
    clearError();

    try {
        const location = await GeolocationManager.getLocationFromAddress(address);
        
        if (location) {
            currentTrip.startLocation = {
                name: location.address || address,
                coordinates: {
                    lat: location.latitude,
                    lon: location.longitude
                }
            };

            document.getElementById('from-location-display').classList.remove('hidden');
            document.getElementById('from-location-text').textContent = currentTrip.startLocation.name;
        } else {
            showError('Could not find location. Please try a different address.');
        }

        showLoading(false);
    } catch (error) {
        showError(error.message);
        showLoading(false);
    }
}

/**
 * Handle destination change
 */
async function handleDestinationChange() {
    const address = toLocationInput.value.trim();
    if (!address || !currentTrip.startLocation) {
        routesSection.classList.add('hidden');
        return;
    }

    showLoading(true);
    clearError();

    try {
        // First try to geocode with API
        let location = await GeolocationManager.getLocationFromAddress(address);
        
        // If API fails, try to match with static attractions
        if (!location) {
            const matchedAttraction = staticAttractions.find(attr => 
                attr.name.toLowerCase() === address.toLowerCase()
            );
            
            if (matchedAttraction) {
                location = {
                    latitude: matchedAttraction.lat,
                    longitude: matchedAttraction.lon,
                    address: `${matchedAttraction.name}, ${matchedAttraction.location}`,
                    source: 'static_attractions'
                };
            }
        }

        if (!location) {
            showError('Destination not found. Try selecting from suggestions or enter a full city name (e.g., "Tokyo, Japan")');
            showLoading(false);
            return;
        }

        currentTrip.endLocation = {
            name: location.address || address,
            coordinates: {
                lat: location.latitude,
                lon: location.longitude
            }
        };

        document.getElementById('to-location-display').classList.remove('hidden');
        document.getElementById('to-location-text').textContent = currentTrip.endLocation.name;

        // Calculate routes
        await calculateRoutes();

    } catch (error) {
        showError(error.message);
    }

    showLoading(false);
}

/**
 * Calculate routes with all transport methods
 */
/**
 * Calculate estimated routes using Haversine formula (fallback)
 */
function calculateEstimatedRoutes(origin, destination) {
    // Calculate straight-line distance (most accurate for distance)
    const distance = GeolocationManager.calculateDistance(
        origin.lat,
        origin.lon,
        destination.lat,
        destination.lon
    );

    // Create estimated routes with different transport modes
    const estimatedRoutes = {};

    // Driving (assumes 25% longer route due to roads)
    const drivingDistance = distance * 1.25;
    estimatedRoutes.driving = {
        distance: DirectionsManager.formatDistance(drivingDistance * 1609.34), // Convert miles to meters
        distanceValue: drivingDistance * 1609.34,
        duration: DirectionsManager.formatDuration(drivingDistance * 120), // Avg 30 mph = 120 seconds per mile
        durationValue: drivingDistance * 120,
        steps: [{
            instruction: 'Travel to destination',
            distance: DirectionsManager.formatDistance(drivingDistance * 1609.34),
            duration: DirectionsManager.formatDuration(drivingDistance * 120),
            start: origin,
            end: destination
        }],
        mode: 'driving',
        source: 'Estimated (straight-line distance)',
        isEstimated: true
    };

    // Walking (assumes 30% longer route)
    const walkingDistance = distance * 1.30;
    estimatedRoutes.walking = {
        distance: DirectionsManager.formatDistance(walkingDistance * 1609.34),
        distanceValue: walkingDistance * 1609.34,
        duration: DirectionsManager.formatDuration(walkingDistance * 1200), // Avg 3 mph = 1200 seconds per mile
        durationValue: walkingDistance * 1200,
        steps: [{
            instruction: 'Walk to destination',
            distance: DirectionsManager.formatDistance(walkingDistance * 1609.34),
            duration: DirectionsManager.formatDuration(walkingDistance * 1200),
            start: origin,
            end: destination
        }],
        mode: 'walking',
        source: 'Estimated (straight-line distance)',
        isEstimated: true
    };

    // Bicycling (assumes 20% longer route)
    const bicyclingDistance = distance * 1.20;
    estimatedRoutes.bicycling = {
        distance: DirectionsManager.formatDistance(bicyclingDistance * 1609.34),
        distanceValue: bicyclingDistance * 1609.34,
        duration: DirectionsManager.formatDuration(bicyclingDistance * 480), // Avg 12.5 mph = 480 seconds per mile
        durationValue: bicyclingDistance * 480,
        steps: [{
            instruction: 'Cycle to destination',
            distance: DirectionsManager.formatDistance(bicyclingDistance * 1609.34),
            duration: DirectionsManager.formatDuration(bicyclingDistance * 480),
            start: origin,
            end: destination
        }],
        mode: 'bicycling',
        source: 'Estimated (straight-line distance)',
        isEstimated: true
    };

    // Transit (assumes similar to driving + waiting time)
    const transitDistance = distance * 1.25;
    estimatedRoutes.transit = {
        distance: DirectionsManager.formatDistance(transitDistance * 1609.34),
        distanceValue: transitDistance * 1609.34,
        duration: DirectionsManager.formatDuration((transitDistance * 120) + 600), // Add 10 min waiting time
        durationValue: (transitDistance * 120) + 600,
        steps: [{
            instruction: 'Use public transit to destination',
            distance: DirectionsManager.formatDistance(transitDistance * 1609.34),
            duration: DirectionsManager.formatDuration((transitDistance * 120) + 600),
            start: origin,
            end: destination
        }],
        mode: 'transit',
        source: 'Estimated (straight-line distance)',
        isEstimated: true
    };

    // Flight (straight-line distance, fastest mode)
    // Airlines fly relatively straight paths, plus ~30 mins for takeoff/landing and airport procedures
    const flightTime = (distance / 500) * 3600 + 1800; // 500 mph cruise speed + 30 min overhead
    estimatedRoutes.flight = {
        distance: DirectionsManager.formatDistance(distance * 1609.34),
        distanceValue: distance * 1609.34,
        duration: DirectionsManager.formatDuration(flightTime), // Flight time with overhead
        durationValue: flightTime,
        steps: [{
            instruction: 'Fly to destination',
            distance: DirectionsManager.formatDistance(distance * 1609.34),
            duration: DirectionsManager.formatDuration(flightTime),
            start: origin,
            end: destination
        }],
        mode: 'flight',
        source: 'Estimated (straight-line distance)',
        isEstimated: true
    };

    return estimatedRoutes;
}

/**
 * Calculate routes with all transport methods
 */
async function calculateRoutes() {
    if (!currentTrip.startLocation || !currentTrip.endLocation) return;

    showLoading(true);
    clearError();

    try {
        const origin = currentTrip.startLocation.coordinates;
        const destination = currentTrip.endLocation.coordinates;

        // Available transport modes (including flight)
        const modes = ['driving', 'walking', 'bicycling', 'transit', 'flight'];

        // Get all routes
        let routes = await DirectionsManager.getRoutes(origin, destination, { modes });

        // If API fails, use estimated routes
        if (Object.keys(routes).length === 0) {
            routes = calculateEstimatedRoutes(origin, destination);
        }

        currentTrip.routes = routes;

        // Calculate trip summary
        if (routes.driving) {
            const drivingRoute = routes.driving;
            currentTrip.totalDistance = DirectionsManager.getDistanceInMiles(drivingRoute.distanceValue);
            currentTrip.totalCost = (currentTrip.totalDistance * 0.625).toFixed(2); // Estimated gas cost
        }

        // Display routes
        displayRoutes(routes);
        routesSection.classList.remove('hidden');
        exportSection.classList.remove('hidden');

    } catch (error) {
        showError('Error calculating routes: ' + error.message);
    }

    showLoading(false);
}

/**
 * Display calculated routes
 */
function displayRoutes(routes) {
    routesContainer.innerHTML = '';

    // Check if any route is estimated
    const hasEstimatedRoutes = Object.values(routes).some(route => route.isEstimated);
    
    // Show notification if using estimated routes
    if (hasEstimatedRoutes) {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'mb-6 bg-tertiary-container/20 border border-tertiary text-on-surface-variant p-4 rounded-lg flex items-start gap-3';
        notificationDiv.innerHTML = `
            <span class="material-symbols-outlined text-tertiary mt-0.5">info</span>
            <div>
                <p class="font-semibold text-on-surface mb-1">Estimated Routes Displayed</p>
                <p class="text-sm">API unavailable. Showing estimated distances and times based on direct distance calculations.</p>
            </div>
        `;
        routesContainer.appendChild(notificationDiv);
    }

    const modeEmojis = {
        driving: '🚗',
        walking: '🚶',
        bicycling: '🚴',
        transit: '🚌',
        flight: '✈️'
    };

    const modeNames = {
        driving: 'Driving',
        walking: 'Walking',
        bicycling: 'Cycling',
        transit: 'Public Transit',
        flight: 'Flight'
    };

    Object.entries(routes).forEach(([mode, route]) => {
        const estimatedCost = getEstimatedCost(mode, route.distanceValue);
        const distanceInMiles = DirectionsManager.getDistanceInMiles(route.distanceValue);
        const durationInMinutes = DirectionsManager.getDurationInMinutes(route.durationValue);

        const card = document.createElement('div');
        card.className = 'bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer';
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h3 class="text-xl font-semibold text-on-surface mb-1 flex items-center gap-2">
                        <span class="text-2xl">${modeEmojis[mode]}</span>
                        ${modeNames[mode]}
                        ${route.isEstimated ? '<span class="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded-full ml-2">Estimated</span>' : ''}
                    </h3>
                    <p class="text-sm text-on-surface-variant">${route.source}</p>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-primary">${distanceInMiles} miles</p>
                    <p class="text-sm text-on-surface-variant">${route.duration}</p>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-outline-variant/20">
                <div>
                    <p class="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Distance</p>
                    <p class="font-semibold text-on-surface">${distanceInMiles} mi</p>
                </div>
                <div>
                    <p class="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Time</p>
                    <p class="font-semibold text-on-surface">${durationInMinutes} min</p>
                </div>
                <div>
                    <p class="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Est. Cost</p>
                    <p class="font-semibold text-secondary">$${estimatedCost}</p>
                </div>
            </div>

            <div class="mb-4">
                <p class="text-xs text-on-surface-variant uppercase tracking-wider mb-2">Route Steps</p>
                <div class="max-h-48 overflow-y-auto">
                    ${route.steps.slice(0, 5).map((step, idx) => `
                        <div class="text-sm text-on-surface py-2 flex gap-3">
                            <span class="font-bold text-primary min-w-fit">${idx + 1}.</span>
                            <span>${step.instruction}</span>
                        </div>
                    `).join('')}
                    ${route.steps.length > 5 ? `
                        <div class="text-sm text-on-surface-variant py-2">
                            ... and ${route.steps.length - 5} more steps
                        </div>
                    ` : ''}
                </div>
            </div>

            <button class="w-full bg-primary text-on-primary px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all" onclick="selectRoute('${mode}')">
                Select Route
            </button>
        `;

        routesContainer.appendChild(card);
    });
}

/**
 * Estimate cost based on transport mode
 */
function getEstimatedCost(mode, distanceValue) {
    const distanceInMiles = DirectionsManager.getDistanceInMiles(distanceValue);
    const costs = DirectionsManager.getEstimatedCosts(distanceInMiles);
    return costs[mode] || 0;
}

/**
 * Select a route and add to trip
 */
function selectRoute(mode) {
    if (currentTrip.routes[mode]) {
        currentTrip.selectedRoute = mode;
        alert(`Route via ${mode} selected!`);
        // Store selection in localStorage for persistence
        localStorage.setItem('voyager_trip', JSON.stringify(currentTrip));
    }
}

/**
 * Export current trip
 */
function exportCurrentTrip(format) {
    if (format === 'json') {
        TripExporter.exportAsJSON(currentTrip);
    } else if (format === 'pdf') {
        TripExporter.exportAsPDF(currentTrip);
    } else if (format === 'ics') {
        TripExporter.exportAsICalendar(currentTrip);
    }
}

/**
 * Copy trip share link
 */
function copyTripLink() {
    TripExporter.copyShareLink(currentTrip);
}

/**
 * Show loading state
 */
function showLoading(show) {
    loadingState.classList.toggle('hidden', !show);
}

/**
 * Show error state
 */
function showError(message) {
    errorMessage.textContent = message;
    errorState.classList.remove('hidden');
}

/**
 * Clear error state
 */
function clearError() {
    errorState.classList.add('hidden');
    errorMessage.textContent = '';
}

/**
 * Debounce helper
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Get static attractions for fallback
 */
function getStaticAttractions() {
    return [
        {
            id: 1,
            name: "Machu Picchu",
            location: "Peru, South America",
            coordinates: { lat: -13.1631, lon: -72.5450 },
            category: "mountains",
            basePrice: 1200,
            rating: 4.9,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVplr1185h2C2f6k-QjNmv2nWzRtmppTrk-1FxQLe6hIay7VzQOG_IKMoadDBif1xy0aCxEPo5PDGMN0ISXsqbn3MvSLNeTjWkguQUmENT_Znsueiy2nQMn6zZiChgsi01FSKR2wHMgC7Z-lBFX39Lkb2gZT7ESPIje9NFGgkcpcCbldre6nMJzmJa7Dns7m52Inp1XcXzKDhZ4vpeL3VKPLh4Swm0EicaCHYfSH2Piz1yNJ3yxQT11Z_eMjlmQn4A9bk4N9JlvtQw",
            description: "The 15th-century Inca citadel, located in the Eastern Cordillera of southern Peru."
        }
    ];
}

// Load saved trip on page load
window.addEventListener('load', function() {
    const savedTrip = localStorage.getItem('voyager_trip');
    if (savedTrip) {
        currentTrip = JSON.parse(savedTrip);
    }
});

/**
 * Utility: Debounce function
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}
