import express from 'express';
import StockIn from '../models/StockIn.js';
import SparePart from '../models/SparePart.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const records = await StockIn.find().populate('sparePart').sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { stockInQuantity, stockInDate, sparePart } = req.body;
    const record = await StockIn.create({ stockInQuantity, stockInDate, sparePart });

    const part = await SparePart.findById(sparePart);
    if (part) {
      part.quantity += Number(stockInQuantity);
      part.totalPrice = part.quantity * part.unitPrice;
      await part.save();
    }

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
