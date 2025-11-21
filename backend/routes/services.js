import express from 'express';
import Service from '../models/Service.js';
import Category from '../models/Category.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [{ model: Category }],
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get services by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { category_id: req.params.categoryId },
      include: [{ model: Category }],
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [{ model: Category }],
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create service (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { category_id, name, price } = req.body;
    if (!category_id || !name || !price) {
      return res.status(400).json({ error: 'Category ID, name, and price are required' });
    }

    const service = await Service.create({ category_id, name, price });
    const serviceWithCategory = await Service.findByPk(service.id, {
      include: [{ model: Category }],
    });
    res.status(201).json(serviceWithCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const { category_id, name, price } = req.body;
    if (category_id) service.category_id = category_id;
    if (name) service.name = name;
    if (price) service.price = price;

    await service.save();
    const serviceWithCategory = await Service.findByPk(service.id, {
      include: [{ model: Category }],
    });
    res.json(serviceWithCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete service (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await service.destroy();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

