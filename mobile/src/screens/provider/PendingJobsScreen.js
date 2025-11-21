import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import api from '../../utils/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const PendingJobsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadBookings();
    }, [])
  );

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/pending');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load pending bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleAccept = async (bookingId) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/accept`);
      loadBookings();
      
      // If there are nearby bookings, navigate to job detail to show route
      if (response.data.nearbyBookings && response.data.nearbyBookings.length > 0) {
        navigation.navigate('JobDetail', { 
          booking: response.data,
          showNearby: true 
        });
      }
    } catch (error) {
      console.error('Failed to accept booking:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium">Job #{item.id}</Text>
                <Text variant="bodyMedium">Customer: {item.customer?.name}</Text>
                <Text variant="bodySmall">{item.Service?.name}</Text>
                <Text variant="bodySmall" style={styles.address}>
                  {item.pickup_address || 'N/A'} → {item.drop_address || 'N/A'}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => handleAccept(item.id)}
                  style={styles.button}
                >
                  Accept
                </Button>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
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
  address: {
    marginTop: 5,
    color: '#666',
  },
  button: {
    marginTop: 10,
  },
  loader: {
    marginTop: 50,
  },
});

export default PendingJobsScreen;

