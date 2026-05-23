import { Router } from 'express';
import SparePart from '../models/SparePart.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const spareParts = await SparePart.find().sort({ name: 1 });
    return res.json(spareParts);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const sparePart = await SparePart.findById(req.params.id);
    if (!sparePart) return res.status(404).json({ message: 'Spare part not found' });
    return res.json(sparePart);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, unitPrice } = req.body;
    const totalPrice = (quantity || 0) * (unitPrice || 0);
    const sparePart = new SparePart({ name, category, quantity, unitPrice, totalPrice });
    await sparePart.save();
    return res.status(201).json(sparePart);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Spare part with this name already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
