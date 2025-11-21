import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Chip, ActivityIndicator } from 'react-native-paper';
import api from '../../utils/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const MyJobsScreen = () => {
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
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
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
      on_the_way: 'On the Way',
      started: 'Collected',
      delivered: 'Delivered',
      handover: 'Handover',
      completed: 'Completed',
      rejected: 'Rejected',
    };
    return labels[status] || status;
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
            <Card
              style={styles.card}
              onPress={() => navigation.navigate('JobDetail', { booking: item })}
            >
              <Card.Content>
                <Text variant="titleMedium">Job #{item.id}</Text>
                <Text variant="bodyMedium">{item.customer?.name}</Text>
                <Text variant="bodySmall">{item.Service?.name}</Text>
                <Text variant="bodySmall" style={styles.address}>
                  {item.pickup_address || 'N/A'} → {item.drop_address || 'N/A'}
                </Text>
                <Chip
                  style={[styles.chip, { backgroundColor: getStatusColor(item.status) }]}
                  textStyle={{ color: '#fff' }}
                >
                  {getStatusLabel(item.status)}
                </Chip>
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
  chip: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  loader: {
    marginTop: 50,
  },
});

export default MyJobsScreen;

