// Explore Page - Attractions & Search Functionality

// World cities with coordinates for distance calculation
const cityCoordinates = {
    "San Francisco, USA": { lat: 37.7749, lon: -122.4194 },
    "New York, USA": { lat: 40.7128, lon: -74.0060 },
    "Los Angeles, USA": { lat: 34.0522, lon: -118.2437 },
    "Chicago, USA": { lat: 41.8781, lon: -87.6298 },
    "Miami, USA": { lat: 25.7617, lon: -80.1918 },
    "London, UK": { lat: 51.5074, lon: -0.1278 },
    "Paris, France": { lat: 48.8566, lon: 2.3522 },
    "Berlin, Germany": { lat: 52.5200, lon: 13.4050 },
    "Tokyo, Japan": { lat: 35.6762, lon: 139.6503 },
    "Sydney, Australia": { lat: -33.8688, lon: 151.2093 },
    "Dubai, UAE": { lat: 25.2048, lon: 55.2708 },
    "Singapore": { lat: 1.3521, lon: 103.8198 },
    "Bangkok, Thailand": { lat: 13.7563, lon: 100.5018 },
    "Barcelona, Spain": { lat: 41.3851, lon: 2.1734 },
    "Rome, Italy": { lat: 41.9028, lon: 12.4964 },
    "Toronto, Canada": { lat: 43.6532, lon: -79.3832 },
    "Mexico City, Mexico": { lat: 19.4326, lon: -99.1332 }
};

const attractions = [
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
    },
    {
        id: 2,
        name: "Santorini",
        location: "Greece, Europe",
        coordinates: { lat: 36.3932, lon: 25.4615 },
        category: "beaches",
        basePrice: 850,
        rating: 4.8,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPwlMzOBqTm5yhn9VAEKxexTNfQSge38y6Spq2KdGHc6eZv2bWL3sdPy8KTsx464TkBvcmLhj1_JiF38PTjm8TPzLiiNh5wdf5ac8NzHqDiYgHW45Y_yvFb2R_9D6tKqFw--NeeAcjYnFhSsPDhFM9SDGcGfFjFr4qckt0jb8j_lcuUfG5d5c_Cf9DZu_-aK6IHZKx18hsJz-1w-sZOH_qWtbeiwxIEakZaEd1qkU_YywJRW1zbUCWJG3ZXSr_T-ULuj4W2vZ0LIcy",
        description: "Aegean architectural marvel with white-washed buildings and blue domes."
    },
    {
        id: 3,
        name: "Tokyo",
        location: "Japan, Asia",
        coordinates: { lat: 35.6762, lon: 139.6503 },
        category: "cities",
        basePrice: 1450,
        rating: 4.7,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvn1tZW7B5EmWzDv06em8ImoTM9q4Ugb0xh_dAUXHEscleHPf02_DGRJKIEX3Te_2xufSeGh_MwRAH5zQnPp7opiiNiwER8pslQaQFevOo1FrKNmrrSEX0refpmFmvFXLJo2gCf_toVmpZ6zFMHPBh45T_nuCVz1FxUK_74ohxJZp3GasFw_tOykTMBHiOaetZ9PZ1XISDcgZ2jlPMoIh0KDT7ZNPRbyrc8XHMv0QeY2PRnsmqt8A-3sXL3a-WJ2qLWBKeodCnSwkY",
        description: "Neon-lit streets and ancient tradition in Japan's vibrant capital."
    },
    {
        id: 4,
        name: "Amalfi Coast",
        location: "Italy, Europe",
        coordinates: { lat: 40.6333, lon: 14.6029 },
        category: "beaches",
        basePrice: 1100,
        rating: 4.6,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBknrcmpzq-O2URZXMeLI-w0ZLsrkbuDlQHzMiwBnTXungIF50AoFUp99yN3zI7AfaElFnXssbTzSipUthd0Sau4T62TKBR1CneyK7UxmPW5FvU_t_HUgSbCkqzIYpFIc2mwz8UUeEus3oWjAsYZQMSPm3NV0PUxGYbFTQkWld8Pz11hkJg9MfDuIVRQ-LunUYEDyyKGJcg8ods89otxmF4zpwupd96huDknmLhXua5sYHIoi-VVBHzK6e_QThzh8UA76Y7PNf5RAty",
        description: "Picturesque coastal town with colorful pastel houses and turquoise Mediterranean waters."
    },
    {
        id: 5,
        name: "Eiffel Tower",
        location: "France, Europe",
        coordinates: { lat: 48.8584, lon: 2.2945 },
        category: "cities",
        basePrice: 750,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
        description: "The iconic iron lattice tower in Paris, one of the most visited monuments in the world."
    },
    {
        id: 6,
        name: "Maldives",
        location: "Indian Ocean, Asia",
        coordinates: { lat: 4.1694, lon: 73.5093 },
        category: "beaches",
        basePrice: 2200,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
        description: "Luxurious tropical island nation known for crystal-clear waters and overwater bungalows."
    },
    {
        id: 7,
        name: "Swiss Alps",
        location: "Switzerland, Europe",
        coordinates: { lat: 46.8182, lon: 8.2275 },
        category: "mountains",
        basePrice: 1800,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        description: "Stunning mountain range offering world-class skiing and scenic alpine villages."
    },
    {
        id: 8,
        name: "New York City",
        location: "USA, North America",
        coordinates: { lat: 40.7128, lon: -74.0060 },
        category: "cities",
        basePrice: 950,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
        description: "The city that never sleeps with iconic skyscrapers, Broadway shows, and world-class museums."
    },
    {
        id: 9,
        name: "Bali Beaches",
        location: "Indonesia, Asia",
        coordinates: { lat: -8.6705, lon: 115.2126 },
        category: "beaches",
        basePrice: 650,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1537225228614-b4fad34a0b60?w=800",
        description: "Pristine tropical beaches with ancient temples, vibrant culture, and perfect weather year-round."
    },
    {
        id: 10,
        name: "Rocky Mountains",
        location: "Canada, North America",
        coordinates: { lat: 53.1109, lon: -117.2171 },
        category: "mountains",
        basePrice: 1300,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        description: "Majestic mountain range spanning North America with pristine wilderness and outdoor adventures."
    }
];

