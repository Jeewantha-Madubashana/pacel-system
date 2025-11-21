import express from 'express';
import axios from 'axios';

const router = express.Router();

// Search location using Nominatim
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q,
        format: 'json',
        limit: 10,
      },
      headers: {
        'User-Agent': 'ParcelDeliveryApp/1.0',
      },
    });

    const results = response.data.map((item) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      place_id: item.place_id,
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reverse geocode (lat/lng to address)
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Lat and lng parameters are required' });
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json',
      },
      headers: {
        'User-Agent': 'ParcelDeliveryApp/1.0',
      },
    });

    res.json({
      display_name: response.data.display_name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address: response.data.address,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

