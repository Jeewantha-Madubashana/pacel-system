import express from 'express';
import { Op } from 'sequelize';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import File from '../models/File.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { findNearbyBookings } from '../utils/distance.js';

const router = express.Router();

// Get all bookings (Admin) or user's bookings
router.get('/', authenticate, async (req, res) => {
  try {
    let whereClause = {};
    
    if (req.user.role === 'customer') {
      whereClause.customer_id = req.user.id;
    } else if (req.user.role === 'provider') {
      whereClause.provider_id = req.user.id;
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'email'], required: false },
        { model: Service, include: [{ model: Category }] },
        { model: File, as: 'Files', required: false },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending bookings for providers
router.get('/pending', authenticate, authorize('provider'), async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { status: 'pending', provider_id: null },
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: Service, include: [{ model: Category }] },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nearby bookings for a route (Provider only)
router.get('/:id/nearby', authenticate, authorize('provider'), async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: Service, include: [{ model: Category }] },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if provider owns this booking or it's pending
    if (booking.provider_id && booking.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Find nearby pending bookings that could be on the same route
    const allPendingBookings = await Booking.findAll({
      where: { 
        status: 'pending', 
        provider_id: null,
        id: { [Op.ne]: booking.id } // Exclude current booking
      },
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: Service, include: [{ model: Category }] },
      ],
    });

    // Find nearby bookings within 10km radius from pickup location
    const nearbyBookings = findNearbyBookings(
      booking.pickup_lat,
      booking.pickup_lng,
      allPendingBookings,
      10 // 10km radius
    );

    res.json({
      currentBooking: {
        id: booking.id,
        customer: booking.customer,
        service: booking.Service,
        pickup_lat: booking.pickup_lat,
        pickup_lng: booking.pickup_lng,
        pickup_address: booking.pickup_address,
        drop_lat: booking.drop_lat,
        drop_lng: booking.drop_lng,
        drop_address: booking.drop_address,
      },
      nearbyBookings: nearbyBookings.map(b => ({
        id: b.id,
        customer: b.customer,
        service: b.Service,
        pickup_lat: b.pickup_lat,
        pickup_lng: b.pickup_lng,
        pickup_address: b.pickup_address,
        drop_lat: b.drop_lat,
        drop_lng: b.drop_lng,
        drop_address: b.drop_address,
        created_at: b.created_at,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'email'], required: false },
        { model: Service, include: [{ model: Category }] },
        { model: File, as: 'Files', required: false },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isCustomer = booking.customer_id === req.user.id;
    const isProvider = booking.provider_id === req.user.id;

    if (!isAdmin && !isCustomer && !isProvider) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // If provider is viewing their accepted booking, include nearby bookings
    let nearbyBookings = [];
    if (isProvider && booking.status !== 'pending' && booking.status !== 'completed') {
      const allPendingBookings = await Booking.findAll({
        where: { 
          status: 'pending', 
          provider_id: null,
          id: { [Op.ne]: booking.id }
        },
        include: [
          { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
          { model: Service, include: [{ model: Category }] },
        ],
      });

      nearbyBookings = findNearbyBookings(
        booking.pickup_lat,
        booking.pickup_lng,
        allPendingBookings,
        10
      ).map(b => ({
        id: b.id,
        customer: b.customer,
        service: b.Service,
        pickup_lat: b.pickup_lat,
        pickup_lng: b.pickup_lng,
        pickup_address: b.pickup_address,
        drop_lat: b.drop_lat,
        drop_lng: b.drop_lng,
        drop_address: b.drop_address,
        created_at: b.created_at,
      }));
    }

    res.json({
      ...booking.toJSON(),
      nearbyBookings: nearbyBookings.length > 0 ? nearbyBookings : undefined,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking (Customer)
router.post('/', authenticate, authorize('customer'), async (req, res) => {
  try {
    const {
      service_id,
      pickup_lat,
      pickup_lng,
      pickup_address,
      drop_lat,
      drop_lng,
      drop_address,
    } = req.body;

    if (!service_id || !pickup_lat || !pickup_lng || !drop_lat || !drop_lng) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const booking = await Booking.create({
      customer_id: req.user.id,
      service_id,
      pickup_lat,
      pickup_lng,
      pickup_address: pickup_address || '',
      drop_lat,
      drop_lng,
      drop_address: drop_address || '',
      status: 'pending',
    });

    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: Service, include: [{ model: Category }] },
      ],
    });

    res.status(201).json(bookingWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept/Reject booking (Provider)
router.patch('/:id/accept', authenticate, authorize('provider'), async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'pending' || booking.provider_id) {
      return res.status(400).json({ error: 'Booking is not available' });
    }

    booking.provider_id = req.user.id;
    booking.status = 'accepted';
    booking.updated_at = new Date();
    await booking.save();

    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'email'] },
        { model: Service, include: [{ model: Category }] },
      ],
    });

    // Find nearby pending bookings that could be on the same route
    const allPendingBookings = await Booking.findAll({
      where: { 
        status: 'pending', 
        provider_id: null,
        id: { [Op.ne]: booking.id } // Exclude current booking
      },
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: Service, include: [{ model: Category }] },
      ],
    });

    // Find nearby bookings within 10km radius
    const nearbyBookings = findNearbyBookings(
      booking.pickup_lat,
      booking.pickup_lng,
      allPendingBookings,
      10 // 10km radius
    );

    res.json({
      ...bookingWithDetails.toJSON(),
      nearbyBookings: nearbyBookings.map(b => ({
        id: b.id,
        customer: b.customer,
        service: b.Service,
        pickup_lat: b.pickup_lat,
        pickup_lng: b.pickup_lng,
        pickup_address: b.pickup_address,
        drop_lat: b.drop_lat,
        drop_lng: b.drop_lng,
        drop_address: b.drop_address,
        created_at: b.created_at,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/reject', authenticate, authorize('provider'), async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    booking.provider_id = null;
    booking.status = 'pending';
    booking.updated_at = new Date();
    await booking.save();

    res.json({ message: 'Booking rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (Provider)
router.patch('/:id/status', authenticate, authorize('provider'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['on_the_way', 'started', 'delivered', 'handover', 'completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Validate status transitions
    const validTransitions = {
      'accepted': ['on_the_way'],
      'on_the_way': ['started'],
      'started': ['delivered'],
      'delivered': ['handover'],
      'handover': ['completed'],
    };

    if (validTransitions[booking.status] && !validTransitions[booking.status].includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status transition. Current status: ${booking.status}. Allowed: ${validTransitions[booking.status].join(', ')}` 
      });
    }

    booking.status = status;
    booking.updated_at = new Date();
    await booking.save();

    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'email'] },
        { model: Service, include: [{ model: Category }] },
        { model: File, as: 'Files', required: false },
      ],
    });

    res.json(bookingWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload file for booking (Provider)
router.post('/:id/files', authenticate, authorize('provider'), upload.single('file'), async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = await File.create({
      booking_id: booking.id,
      file_url: `/uploads/${req.file.filename}`,
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'document',
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