let filteredAttractions = [...attractions];
let currentSort = 'featured';
let currentSearch = '';
let currentCategory = 'All';
let userLocation = 'San Francisco, USA'; // Default location
let userCoordinates = cityCoordinates['San Francisco, USA'];

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Calculate dynamic price based on distance
function calculateDynamicPrice(attraction) {
    if (!userCoordinates) return attraction.basePrice;
    
    const distance = calculateDistance(
        userCoordinates.lat,
        userCoordinates.lon,
        attraction.coordinates.lat,
        attraction.coordinates.lon
    );
    
    // Pricing model: $1 per 100 miles + base price
    const distanceFactor = Math.ceil(distance / 100) * 1;
    return Math.round(attraction.basePrice + distanceFactor);
}

// Update attraction prices
function updateAttractionPrices() {
    attractions.forEach(attraction => {
        attraction.price = calculateDynamicPrice(attraction);
        
        // Also calculate and store distance
        if (userCoordinates) {
            attraction.distance = calculateDistance(
                userCoordinates.lat,
                userCoordinates.lon,
                attraction.coordinates.lat,
                attraction.coordinates.lon
            );
        }
    });
    filteredAttractions = filteredAttractions.map(att => {
        const updated = attractions.find(a => a.id === att.id);
        return updated || att;
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set static attractions as fallback
    AttractionsAPI.setStaticAttractions(attractions);
    
    updateAttractionPrices(); // Calculate initial prices
    setupLocationSelector();
    setupSearchFunctionality();
    setupCategoryFilters();
    setupSortingOptions();
    renderAttractions();
    
    // Try to fetch fresh attractions from APIs if available
    tryFetchFreshAttractions();
});

/**
 * Attempt to fetch attractions from configured APIs
 */
async function tryFetchFreshAttractions() {
    if (!APIConfig.isAnyApiConfigured()) {
        console.log('No APIs configured, using static attractions');
        return;
    }

    try {
        // Try to get user's current location first
        if (GeolocationManager.isSupported()) {
            const location = await GeolocationManager.getCurrentLocation({
                timeout: 5000,
                enableHighAccuracy: false
            }).catch(err => {
                console.warn('Geolocation failed:', err);
                // Use default San Francisco location
                return {
                    latitude: 37.7749,
                    longitude: -122.4194
                };
            });

            // Fetch attractions from API
            const freshAttractions = await AttractionsAPI.getAttractions(
                location.latitude,
                location.longitude,
                { maxResults: 15, useCache: false }
            );

            if (freshAttractions && freshAttractions.length > 0) {
                console.log(`Fetched ${freshAttractions.length} attractions from API`);
                // Merge with static attractions
                const mergedAttractions = [...freshAttractions, ...attractions.slice(0, 5)];
                attractions.length = 0;
                attractions.push(...mergedAttractions);
                
                updateAttractionPrices();
                renderAttractions();
            }
        }
    } catch (error) {
        console.warn('Error fetching fresh attractions:', error);
        // Continue with static attractions
    }
}

// Location Selector Setup
function setupLocationSelector() {
    const locationBtn = document.querySelector('[data-location-btn]');
    const locationInput = document.querySelector('[data-location-input]');
    
    // Show available cities on input focus
    if (locationInput) {
        locationInput.value = userLocation;
        
        locationInput.addEventListener('focus', function() {
            showLocationSuggestions(this);
        });
        
        locationInput.addEventListener('input', debounce(function() {
            showLocationSuggestions(this);
        }, 200));
        
        locationInput.addEventListener('blur', function() {
            setTimeout(() => {
                const suggestions = document.querySelector('[data-location-suggestions]');
                if (suggestions) suggestions.remove();
            }, 200);
        });
    }
    
    if (locationBtn) {
        locationBtn.addEventListener('click', function() {
            if (locationInput) {
                selectLocation(locationInput.value);
            }
        });
    }
}

// Show location suggestions dropdown
function showLocationSuggestions(input) {
    const searchTerm = input.value.toLowerCase();
    const cities = Object.keys(cityCoordinates);
    
    let suggestions = document.querySelector('[data-location-suggestions]');
    if (suggestions) suggestions.remove();
    
    const filtered = cities.filter(city => 
        city.toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) return;
    
    const dropdown = document.createElement('div');
    dropdown.setAttribute('data-location-suggestions', '');
    dropdown.className = 'absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-50 max-h-[200px] overflow-y-auto';
    
    dropdown.innerHTML = filtered.map(city => `
        <button class="w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors flex items-center gap-2" onclick="selectLocation('${city}')">
            <span class="material-symbols-outlined text-sm">location_on</span>
            ${city}
        </button>
    `).join('');
    
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(dropdown);
}

// Select a location and update prices
function selectLocation(location) {
    if (!cityCoordinates[location]) return;
    
    userLocation = location;
    userCoordinates = cityCoordinates[location];
    
    const locationInput = document.querySelector('[data-location-input]');
    if (locationInput) {
        locationInput.value = userLocation;
    }
    
    // Remove suggestions dropdown
    const suggestions = document.querySelector('[data-location-suggestions]');
    if (suggestions) suggestions.remove();
    
    // Update prices and re-render
    updateAttractionPrices();
    applyCurrentSort();
    renderAttractions();
    
    // Show confirmation
    showLocationNotification(location);
}

// Search Functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('[data-search-input]');
    const searchBtn = document.querySelector('[data-search-btn]');
    
    if (!searchInput) return;

    // Search on Enter key
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Search on button click
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Real-time search as user types
    searchInput.addEventListener('input', debounce(performSearch, 300));
}

