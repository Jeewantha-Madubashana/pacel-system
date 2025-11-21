import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
} from '@mui/material';
import api from '../utils/api';
import MapPicker from '../components/MapPicker';

const CustomerDashboard = () => {
  const [tab, setTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    loadBookings();
    
    // Auto-refresh bookings every 10 seconds to keep data fresh
    const interval = setInterval(() => {
      loadBookings();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load categories');
    }
  };

  const loadServices = async (categoryId) => {
    try {
      const response = await api.get(`/services/category/${categoryId}`);
      setServices(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load services');
    }
  };

  const loadBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bookings');
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    loadServices(categoryId);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setBookingDialog(true);
  };

  const handleCreateBooking = async () => {
    if (!pickupLocation || !dropLocation) {
      setError('Please select both pickup and drop locations');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/bookings', {
        service_id: selectedService.id,
        pickup_lat: pickupLocation.lat,
        pickup_lng: pickupLocation.lng,
        pickup_address: pickupLocation.address,
        drop_lat: dropLocation.lat,
        drop_lng: dropLocation.lng,
        drop_address: dropLocation.address,
      });
      setBookingDialog(false);
      setSelectedService(null);
      setPickupLocation(null);
      setDropLocation(null);
      loadBookings();
      setTab(1); // Switch to bookings tab
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      accepted: 'info',
      on_the_way: 'primary',
      started: 'secondary',
      completed: 'success',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Customer Dashboard
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Book Service" />
        <Tab label="My Bookings" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Select Category
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </Box>

          {selectedCategory && (
            <>
              <Typography variant="h6" gutterBottom>
                Select Service
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {services.map((service) => (
                  <Paper key={service.id} sx={{ p: 2, minWidth: 200 }}>
                    <Typography variant="h6">{service.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${service.price}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleServiceSelect(service)}
                    >
                      Book Now
                    </Button>
                  </Paper>
                ))}
              </Box>
            </>
          )}
        </Box>
      )}

      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Pickup</TableCell>
                <TableCell>Drop</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.Service?.name}</TableCell>
                  <TableCell>{booking.pickup_address || 'N/A'}</TableCell>
                  <TableCell>{booking.drop_address || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(booking.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={bookingDialog}
        onClose={() => setBookingDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Booking - {selectedService?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pickup Location
            </Typography>
            <MapPicker
              onLocationSelect={(location) => setPickupLocation(location)}
              selectedLocation={pickupLocation}
            />
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Drop Location
            </Typography>
            <MapPicker
              onLocationSelect={(location) => setDropLocation(location)}
              selectedLocation={dropLocation}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateBooking}
            variant="contained"
            disabled={loading || !pickupLocation || !dropLocation}
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerDashboard;

