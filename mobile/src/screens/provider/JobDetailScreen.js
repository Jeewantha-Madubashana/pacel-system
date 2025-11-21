import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Chip, Button, List, Divider } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import api from '../../utils/api';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

const JobDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { booking } = route.params;
  const [loading, setLoading] = useState(false);
  const [nearbyBookings, setNearbyBookings] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(booking);

  useEffect(() => {
    loadNearbyBookings();
    refreshBooking();
  }, [booking.id]);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshBooking();
      loadNearbyBookings();
    }, [booking.id])
  );

  const refreshBooking = async () => {
    try {
      const response = await api.get(`/bookings/${booking.id}`);
      setCurrentBooking(response.data);
    } catch (error) {
      console.error('Failed to refresh booking:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      accepted: '#2196f3',
      on_the_way: '#9c27b0',
      started: '#673ab7',
      delivered: '#ff5722',
      handover: '#00bcd4',
      completed: '#4caf50',
      rejected: '#f44336',
    };
    return colors[status] || '#757575';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      accepted: 'Accepted',
      on_the_way: 'On the Way to Pickup',
      started: 'Parcel Collected',
      delivered: 'Delivered to Location',
      handover: 'Handed Over',
      completed: 'Completed',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  const handleStatusUpdate = async (newStatus) => {
    // Validate current status before attempting update
    const validTransitions = {
      'accepted': ['on_the_way'],
      'on_the_way': ['started'],
      'started': ['delivered'],
      'delivered': ['handover'],
      'handover': ['completed'],
    };

    const currentStatus = currentBooking?.status || booking.status;
    
    if (validTransitions[currentStatus] && !validTransitions[currentStatus].includes(newStatus)) {
      Alert.alert(
        'Invalid Action',
        `Cannot update status from "${getStatusLabel(currentStatus)}" to "${getStatusLabel(newStatus)}". Please refresh and try again.`,
        [
          { text: 'Refresh', onPress: refreshBooking },
          { text: 'OK' },
        ]
      );
      return;
    }

    setLoading(true);
    try {
      const response =       await api.patch(`/bookings/${booking.id}/status`, { status: newStatus });
      // Update local booking state with fresh data
      setCurrentBooking(response.data);
      Alert.alert('Success', 'Status updated successfully', [
        { 
          text: 'OK', 
          onPress: () => {
            // Refresh parent screen data when going back
            navigation.goBack();
            // Trigger refresh in parent screen via navigation params
            navigation.getParent()?.setParams({ refresh: Date.now() });
          }
        },
      ]);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update status';
      Alert.alert('Error', errorMessage, [
        { text: 'Refresh', onPress: refreshBooking },
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyBookings = async () => {
    const currentStatus = currentBooking?.status || booking.status;
    if (currentStatus === 'pending' || currentStatus === 'completed') return;
    
    setLoadingNearby(true);
    try {
      const response = await api.get(`/bookings/${booking.id}`);
      if (response.data.nearbyBookings) {
        setNearbyBookings(response.data.nearbyBookings);
      }
      // Also update current booking if it changed
      if (response.data.status !== currentStatus) {
        setCurrentBooking(response.data);
      }
    } catch (error) {
      console.error('Failed to load nearby bookings:', error);
    } finally {
      setLoadingNearby(false);
    }
  };

  const openNavigation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const destinationLat = displayStatus === 'accepted' || displayStatus === 'on_the_way'
        ? displayBooking.pickup_lat
        : displayBooking.drop_lat;
      const destinationLng = displayStatus === 'accepted' || displayStatus === 'on_the_way'
        ? displayBooking.pickup_lng
        : displayBooking.drop_lng;

      const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;
      // In a real app, you would use Linking.openURL(url)
      Alert.alert('Navigation', 'Opening navigation app...');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Use currentBooking if available, otherwise fall back to booking from route
  const displayBooking = currentBooking || booking;
  const displayStatus = displayBooking.status;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Job #{displayBooking.id}</Text>
          <Chip
            style={[styles.chip, { backgroundColor: getStatusColor(displayStatus) }]}
            textStyle={{ color: '#fff' }}
          >
            {getStatusLabel(displayStatus)}
          </Chip>
          <Button
            mode="text"
            icon="refresh"
            onPress={refreshBooking}
            style={{ marginTop: 10 }}
            compact
          >
            Refresh
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Service</Text>
          <Text variant="bodyMedium">{displayBooking.Service?.name}</Text>
          <Text variant="bodySmall">${displayBooking.Service?.price}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Customer</Text>
          <Text variant="bodyMedium">{displayBooking.customer?.name}</Text>
          <Text variant="bodySmall">{displayBooking.customer?.email}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Pickup Location</Text>
          <Text variant="bodyMedium">{displayBooking.pickup_address || 'N/A'}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Drop Location</Text>
          <Text variant="bodyMedium">{displayBooking.drop_address || 'N/A'}</Text>
        </Card.Content>
      </Card>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(displayBooking.pickup_lat),
            longitude: parseFloat(displayBooking.pickup_lng),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Current booking markers */}
          <Marker
            coordinate={{
              latitude: parseFloat(displayBooking.pickup_lat),
              longitude: parseFloat(displayBooking.pickup_lng),
            }}
            title="Current Job - Pickup"
            pinColor="red"
          />
          <Marker
            coordinate={{
              latitude: parseFloat(displayBooking.drop_lat),
              longitude: parseFloat(displayBooking.drop_lng),
            }}
            title="Current Job - Drop"
            pinColor="red"
          />
          
          {/* Nearby bookings markers */}
          {nearbyBookings.map((nb) => (
            <React.Fragment key={nb.id}>
              <Marker
                coordinate={{
                  latitude: parseFloat(nb.pickup_lat),
                  longitude: parseFloat(nb.pickup_lng),
                }}
                title={`Nearby #${nb.id} - Pickup`}
                description={nb.pickup_address}
                pinColor="blue"
              />
              <Marker
                coordinate={{
                  latitude: parseFloat(nb.drop_lat),
                  longitude: parseFloat(nb.drop_lng),
                }}
                title={`Nearby #${nb.id} - Drop`}
                description={nb.drop_address}
                pinColor="blue"
              />
            </React.Fragment>
          ))}
        </MapView>
      </View>

      {nearbyBookings.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Nearby Parcels on Same Route ({nearbyBookings.length})
            </Text>
            <Text variant="bodySmall" style={styles.hint}>
              These parcels are within 10km and can be collected together
            </Text>
            {nearbyBookings.map((nb) => (
              <View key={nb.id} style={styles.nearbyItem}>
                <Text variant="bodyMedium">Booking #{nb.id}</Text>
                <Text variant="bodySmall">{nb.customer?.name}</Text>
                <Text variant="bodySmall" style={styles.address}>
                  {nb.pickup_address} → {nb.drop_address}
                </Text>
                <Button
                  mode="contained"
                  compact
                  onPress={async () => {
                    try {
                      await api.patch(`/bookings/${nb.id}/accept`);
                      Alert.alert('Success', 'Booking accepted!', [
                        { text: 'OK', onPress: () => navigation.goBack() },
                      ]);
                    } catch (error) {
                      Alert.alert('Error', error.response?.data?.error || 'Failed to accept');
                    }
                  }}
                  style={styles.acceptButton}
                >
                  Accept This Too
                </Button>
                <Divider style={styles.divider} />
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Delivery Progress Steps */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Delivery Progress
          </Text>
          <View style={styles.progressSteps}>
            <View style={[styles.step, displayStatus !== 'pending' && displayStatus !== 'rejected' && styles.stepCompleted]}>
              <Text variant="bodySmall" style={styles.stepLabel}>1. Accepted</Text>
            </View>
            <View style={[styles.step, ['on_the_way', 'started', 'delivered', 'handover', 'completed'].includes(displayStatus) && styles.stepCompleted]}>
              <Text variant="bodySmall" style={styles.stepLabel}>2. On the Way</Text>
            </View>
            <View style={[styles.step, ['started', 'delivered', 'handover', 'completed'].includes(displayStatus) && styles.stepCompleted]}>
              <Text variant="bodySmall" style={styles.stepLabel}>3. Collected</Text>
            </View>
            <View style={[styles.step, ['delivered', 'handover', 'completed'].includes(displayStatus) && styles.stepCompleted]}>
              <Text variant="bodySmall" style={styles.stepLabel}>4. Delivered</Text>
            </View>
            <View style={[styles.step, ['handover', 'completed'].includes(displayStatus) && styles.stepCompleted]}>
              <Text variant="bodySmall" style={styles.stepLabel}>5. Handover</Text>
            </View>
            <View style={[styles.step, displayStatus === 'completed' && styles.stepCompleted]}>
              <Text variant="bodySmall" style={styles.stepLabel}>6. Completed</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {displayStatus === 'accepted' && (
          <Button
            mode="contained"
            icon="map-marker-path"
            onPress={() => handleStatusUpdate('on_the_way')}
            loading={loading}
            style={styles.button}
          >
            Start Journey to Pickup
          </Button>
        )}
        {displayStatus === 'on_the_way' && (
          <Button
            mode="contained"
            icon="package-variant"
            onPress={() => handleStatusUpdate('started')}
            loading={loading}
            style={styles.button}
          >
            Parcel Collected
          </Button>
        )}
        {displayStatus === 'started' && (
          <Button
            mode="contained"
            icon="truck-delivery"
            onPress={() => handleStatusUpdate('delivered')}
            loading={loading}
            style={styles.button}
          >
            Arrived at Drop Location
          </Button>
        )}
        {displayStatus === 'delivered' && (
          <Button
            mode="contained"
            icon="handshake"
            onPress={() => handleStatusUpdate('handover')}
            loading={loading}
            style={styles.button}
          >
            Hand Over to Customer
          </Button>
        )}
        {displayStatus === 'handover' && (
          <Button
            mode="contained"
            icon="check-circle"
            onPress={() => handleStatusUpdate('completed')}
            loading={loading}
            style={styles.button}
          >
            Complete Delivery
          </Button>
        )}
        {!['completed', 'rejected'].includes(displayStatus) && (
          <Button
            mode="outlined"
            icon="map"
            onPress={openNavigation}
            style={styles.button}
          >
            {displayStatus === 'accepted' || displayStatus === 'on_the_way' 
              ? 'Navigate to Pickup' 
              : 'Navigate to Drop'}
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
  chip: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  actions: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  hint: {
    marginBottom: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  nearbyItem: {
    marginTop: 15,
    paddingBottom: 15,
  },
  address: {
    marginTop: 5,
    color: '#666',
  },
  acceptButton: {
    marginTop: 10,
  },
  divider: {
    marginTop: 15,
  },
  progressSteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  step: {
    width: '16%',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepCompleted: {
    backgroundColor: '#4caf50',
  },
  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },
});

export default JobDetailScreen;

