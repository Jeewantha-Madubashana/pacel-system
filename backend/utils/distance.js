// Calculate distance between two coordinates using Haversine formula
// Returns distance in kilometers
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

// Find nearby bookings within a certain radius (in km)
export const findNearbyBookings = (targetLat, targetLng, bookings, radiusKm = 10) => {
  return bookings.filter((booking) => {
    const pickupDistance = calculateDistance(
      parseFloat(targetLat),
      parseFloat(targetLng),
      parseFloat(booking.pickup_lat),
      parseFloat(booking.pickup_lng)
    );
    
    const dropDistance = calculateDistance(
      parseFloat(targetLat),
      parseFloat(targetLng),
      parseFloat(booking.drop_lat),
      parseFloat(booking.drop_lng)
    );
    
    // Consider booking nearby if either pickup or drop is within radius
    return pickupDistance <= radiusKm || dropDistance <= radiusKm;
  });
};

