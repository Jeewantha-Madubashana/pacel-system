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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import api from '../utils/api';
import RouteMap from '../components/RouteMap';

const ProviderDashboard = () => {
  const [tab, setTab] = useState(0);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');
  const [routeDialog, setRouteDialog] = useState(false);
  const [currentRouteBooking, setCurrentRouteBooking] = useState(null);
  const [nearbyBookings, setNearbyBookings] = useState([]);

  useEffect(() => {
    loadPendingBookings();
    loadMyBookings();
    
    // Auto-refresh every 10 seconds to keep data fresh
    const interval = setInterval(() => {
      loadPendingBookings();
      loadMyBookings();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPendingBookings = async () => {
    try {
      const response = await api.get('/bookings/pending');
      setPendingBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load pending bookings');
    }
  };

  const loadMyBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setMyBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bookings');
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/accept`);
      loadPendingBookings();
      loadMyBookings();
      
      // Show route with nearby bookings if available
      if (response.data.nearbyBookings && response.data.nearbyBookings.length > 0) {
        setCurrentRouteBooking(response.data);
        setNearbyBookings(response.data.nearbyBookings);
        setRouteDialog(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept booking');
    }
  };

  const handleViewRoute = async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      if (response.data.nearbyBookings && response.data.nearbyBookings.length > 0) {
        setCurrentRouteBooking(response.data);
        setNearbyBookings(response.data.nearbyBookings);
        setRouteDialog(true);
      } else {
        // Still show the booking on map even if no nearby bookings
        setCurrentRouteBooking(response.data);
        setNearbyBookings([]);
        setRouteDialog(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load route');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/reject`);
      loadMyBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject booking');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await api.patch(`/bookings/${selectedBooking.id}/status`, { status: newStatus });
      setStatusDialog(false);
      setSelectedBooking(null);
      setNewStatus('');
      loadMyBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
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
      on_the_way: 'On the Way to Pickup',
      started: 'Parcel Collected',
      delivered: 'Delivered to Location',
      handover: 'Handed Over',
      completed: 'Completed',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Provider Dashboard
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Pending Jobs" />
        <Tab label="My Jobs" />
      </Tabs>

      {tab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Pickup</TableCell>
                <TableCell>Drop</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.customer?.name}</TableCell>
                  <TableCell>{booking.Service?.name}</TableCell>
                  <TableCell>{booking.pickup_address || 'N/A'}</TableCell>
                  <TableCell>{booking.drop_address || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleAccept(booking.id)}
                      sx={{ mr: 1 }}
                    >
                      Accept
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Pickup</TableCell>
                <TableCell>Drop</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.customer?.name}</TableCell>
                  <TableCell>{booking.Service?.name}</TableCell>
                  <TableCell>{booking.pickup_address || 'N/A'}</TableCell>
                  <TableCell>{booking.drop_address || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(booking.status)}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {booking.status === 'accepted' && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewRoute(booking.id)}
                          sx={{ mr: 1 }}
                        >
                          View Route
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setNewStatus('on_the_way');
                            setStatusDialog(true);
                          }}
                        >
                          On the Way
                        </Button>
                      </>
                    )}
                    {booking.status === 'on_the_way' && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setNewStatus('started');
                          setStatusDialog(true);
                        }}
                      >
                        Start
                      </Button>
                    )}
                    {booking.status === 'started' && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setNewStatus('delivered');
                          setStatusDialog(true);
                        }}
                      >
                        Arrived at Drop
                      </Button>
                    )}
                    {booking.status === 'delivered' && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setNewStatus('handover');
                          setStatusDialog(true);
                        }}
                      >
                        Hand Over
                      </Button>
                    )}
                    {booking.status === 'handover' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setNewStatus('completed');
                          setStatusDialog(true);
                        }}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <Typography>
            Update booking #{selectedBooking?.id} status to {newStatus}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={routeDialog} 
        onClose={() => setRouteDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Route View - Booking #{currentRouteBooking?.id}
          {nearbyBookings.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {nearbyBookings.length} nearby parcel{nearbyBookings.length > 1 ? 's' : ''} on same route
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {currentRouteBooking && (
            <>
              <RouteMap 
                currentBooking={currentRouteBooking}
                nearbyBookings={nearbyBookings}
              />
              {nearbyBookings.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Nearby Parcels (within 10km)
                  </Typography>
                  <List>
                    {nearbyBookings.map((booking, index) => (
                      <React.Fragment key={booking.id}>
                        <ListItem>
                          <ListItemText
                            primary={`Booking #${booking.id} - ${booking.customer?.name}`}
                            secondary={
                              <>
                                <strong>Pickup:</strong> {booking.pickup_address}
                                <br />
                                <strong>Drop:</strong> {booking.drop_address}
                                <br />
                                <strong>Service:</strong> {booking.service?.name}
                              </>
                            }
                          />
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                              try {
                                await api.patch(`/bookings/${booking.id}/accept`);
                                loadPendingBookings();
                                loadMyBookings();
                                setRouteDialog(false);
                              } catch (err) {
                                setError(err.response?.data?.error || 'Failed to accept booking');
                              }
                            }}
                          >
                            Accept
                          </Button>
                        </ListItem>
                        {index < nearbyBookings.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRouteDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderDashboard;

