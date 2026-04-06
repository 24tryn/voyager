# 🗺️ Voyager - Advanced Travel Planning Web App

A comprehensive travel planning application that lets users explore attractions worldwide, plan dynamic routes, calculate costs, estimate savings, and export trip plans. Features real-time API integration for attractions, directions, and geolocation.

## ✨ Key Features

### 🌍 Dynamic Attractions Explorer
- **API-Powered**: Fetch attractions dynamically from Google Places and Mapbox APIs
- **Fallback System**: Static seed attractions available without API configuration
- **Real-time Search**: Search across thousands of attractions
- **Smart Filtering**: Filter by category (Beaches, Cities, Mountains)
- **Dynamic Pricing**: Prices calculated based on distance from user's location
- **Bento Grid Layout**: Beautiful, animated card display

### 🛣️ Advanced Route Planning
- **Multi-Transport Options**: Driving, Walking, Cycling, Public Transit
- **Distance Calculation**: Accurate distance using Haversine formula
- **Travel Time Estimation**: Real-time ETA for each route
- **Cost Estimation**: Automatic cost calculation per transport mode
- **Turn-by-Turn Directions**: Detailed step-by-step navigation
- **Browser Geolocation**: Automatic location detection (with fallback)

### 📤 Trip Export & Sharing
- **PDF Export**: Professional trip itineraries (with html2pdf library)
- **JSON Export**: Portable trip data format
- **iCalendar Export**: Import to Google Calendar, Outlook, etc.
- **Shareable Links**: Generate links to share trips with others
- **Social Sharing**: Share to Twitter, Facebook, LinkedIn, WhatsApp, Email

### 💰 Financial Planning
- **Trip Cost Breakdown**: Flights, accommodation, food, activities
- **Monthly Savings Calculator**: Determine how much to save annually
- **Visual Progress Tracking**: Charts and progress bars
- **Savings Strategies**: Smart tips for budget optimization

### 👤 User Management
- **Profile Management**: Account info and preferences
- **Trip History**: View past and upcoming trips
- **Payment Methods**: Manage payment information
- **Preferences**: Customize app settings

## 📁 Project Structure

```
voyager/
├── index.html                # 🏠 Explore page - Browse attractions
├── routes.html               # 🛣️ Route planner with directions
├── attraction-detail.html    # 📍 Detailed attraction info
├── trip-planner.html         # ✈️ Trip planning & cost breakdown
├── finance-planner.html      # 💰 Savings & financial planning
├── profile.html              # 👤 User account & preferences
├── api-setup.html            # ⚙️ API configuration & setup
├── css/
│   └── shared.css           # Shared styles & animations
├── js/
│   ├── api-config.js        # 🔑 API key management
│   ├── geolocation.js       # 📍 Location detection & geocoding
│   ├── attractions-api.js   # 🌍 Attractions fetching service
│   ├── directions.js         # 🛣️ Routes & directions service
│   ├── trip-exporter.js     # 📤 Export/share functionality
│   ├── explore.js           # 🔍 Explore page logic
│   ├── routes.js            # 🗺️ Routes page logic
│   └── navigation.js        # 🧭 Navigation & routing
└── README.md                # This file
```

## 🚀 Getting Started

### Quick Start (No API Setup)
```bash
# Start a local server
python -m http.server 8000
# or
npx http-server

# Open browser
http://localhost:8000/voyager/
```
You can explore with static attractions immediately!

### With API Integration (Recommended)

#### 1. Set Up Google APIs
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project
- Enable these APIs:
  - ✅ Places API
  - ✅ Maps JavaScript API
  - ✅ Directions API
- Create an API key
- Visit `api-setup.html` and paste your key

