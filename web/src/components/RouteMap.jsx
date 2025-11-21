import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const currentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const nearbyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const RouteMap = ({ currentBooking, nearbyBookings = [] }) => {
  if (!currentBooking) return null;

  const centerLat = parseFloat(currentBooking.pickup_lat);
  const centerLng = parseFloat(currentBooking.pickup_lng);

  return (
    <div style={{ height: '400px', width: '100%', marginBottom: '20px' }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Current booking pickup */}
        <Marker
          position={[parseFloat(currentBooking.pickup_lat), parseFloat(currentBooking.pickup_lng)]}
          icon={currentIcon}
        >
          <Popup>
            <strong>Current Job - Pickup</strong>
            <br />
            Booking #{currentBooking.id}
            <br />
            {currentBooking.pickup_address}
          </Popup>
        </Marker>

        {/* Current booking drop */}
        <Marker
          position={[parseFloat(currentBooking.drop_lat), parseFloat(currentBooking.drop_lng)]}
          icon={currentIcon}
        >
          <Popup>
            <strong>Current Job - Drop</strong>
            <br />
            Booking #{currentBooking.id}
            <br />
            {currentBooking.drop_address}
          </Popup>
        </Marker>

        {/* Nearby bookings */}
        {nearbyBookings.map((booking) => (
          <React.Fragment key={booking.id}>
            <Marker
              position={[parseFloat(booking.pickup_lat), parseFloat(booking.pickup_lng)]}
              icon={nearbyIcon}
            >
              <Popup>
                <strong>Nearby Parcel - Pickup</strong>
                <br />
                Booking #{booking.id}
                <br />
                Customer: {booking.customer?.name}
                <br />
                {booking.pickup_address}
              </Popup>
            </Marker>
            <Marker
              position={[parseFloat(booking.drop_lat), parseFloat(booking.drop_lng)]}
              icon={nearbyIcon}
            >
              <Popup>
                <strong>Nearby Parcel - Drop</strong>
                <br />
                Booking #{booking.id}
                <br />
                Customer: {booking.customer?.name}
                <br />
                {booking.drop_address}
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default RouteMap;

