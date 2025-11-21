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
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  LocalShipping as ShippingIcon,
  Dashboard as DashboardIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import api from '../utils/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
  });

  // Category dialog
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  // Service dialog
  const [serviceDialog, setServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceData, setServiceData] = useState({ name: '', price: '', category_id: '' });

  // User menu
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Booking view dialog
  const [bookingViewDialog, setBookingViewDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadData();
    loadStats();
  }, [tab]);

  const loadStats = async () => {
    try {
      const [usersRes, bookingsRes] = await Promise.all([
        api.get('/users'),
        api.get('/bookings'),
      ]);
      const allBookings = bookingsRes.data;
      setStats({
        totalUsers: usersRes.data.length,
        totalBookings: allBookings.length,
        completedBookings: allBookings.filter(b => b.status === 'completed').length,
        pendingBookings: allBookings.filter(b => b.status === 'pending').length,
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 0) {
        const response = await api.get('/users');
        setUsers(response.data);
      } else if (tab === 1) {
        const [catResponse, servResponse] = await Promise.all([
          api.get('/categories'),
          api.get('/services'),
        ]);
        setCategories(catResponse.data);
        setServices(servResponse.data);
      } else if (tab === 2) {
        const response = await api.get('/bookings');
        setBookings(response.data);
      }
      loadStats();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, { name: categoryName });
        setSuccess('Category updated successfully');
      } else {
        await api.post('/categories', { name: categoryName });
        setSuccess('Category created successfully');
      }
      setCategoryDialog(false);
      setEditingCategory(null);
      setCategoryName('');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save category');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDialog(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This will also delete all associated services.')) {
      return;
    }
    try {
      await api.delete(`/categories/${categoryId}`);
      setSuccess('Category deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete category');
    }
  };

  const handleCreateService = async () => {
    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, {
          name: serviceData.name,
          price: parseFloat(serviceData.price),
          category_id: parseInt(serviceData.category_id),
        });
        setSuccess('Service updated successfully');
      } else {
        await api.post('/services', {
          name: serviceData.name,
          price: parseFloat(serviceData.price),
          category_id: parseInt(serviceData.category_id),
        });
        setSuccess('Service created successfully');
      }
      setServiceDialog(false);
      setEditingService(null);
      setServiceData({ name: '', price: '', category_id: '' });
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save service');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceData({
      name: service.name,
      price: service.price,
      category_id: service.category_id,
    });
    setServiceDialog(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }
    try {
      await api.delete(`/services/${serviceId}`);
      setSuccess('Service deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete service');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await api.delete(`/users/${userId}`);
      setSuccess('User deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
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

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1976d2', mb: 3 }}>
        <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2">Total Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <ShippingIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.totalBookings}
              </Typography>
              <Typography variant="body2">Total Bookings</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
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
              <CategoryIcon sx={{ fontSize: 40, mb: 1 }} />
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
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Users" />
          <Tab icon={<CategoryIcon />} iconPosition="start" label="Categories & Services" />
          <Tab icon={<ShippingIcon />} iconPosition="start" label="Bookings" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tab === 0 && (
            <TableContainer component={Paper} elevation={2}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Users Management
                </Typography>
              </Box>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === 'admin' ? 'error' : user.role === 'provider' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete User">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Categories
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryName('');
                    setCategoryDialog(true);
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Add Category
                </Button>
              </Box>
              <TableContainer component={Paper} elevation={2} sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow key={cat.id} hover>
                        <TableCell>{cat.id}</TableCell>
                        <TableCell>{cat.name}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditCategory(cat)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteCategory(cat.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Services
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditingService(null);
                    setServiceData({ name: '', price: '', category_id: '' });
                    setServiceDialog(true);
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Add Service
                </Button>
              </Box>
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id} hover>
                        <TableCell>{service.id}</TableCell>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.Category?.name}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>
                          ${service.price}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditService(service)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {tab === 2 && (
            <TableContainer component={Paper} elevation={2}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  All Bookings
                </Typography>
              </Box>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Provider</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} hover>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>{booking.customer?.name || 'N/A'}</TableCell>
                      <TableCell>{booking.provider?.name || 'N/A'}</TableCell>
                      <TableCell>{booking.Service?.name}</TableCell>
                      <TableCell>
                        <Chip
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
                              setBookingViewDialog(true);
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
            </TableContainer>
          )}
        </>
      )}

      {/* Category Dialog */}
      <Dialog
        open={categoryDialog}
        onClose={() => {
          setCategoryDialog(false);
          setEditingCategory(null);
          setCategoryName('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            margin="normal"
            autoFocus
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCategoryDialog(false);
            setEditingCategory(null);
            setCategoryName('');
          }}>
            Cancel
          </Button>
          <Button onClick={handleCreateCategory} variant="contained" disabled={!categoryName.trim()}>
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Dialog */}
      <Dialog
        open={serviceDialog}
        onClose={() => {
          setServiceDialog(false);
          setEditingService(null);
          setServiceData({ name: '', price: '', category_id: '' });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Service Name"
            value={serviceData.name}
            onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })}
            margin="normal"
            autoFocus
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={serviceData.price}
            onChange={(e) => setServiceData({ ...serviceData, price: e.target.value })}
            margin="normal"
            inputProps={{ min: 0, step: 0.01 }}
          />
          <TextField
            fullWidth
            select
            label="Category"
            value={serviceData.category_id}
            onChange={(e) => setServiceData({ ...serviceData, category_id: e.target.value })}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setServiceDialog(false);
            setEditingService(null);
            setServiceData({ name: '', price: '', category_id: '' });
          }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateService}
            variant="contained"
            disabled={!serviceData.name.trim() || !serviceData.price || !serviceData.category_id}
          >
            {editingService ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Booking View Dialog */}
      <Dialog
        open={bookingViewDialog}
        onClose={() => {
          setBookingViewDialog(false);
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
                  <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedBooking.customer?.name} ({selectedBooking.customer?.email})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Provider</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedBooking.provider?.name || 'Not Assigned'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedBooking.Service?.name} - ${selectedBooking.Service?.price}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    label={getStatusLabel(selectedBooking.status)}
                    color={getStatusColor(selectedBooking.status)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Pickup Location</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedBooking.pickup_address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Drop Location</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedBooking.drop_address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {new Date(selectedBooking.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {new Date(selectedBooking.updated_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setBookingViewDialog(false);
            setSelectedBooking(null);
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
