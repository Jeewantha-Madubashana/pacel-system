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
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  LocationOn as LocationIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewBookingDialog, setViewBookingDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    activeBookings: 0,
  });

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
      const bookingsData = response.data;
      setBookings(bookingsData);
      
      // Calculate stats
      setStats({
        totalBookings: bookingsData.length,
        completedBookings: bookingsData.filter(b => b.status === 'completed').length,
        pendingBookings: bookingsData.filter(b => b.status === 'pending').length,
        activeBookings: bookingsData.filter(b => 
          ['accepted', 'on_the_way', 'started', 'delivered', 'handover'].includes(b.status)
        ).length,
      });
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
    setSuccess('');

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
      setSuccess('Booking created successfully!');
      setBookingDialog(false);
      setSelectedService(null);
      setPickupLocation(null);
      setDropLocation(null);
      loadBookings();
      setTab(1); // Switch to bookings tab
      setTimeout(() => setSuccess(''), 3000);
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
      delivered: 'warning',
      handover: 'info',
      completed: 'success',
      rejected: 'error',
    };
    return colors[status] || 'default';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'pending':
        return <ScheduleIcon />;
      default:
        return <ShippingIcon />;
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1976d2', mb: 3 }}>
        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Customer Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <HistoryIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.totalBookings}
              </Typography>
              <Typography variant="body2">Total Bookings</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <ShippingIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.activeBookings}
              </Typography>
              <Typography variant="body2">Active Bookings</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.completedBookings}
              </Typography>
              <Typography variant="body2">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.pendingBookings}
              </Typography>
              <Typography variant="body2">Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { fontWeight: 500 },
          }}
        >
          <Tab icon={<ShoppingCartIcon />} iconPosition="start" label="Book Service" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="My Bookings" />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Select Category
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                onClick={() => handleCategorySelect(category.id)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: selectedCategory === category.id ? 600 : 400,
                }}
              >
                {category.name}
              </Button>
            ))}
          </Box>

          {selectedCategory && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Available Services
              </Typography>
              {services.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No services available in this category
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {services.map((service) => (
                    <Grid item xs={12} sm={6} md={4} key={service.id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                        elevation={2}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {service.name}
                          </Typography>
                          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700, mb: 2 }}>
                            ${service.price}
                          </Typography>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleServiceSelect(service)}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                          >
                            Book Now
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Box>
      )}

      {tab === 1 && (
        <TableContainer component={Paper} elevation={2}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Booking History
            </Typography>
          </Box>
          {bookings.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No bookings yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first booking from the "Book Service" tab
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Pickup</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Drop</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {booking.Service?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${booking.Service?.price}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon fontSize="small" color="primary" />
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {booking.pickup_address || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon fontSize="small" color="secondary" />
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {booking.drop_address || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(booking.status)}
                        label={getStatusLabel(booking.status)}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(booking.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setViewBookingDialog(true);
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}

      {/* Booking Dialog */}
      <Dialog
        open={bookingDialog}
        onClose={() => {
          setBookingDialog(false);
          setPickupLocation(null);
          setDropLocation(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCartIcon color="primary" />
            Create Booking - {selectedService?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedService && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedService.name}
              </Typography>
              <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700 }}>
                ${selectedService.price}
              </Typography>
            </Box>
          )}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon color="primary" />
              Pickup Location
            </Typography>
            <MapPicker
              onLocationSelect={(location) => setPickupLocation(location)}
              selectedLocation={pickupLocation}
            />
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon color="secondary" />
              Drop Location
            </Typography>
            <MapPicker
              onLocationSelect={(location) => setDropLocation(location)}
              selectedLocation={dropLocation}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setBookingDialog(false);
              setPickupLocation(null);
              setDropLocation(null);
            }}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateBooking}
            variant="contained"
            disabled={loading || !pickupLocation || !dropLocation}
            startIcon={loading ? <CircularProgress size={16} /> : <CheckCircleIcon />}
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Booking Dialog */}
      <Dialog
        open={viewBookingDialog}
        onClose={() => {
          setViewBookingDialog(false);
          setSelectedBooking(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Booking Details #{selectedBooking?.id}</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    {selectedBooking.Service?.name} - ${selectedBooking.Service?.price}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(selectedBooking.status)}
                    label={getStatusLabel(selectedBooking.status)}
                    color={getStatusColor(selectedBooking.status)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Provider</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedBooking.provider?.name || 'Not Assigned'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {new Date(selectedBooking.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Pickup Location</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedBooking.pickup_address}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Drop Location</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedBooking.drop_address}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setViewBookingDialog(false);
            setSelectedBooking(null);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerDashboard;
