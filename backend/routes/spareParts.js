import express from 'express';
import SparePart from '../models/SparePart.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const parts = await SparePart.find().sort({ createdAt: -1 });
    res.json(parts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const part = await SparePart.findById(req.params.id);
    if (!part) return res.status(404).json({ message: 'Not found' });
    res.json(part);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, category, quantity, unitPrice } = req.body;
    const part = await SparePart.create({
      name, category, quantity, unitPrice,
      totalPrice: Number(quantity) * Number(unitPrice),
    });
    res.status(201).json(part);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const part = await SparePart.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!part) return res.status(404).json({ message: 'Not found' });
    res.json(part);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const part = await SparePart.findByIdAndDelete(req.params.id);
    if (!part) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
