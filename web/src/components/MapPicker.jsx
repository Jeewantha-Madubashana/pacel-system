import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { TextField, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import api from '../utils/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LocationMarker = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ onLocationSelect, selectedLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mapPosition, setMapPosition] = useState([51.505, -0.09]); // Default to London
  const [markerPosition, setMarkerPosition] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedLocation) {
      setMapPosition([selectedLocation.lat, selectedLocation.lng]);
      setMarkerPosition([selectedLocation.lat, selectedLocation.lng]);
      setSearchQuery(selectedLocation.address || '');
    }
  }, [selectedLocation]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await api.get('/location/search', {
        params: { q: searchQuery },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (result) => {
    setMapPosition([result.lat, result.lng]);
    setMarkerPosition([result.lat, result.lng]);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    onLocationSelect({
      lat: result.lat,
      lng: result.lng,
      address: result.display_name,
    });
  };

  const handleMapClick = async (latlng) => {
    setMarkerPosition([latlng.lat, latlng.lng]);
    try {
      const response = await api.get('/location/reverse', {
        params: { lat: latlng.lat, lng: latlng.lng },
      });
      const address = response.data.display_name;
      setSearchQuery(address);
      onLocationSelect({
        lat: latlng.lat,
        lng: latlng.lng,
        address: address,
      });
    } catch (error) {
      console.error('Reverse geocode failed:', error);
      onLocationSelect({
        lat: latlng.lat,
        lng: latlng.lng,
        address: '',
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label="Search location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          Search
        </Button>
      </Box>

      {searchResults.length > 0 && (
        <List sx={{ maxHeight: 200, overflow: 'auto', mb: 2, border: 1, borderColor: 'divider' }}>
          {searchResults.map((result, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleLocationSelect(result)}
            >
              <ListItemText primary={result.display_name} />
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ height: 400, width: '100%' }}>
        <MapContainer
          center={mapPosition}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker
            position={markerPosition}
            onPositionChange={handleMapClick}
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapPicker;

