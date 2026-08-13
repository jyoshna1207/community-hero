import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FiSearch, FiNavigation, FiMapPin, FiLoader, FiAlertCircle, FiCheck 
} from 'react-icons/fi';
import './AddLocationPicker.css';

// Custom SVG Pin Icon for Leaflet to guarantee rendering without missing image URLs
const customPinIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div class="custom-marker-wrapper">
      <div class="custom-marker-head">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div class="custom-marker-shadow"></div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 44],
});

const DEFAULT_COORDS = { lat: 17.6868, lng: 83.2185 }; // Duvvada / Visakhapatnam default
const DEFAULT_ADDRESS = 'Duvvada, Visakhapatnam, Andhra Pradesh';

// Component to handle map clicks
function MapClickEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to dynamically re-center map view and invalidate size
function MapViewController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.lat != null && center.lng != null) {
      map.flyTo([center.lat, center.lng], map.getZoom() > 13 ? map.getZoom() : 14, { animate: true, duration: 1 });
    }
  }, [center, map]);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export default function AddLocationPicker({ 
  onLocationSelect, 
  initialAddress = DEFAULT_ADDRESS,
  initialCoords = DEFAULT_COORDS 
}) {
  const [coords, setCoords] = useState(() => {
    if (initialCoords && (initialCoords.latitude != null || initialCoords.lat != null)) {
      return {
        lat: initialCoords.latitude ?? initialCoords.lat,
        lng: initialCoords.longitude ?? initialCoords.lng,
      };
    }
    return DEFAULT_COORDS;
  });

  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const debounceTimerRef = useRef(null);

  // Initial callback notify
  useEffect(() => {
    if (onLocationSelect) {
      onLocationSelect({
        latitude: coords.lat,
        longitude: coords.lng,
        lat: coords.lat,
        lng: coords.lng,
        address: address
      });
    }
  }, []);

  // Core update location logic
  const handleUpdateLocation = async (lat, lng, fetchAddress = true, customAddr = null) => {
    setErrorMsg('');
    const newCoords = { lat, lng };
    setCoords(newCoords);

    if (customAddr) {
      setAddress(customAddr);
      if (onLocationSelect) {
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          lat,
          lng,
          address: customAddr
        });
      }
      return;
    }

    if (fetchAddress) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        const resolvedAddr = (data && data.display_name) ? data.display_name : `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        setAddress(resolvedAddr);
        if (onLocationSelect) {
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            lat,
            lng,
            address: resolvedAddr
          });
        }
      } catch (err) {
        console.error("Reverse geocode error:", err);
        const fallback = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        setAddress(fallback);
        if (onLocationSelect) {
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            lat,
            lng,
            address: fallback
          });
        }
      }
    } else {
      if (onLocationSelect) {
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          lat,
          lng,
          address
        });
      }
    }
  };

  // Search handler via OpenStreetMap Nominatim
  const executeSearch = async (query) => {
    if (!query || !query.trim()) return;
    setIsSearching(true);
    setErrorMsg('');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        setSearchResults(data);
        const top = data[0];
        const lat = parseFloat(top.lat);
        const lng = parseFloat(top.lon);
        handleUpdateLocation(lat, lng, false, top.display_name);
      } else {
        setSearchResults([]);
        setErrorMsg(`Location "${query}" not found. Try searching another landmark or street.`);
      }
    } catch (err) {
      console.error("Location search error:", err);
      setErrorMsg("Network error while searching location.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setErrorMsg('');

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (!val.trim() || val.trim().length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimerRef.current = setTimeout(() => {
      executeSearch(val);
    }, 450);
  };

  const handleSelectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const addr = result.display_name;
    setSearchResults([]);
    setSearchQuery('');
    handleUpdateLocation(lat, lng, false, addr);
  };

  // Browser Geolocation API ("Use My Location")
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleUpdateLocation(latitude, longitude, true);
        setIsLocating(false);
      },
      (err) => {
        console.error("GPS location error:", err);
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg("Location access denied. Please allow location permissions in your browser settings or click on the map to choose a location manually.");
        } else {
          setErrorMsg("Unable to retrieve location coordinates. Please click on the map to set location manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="add-location-card-container">
      {/* Header */}
      <div className="add-location-header">
        <h2>Specify Problem Location</h2>
        <p className="add-location-subtitle">
          Search, pan/zoom, click on the map to set a pin, or use your current location.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="location-search-box-wrapper">
        <form onSubmit={handleSearchSubmit} className="location-search-input-group">
          <FiSearch className="search-icon" onClick={handleSearchSubmit} style={{ cursor: 'pointer' }} />
          <input 
            type="text" 
            placeholder="Search address or landmark (e.g. Duvvada, Gajuwaka, Main Road)..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {isSearching && <FiLoader className="spin-icon text-blue" />}
        </form>

        {/* Search Results Menu */}
        {searchResults.length > 0 && (
          <div className="search-dropdown-menu">
            {searchResults.map((item, idx) => (
              <div 
                key={idx} 
                className="search-dropdown-item"
                onClick={() => handleSelectSearchResult(item)}
              >
                <FiMapPin className="item-icon" />
                <span>{item.display_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* "Use My Location" GPS Button */}
      <div className="location-actions-row">
        <button 
          type="button"
          className="btn-use-gps-location"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
        >
          <FiNavigation className={isLocating ? "spin-icon animate-spin" : ""} />
          <span>{isLocating ? "Detecting location..." : "Use My Location"}</span>
        </button>
      </div>

      {/* Error Notification */}
      {errorMsg && (
        <div className="location-error-alert">
          <FiAlertCircle className="error-icon" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* React-Leaflet Map Container */}
      <div className="leaflet-map-wrapper">
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={14}
          scrollWheelZoom={true}
          className="leaflet-map-canvas"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickEvents onMapClick={(lat, lng) => handleUpdateLocation(lat, lng, true)} />
          <MapViewController center={coords} />

          <Marker
            position={[coords.lat, coords.lng]}
            icon={customPinIcon}
            draggable={true}
            eventHandlers={{
              dragend(e) {
                const marker = e.target;
                const position = marker.getLatLng();
                handleUpdateLocation(position.lat, position.lng, true);
              },
            }}
          />
        </MapContainer>

        <div className="map-click-hint-badge">
          📍 Click map or drag pin to set exact location
        </div>
      </div>

      {/* Selected Coordinates Display Box (Requirement 5) */}
      <div className="coordinates-display-card">
        <div className="coord-box">
          <span className="coord-label">Latitude:</span>
          <span className="coord-value">{coords.lat ? coords.lat.toFixed(6) : 'N/A'}</span>
        </div>
        <div className="coord-box">
          <span className="coord-label">Longitude:</span>
          <span className="coord-value">{coords.lng ? coords.lng.toFixed(6) : 'N/A'}</span>
        </div>
      </div>

      {/* Address Bar */}
      <div className="bottom-address-bar-card">
        <FiMapPin className="pin-icon" />
        <input 
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (onLocationSelect) {
              onLocationSelect({
                latitude: coords.lat,
                longitude: coords.lng,
                lat: coords.lat,
                lng: coords.lng,
                address: e.target.value
              });
            }
          }}
          className="address-display-input"
          placeholder="Resolved location address..."
        />
      </div>
    </div>
  );
}