#### 2. Set Up Mapbox (Optional but Recommended)
- Go to [Mapbox Account](https://account.mapbox.com/tokens/)
- Create a new public token
- Visit `api-setup.html` and paste your token

#### 3. Start Using Dynamic Features
- 🌍 Explore attractions from any location
- 🛣️ Get real directions and travel times
- 📤 Export trips in multiple formats

## 🎨 Design System

- **Primary**: #0059bb (Blue)
- **Secondary**: #9b4500 (Orange)
- **Tertiary**: #7c5400 (Brown)
- **Typography**: Plus Jakarta Sans (Headlines), Be Vietnam Pro (Body)
- **Icons**: Material Symbols Outlined
- **Framework**: Tailwind CSS 3
- **Responsive**: Mobile-first, works on all devices

## 📖 Page Descriptions

### 🏠 Explore (`index.html`)
- Dynamic attraction discovery with real-time search
- Category filtering (Beaches, Cities, Mountains, All)
- Location-based dynamic pricing
- Distance display from your location
- Sort options (Featured, Price, Rating, Name)
- Beautiful bento grid with animations
- **Action**: Click any attraction or use the route FAB

### 🛣️ Routes (`routes.html`)
- Plan routes between locations
- **Start Location**: Auto-detect using browser GPS or manual entry
- **Destination**: Search any location globally
- **Route Options** for each transport mode:
  - Distance & duration estimates
  - Step-by-step turn-by-turn directions
  - Cost estimation
  - Transport mode comparison
- **Export to**: PDF, JSON, iCalendar, Shareable Links
- Social media sharing options

### 📍 Attraction Details (`attraction-detail.html`)
- High-resolution hero image
- Comprehensive description
- Rating and review count
- Location with map
- Key information and facts
- Operating hours
- "Plan My Trip" call-to-action

### ✈️ Trip Planner (`trip-planner.html`)
- Comprehensive trip planning interface
- Cost breakdown:
  - Flight costs
  - Hotel accommodation
  - Food & dining
  - Activities & attractions
- Total trip estimation
- Duration & distance calculation
- Integration with finance tools

### 💰 Finance Planner (`finance-planner.html`)
- Trip cost overview and summary
- Monthly savings calculation
- Annual savings goal setting
- Visual progress tracking (charts)
- Savings strategies and tips
- Funding timeline calculator
- Budget optimization suggestions

### 👤 Profile (`profile.html`)
- User account information
- Trip statistics and history
- Upcoming trips with budgets
- Past adventures gallery
- Payment methods management
- Settings & preferences
- Account security options

### ⚙️ API Setup (`api-setup.html`)
- Guided setup for Google APIs
- Guided setup for Mapbox APIs
- Configuration status display
- API connectivity testing
- Documentation links
- Demo mode option

## � Deployment to GitHub Pages

### Quick Deploy (Recommended)

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Voyager travel app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/voyager.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Select **Source**: Deploy from a branch
   - Select **Branch**: main, /(root)
   - Click **Save**
   - Your app will be live at: `https://YOUR_USERNAME.github.io/voyager/`

3. **That's it!** 🎉
   - App automatically updates when you push changes
   - Uses live Mapbox API with hardcoded token
   - No server setup needed
   - Works on all devices

### Production Features Enabled

✅ **Mapbox API Active** - Token pre-configured for live data  
✅ **API Banner Removed** - No setup prompts  
✅ **Static Content** - Serves directly from GitHub  
✅ **Responsive Design** - Works on mobile/tablet/desktop  
✅ **PWA Ready** - Can be installed on devices  

## �🔧 API Configuration Guide

### Environment Variables (Optional)
Store in browser localStorage (no server needed):
```javascript
// Automatically handled by api-setup.html
// Or programmatically:
APIConfig.setGoogleApiKey('your_key');
APIConfig.setMapboxToken('your_token');
```

### Programmatic Usage
```javascript
// Get user location
const location = await GeolocationManager.getCurrentLocation();

// Fetch attractions
const attractions = await AttractionsAPI.getAttractions(
    location.latitude,
    location.longitude,
    { maxResults: 20 }
);

// Get routes with all options
const routes = await DirectionsManager.getRoutes(
    {lat: 37.7749, lon: -122.4194},
    {lat: 34.0522, lon: -118.2437},
    {modes: ['driving', 'walking', 'bicycling', 'transit']}
);

// Export trip
TripExporter.exportAsJSON(trip);
await TripExporter.exportAsPDF(trip);
TripExporter.exportAsICalendar(trip);
```

## 📱 Features Breakdown

### Search & Filter
- Real-time search across attraction name, location, description
- Category filters (All, Beaches, Cities, Mountains)
- Distance-based sorting
- Price-based sorting
- Rating-based sorting
- Dynamic price updates based on user location

### Location Services
- 🎯 Browser geolocation with high accuracy option
- 🔍 Address/city geocoding and search
- 📍 Reverse geocoding (coordinates → address)
- 💾 Automatic location caching
- ⚡ Fallback to previous location if new location fails

### Route Calculation
- **Multiple transport modes**:
  - 🚗 Driving (automobile)
  - 🚶 Walking (pedestrian)
  - 🚴 Cycling (bicycle)
  - 🚌 Public Transit (buses, trains)
- **Detailed route information**:
  - Distance in miles and kilometers
  - Duration in hours and minutes
  - Cost estimation based on mode
  - Turn-by-turn navigation steps
  - Route visualization
- **API Redundancy**: Falls back to secondary API if primary fails

### Trip Export
```javascript
// Export as JSON (portable format)
TripExporter.exportAsJSON(trip);

// Export as PDF (professional format, requires html2pdf)
await TripExporter.exportAsPDF(trip);

// Export as iCalendar (.ics file)
TripExporter.exportAsICalendar(trip);

// Generate shareable link
const link = TripExporter.generateShareLink(trip);

// Share to social media
TripExporter.shareToSocial(trip, 'twitter');  // or facebook, linkedin, whatsapp, email
```

## 🔐 Data Privacy

- **Local Storage Only**: API keys stored securely in browser localStorage
- **Client-Side Processing**: All route and attraction calculations happen in browser
- **No Server Backend**: Pure frontend application
- **Smart Caching**: Routes and attractions cached for performance without tracking
- **Third-Party**: Only necessary API calls sent to Google/Mapbox

## 📊 Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers (Chrome Mobile, Safari Mobile)
- ⚠️ HTTPS required for geolocation API (HTTP on localhost works)
- ⚠️ API calls may require CORS headers

## 🚨 Common Issues & Solutions

### "API not configured" message
**Solution**: Visit `api-setup.html` and add your API keys

### Routes not calculating
**Solutions**:
- Check if Google Maps Directions API is enabled in Google Cloud
- Verify API key has necessary permissions
- Try Mapbox as fallback
- Check browser console for error messages

### Geolocation not working
**Solutions**:
- Check browser permissions for location access
- Must be on HTTPS (localhost works without HTTPS)
- Try manual location entry as fallback
- Check system location settings

### Attractions list is empty
**Solutions**:
- Without APIs: Use static attractions (no setup needed)
- With APIs: Configure at least one API key
- Check geolocation is enabled
- Verify API credentials are correct

### Export not working
**Solutions**:
- PDF: html2pdf library loads automatically from CDN
- iCalendar: Works without external libraries
- JSON: Standard browser functionality
- Sharing: Requires modern browser with Clipboard API

## 🎯 Roadmap

### v2.0 (Planned)
- [ ] User authentication with Firebase
- [ ] Save trips to cloud database
- [ ] Multi-day trip planning with itineraries
- [ ] Real-time collaboration on trips
- [ ] Push notifications & travel alerts
- [ ] Budget tracking during active trips
- [ ] Offline mode with sync capability
- [ ] Mobile app (React Native)

### v1.5 (Planned)
- [ ] Hotel booking integration
- [ ] Flight search and booking
- [ ] Restaurant recommendations with reviews
- [ ] Travel insurance quotes
- [ ] Currency converter with rates
- [ ] Weather forecast integration
- [ ] Visa requirements checker

## 🛠️ Development

### Local Development Setup
```bash
# Start server
python -m http.server 8000

# Open browser
http://localhost:8000/voyager/

# Files auto-update (use live reload extension)
```

### Adding New Attractions
Edit `js/explore.js` attractions array:
```javascript
const attractions = [
    {
        id: 11,
        name: "New Attraction",
        location: "City, Country",
        coordinates: { lat: 0, lon: 0 },
        category: "cities",
        basePrice: 1000,
        rating: 4.5,
        image: "https://image_url",
        description: "Description here"
    }
];
```

### Customizing Colors
Edit the Tailwind config in HTML file's `<script>` tag:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                "primary": "#0059bb",
                "secondary": "#9b4500"
            }
        }
    }
}
```

## 📞 Support & Documentation

### External Resources
- [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Google Directions API](https://developers.google.com/maps/documentation/directions)
- [Mapbox API Docs](https://docs.mapbox.com/api/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Material Symbols](https://fonts.google.com/icons)

### Testing APIs in Browser Console
```javascript
// Check API status
console.log(APIConfig.getPrimaryApi());

// Get current location
const loc = await GeolocationManager.getCurrentLocation();

// Search for attractions
const attrs = await AttractionsAPI.getAttractions(37.7749, -122.4194);

// Calculate route
const routes = await DirectionsManager.getRoutes(origin, destination);
```

## 📝 License

This project is open-source and available for personal, educational, and commercial use.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- [ ] More attractions in database
- [ ] Better mobile styling
- [ ] Performance optimizations
- [ ] Test coverage
- [ ] Documentation improvements
- [ ] Accessibility enhancements (a11y)
- [ ] Internationalization (i18n)

## 🎉 Built With

- ❤️ **Vanilla JavaScript** (no frameworks, pure browser APIs)
- 🎨 **Tailwind CSS 3** (utility-first styling)
- 🗺️ **Google Maps & Mapbox APIs** (locations & directions)
- 🎪 **Material Design 3** (design system)
- 📍 **Haversine Formula** (geographic distance calculations)

---

**Version**: 1.1.0  
**Last Updated**: March 2026  
**Status**: ✅ Production Ready  
**Contributors**: Voyager Team

Enjoy your travels with Voyager! ✈️🌍