function performSearch() {
    const searchTerm = document.querySelector('[data-search-input]').value.toLowerCase();
    currentSearch = searchTerm; // Track current search
    
    filteredAttractions = attractions.filter(attraction => 
        attraction.name.toLowerCase().includes(searchTerm) ||
        attraction.location.toLowerCase().includes(searchTerm) ||
        attraction.description.toLowerCase().includes(searchTerm)
    );

    applyCurrentSort();
    renderAttractions();
}

// Category Filters
function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('[data-filter-btn]');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-filter-btn');
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update current category tracking
            currentCategory = category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1);
            
            // Filter attractions
            if (category === 'all') {
                filteredAttractions = [...attractions];
            } else {
                filteredAttractions = attractions.filter(a => a.category === category);
            }
            
            applyCurrentSort();
            renderAttractions();
        });
    });
}

// Sorting Functionality
function setupSortingOptions() {
    const sortSelect = document.querySelector('[data-sort-select]');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        applyCurrentSort();
        renderAttractions();
    });
}

function applyCurrentSort() {
    switch(currentSort) {
        case 'price-low':
            filteredAttractions.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredAttractions.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredAttractions.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredAttractions.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'featured':
        default:
            filteredAttractions.sort((a, b) => a.id - b.id);
    }
}

// Render Attractions
function renderAttractions() {
    const grid = document.querySelector('[data-attractions-grid]');
    if (!grid) return;

    if (filteredAttractions.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-20 text-center">
                <span class="material-symbols-outlined text-6xl text-outline mb-4 block opacity-50">travel_explore</span>
                <h3 class="text-xl font-bold text-on-surface mb-2">No attractions found</h3>
                <p class="text-on-surface-variant">Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredAttractions.map((attraction, index) => {
        const isLarge = index === 0 || index === 3; // Large cards at positions 0 and 3
        const colSpan = isLarge ? 'md:col-span-8' : 'md:col-span-4';
        const aspectRatio = isLarge ? 'aspect-[16/9]' : 'aspect-[4/5]';

        return `
            <div class="${colSpan} group relative overflow-hidden rounded-lg bg-surface-container-low ${aspectRatio} cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-lg" onclick="window.location.href='attraction-detail.html?id=${attraction.id}'" style="animation: slideInUp 0.6s ease-out ${index * 0.1}s both;">
                <img alt="${attraction.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="${attraction.image}"/>
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute top-6 right-6 flex items-center gap-2">
                    <span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-bold text-xs editorial-shadow">$${Math.round(attraction.price)}</span>
                    <div class="bg-surface-container-lowest text-yellow-500 px-2 py-1 rounded-full text-xs font-bold editorial-shadow flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                        ${attraction.rating}
                    </div>
                </div>
                <div class="absolute bottom-8 left-8 text-white max-w-md">
                    <p class="font-label text-xs tracking-[0.2em] mb-1 opacity-80 uppercase">${attraction.location}</p>
                    ${attraction.distance ? `<p class="font-label text-xs tracking-[0.1em] mb-2 opacity-60">• ${Math.round(attraction.distance)} miles from ${userLocation.split(',')[0]}</p>` : ''}
                    <h3 class="font-headline text-2xl md:text-3xl font-bold mb-2">${attraction.name}</h3>
                    <p class="font-body text-xs md:text-sm text-white/80 line-clamp-2">${attraction.description}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Utility: Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Show notification when location changes
function showLocationNotification(location) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-primary text-on-primary px-6 py-3 rounded-lg shadow-lg animate-slide-in z-50';
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined">location_on</span>
            <span>Now searching from <strong>${location}</strong></span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export for use
window.ExploreApp = {
    attractions,
    filteredAttractions,
    performSearch,
    renderAttractions
};
