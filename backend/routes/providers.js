import express from 'express';
import Provider from '../models/Provider.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all providers
router.get('/', async (req, res) => {
  try {
    const providers = await Provider.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password_hash'] },
        },
      ],
    });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get provider by ID
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: { exclude: ['password_hash'] },
        },
      ],
    });

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update provider (Admin or self)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const providerId = parseInt(req.params.id);
    const provider = await Provider.findByPk(providerId, {
      include: [{ model: User }],
    });

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isSelf = provider.user_id === req.user.id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { skills, availability } = req.body;
    if (skills !== undefined) provider.skills = skills;
    if (availability !== undefined) provider.availability = availability;

    await provider.save();

    const updatedProvider = await Provider.findByPk(providerId, {
      include: [
        {
          model: User,
          attributes: { exclude: ['password_hash'] },
        },
      ],
    });

    res.json(updatedProvider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

