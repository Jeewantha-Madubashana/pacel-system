import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Chip } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import api from '../../utils/api';
import { useRoute, useNavigation } from '@react-navigation/native';

const CreateBookingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { service } = route.params;

  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationMode, setLocationMode] = useState('pickup'); // 'pickup' or 'drop'
  const [mapRegion, setMapRegion] = useState({
    latitude: 51.505,
    longitude: -0.09,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setMapRegion(region);
      setPickupLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const location = { latitude, longitude };

    try {
      const response = await api.get('/location/reverse', {
        params: { lat: latitude, lng: longitude },
      });
      const address = response.data.display_name;

      if (locationMode === 'pickup') {
        setPickupLocation(location);
        setPickupAddress(address);
      } else {
        setDropLocation(location);
        setDropAddress(address);
      }
    } catch (error) {
      console.error('Reverse geocode failed:', error);
      // Still set location even if reverse geocode fails
      if (locationMode === 'pickup') {
        setPickupLocation(location);
        setPickupAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      } else {
        setDropLocation(location);
        setDropAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      try {
        const response = await api.get('/location/reverse', {
          params: { lat: coords.latitude, lng: coords.longitude },
        });
        const address = response.data.display_name;

        if (locationMode === 'pickup') {
          setPickupLocation(coords);
          setPickupAddress(address);
        } else {
          setDropLocation(coords);
          setDropAddress(address);
        }
      } catch (error) {
        console.error('Reverse geocode failed:', error);
        if (locationMode === 'pickup') {
          setPickupLocation(coords);
          setPickupAddress(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
        } else {
          setDropLocation(coords);
          setDropAddress(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
      console.error('Error getting location:', error);
    }
  };

  const handleCreateBooking = async () => {
    if (!pickupLocation || !dropLocation) {
      Alert.alert('Error', 'Please select both pickup and drop locations');
      return;
    }

    setLoading(true);
    try {
      await api.post('/bookings', {
        service_id: service.id,
        pickup_lat: pickupLocation.latitude,
        pickup_lng: pickupLocation.longitude,
        pickup_address: pickupAddress,
        drop_lat: dropLocation.latitude,
        drop_lng: dropLocation.longitude,
        drop_address: dropAddress,
      });
      Alert.alert('Success', 'Booking created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{service.name}</Text>
          <Text variant="bodyMedium">${service.price}</Text>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Select Location
      </Text>
      
      {/* Mode Toggle */}
      <View style={styles.toggleContainer}>
        <Chip
          selected={locationMode === 'pickup'}
          onPress={() => setLocationMode('pickup')}
          style={styles.toggleChip}
          icon="map-marker"
        >
          Pickup
        </Chip>
        <Chip
          selected={locationMode === 'drop'}
          onPress={() => setLocationMode('drop')}
          style={styles.toggleChip}
          icon="map-marker-check"
        >
          Drop
        </Chip>
      </View>

      {/* Pickup Section */}
      {locationMode === 'pickup' && (
        <>
          <TextInput
            label="Pickup Address"
            value={pickupAddress}
            onChangeText={setPickupAddress}
            style={styles.input}
            placeholder="Tap map or use current location"
            editable={true}
          />
          <Button
            mode="outlined"
            icon="crosshairs-gps"
            onPress={handleUseCurrentLocation}
            style={styles.currentLocationButton}
          >
            Use Current Location
          </Button>
          {pickupLocation && (
            <Button
              mode="text"
              icon="close"
              onPress={() => {
                setPickupLocation(null);
                setPickupAddress('');
              }}
              style={styles.clearButton}
            >
              Clear Pickup
            </Button>
          )}
        </>
      )}

      {/* Drop Section */}
      {locationMode === 'drop' && (
        <>
          <TextInput
            label="Drop Address"
            value={dropAddress}
            onChangeText={setDropAddress}
            style={styles.input}
            placeholder="Tap map or use current location"
            editable={true}
          />
          <Button
            mode="outlined"
            icon="crosshairs-gps"
            onPress={handleUseCurrentLocation}
            style={styles.currentLocationButton}
          >
            Use Current Location
          </Button>
          {dropLocation && (
            <Button
              mode="text"
              icon="close"
              onPress={() => {
                setDropLocation(null);
                setDropAddress('');
              }}
              style={styles.clearButton}
            >
              Clear Drop
            </Button>
          )}
        </>
      )}

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          onPress={handleMapPress}
        >
          {pickupLocation && (
            <Marker
              coordinate={pickupLocation}
              title="Pickup"
              pinColor="green"
            />
          )}
          {dropLocation && (
            <Marker
              coordinate={dropLocation}
              title="Drop"
              pinColor="red"
            />
          )}
        </MapView>
      </View>
      <Text style={styles.hint}>
        {locationMode === 'pickup'
          ? 'Tap on map to set pickup location'
          : 'Tap on map to set drop location'}
      </Text>

      <Button
        mode="contained"
        onPress={handleCreateBooking}
        loading={loading}
        disabled={loading || !pickupLocation || !dropLocation}
        style={styles.button}
      >
        Create Booking
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  toggleChip: {
    flex: 1,
  },
  currentLocationButton: {
    marginBottom: 10,
  },
  clearButton: {
    marginBottom: 10,
  },
  mapContainer: {
    height: 300,
    marginBottom: 10,
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
  hint: {
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default CreateBookingScreen;

