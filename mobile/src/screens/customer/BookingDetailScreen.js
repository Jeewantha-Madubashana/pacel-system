import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

const BookingDetailScreen = () => {
  const route = useRoute();
  const { booking } = route.params;

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      accepted: '#2196f3',
      on_the_way: '#9c27b0',
      started: '#673ab7',
      completed: '#4caf50',
      rejected: '#f44336',
    };
    return colors[status] || '#757575';
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Booking #{booking.id}</Text>
          <Chip
            style={[styles.chip, { backgroundColor: getStatusColor(booking.status) }]}
            textStyle={{ color: '#fff' }}
          >
            {booking.status}
          </Chip>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Service</Text>
          <Text variant="bodyMedium">{booking.Service?.name}</Text>
          <Text variant="bodySmall">${booking.Service?.price}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Pickup Location</Text>
          <Text variant="bodyMedium">{booking.pickup_address || 'N/A'}</Text>
          <Text variant="bodySmall">
            {booking.pickup_lat}, {booking.pickup_lng}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Drop Location</Text>
          <Text variant="bodyMedium">{booking.drop_address || 'N/A'}</Text>
          <Text variant="bodySmall">
            {booking.drop_lat}, {booking.drop_lng}
          </Text>
        </Card.Content>
      </Card>

      {booking.provider && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Provider</Text>
            <Text variant="bodyMedium">{booking.provider.name}</Text>
            <Text variant="bodySmall">{booking.provider.email}</Text>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Created</Text>
          <Text variant="bodyMedium">
            {new Date(booking.created_at).toLocaleString()}
          </Text>
        </Card.Content>
      </Card>
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
});

export default BookingDetailScreen;

