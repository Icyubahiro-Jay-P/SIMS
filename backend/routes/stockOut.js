import express from 'express';
import StockOut from '../models/StockOut.js';
import SparePart from '../models/SparePart.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const records = await StockOut.find().populate('sparePart').sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const record = await StockOut.findById(req.params.id).populate('sparePart');
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { stockOutQuantity, stockOutUnitPrice, stockOutDate, sparePart } = req.body;
    const stockOutTotalPrice = Number(stockOutQuantity) * Number(stockOutUnitPrice);

    const record = await StockOut.create({
      stockOutQuantity, stockOutUnitPrice, stockOutTotalPrice, stockOutDate, sparePart,
    });

    const part = await SparePart.findById(sparePart);
    if (part && part.quantity >= Number(stockOutQuantity)) {
      part.quantity -= Number(stockOutQuantity);
      part.totalPrice = part.quantity * part.unitPrice;
      await part.save();
    }

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const oldRecord = await StockOut.findById(req.params.id);
    if (!oldRecord) return res.status(404).json({ message: 'Not found' });

    const { stockOutQuantity, stockOutUnitPrice, stockOutDate, sparePart } = req.body;
    const stockOutTotalPrice = Number(stockOutQuantity) * Number(stockOutUnitPrice);

    const part = await SparePart.findById(oldRecord.sparePart);
    if (part) {
      part.quantity += Number(oldRecord.stockOutQuantity);
      if (part.quantity >= Number(stockOutQuantity)) {
        part.quantity -= Number(stockOutQuantity);
      }
      part.totalPrice = part.quantity * part.unitPrice;
      await part.save();
    }

    oldRecord.stockOutQuantity = stockOutQuantity;
    oldRecord.stockOutUnitPrice = stockOutUnitPrice;
    oldRecord.stockOutTotalPrice = stockOutTotalPrice;
    oldRecord.stockOutDate = stockOutDate;
    if (sparePart) oldRecord.sparePart = sparePart;
    await oldRecord.save();

    const populated = await StockOut.findById(oldRecord._id).populate('sparePart');
    res.json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await StockOut.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Not found' });

    const part = await SparePart.findById(record.sparePart);
    if (part) {
      part.quantity += Number(record.stockOutQuantity);
      part.totalPrice = part.quantity * part.unitPrice;
      await part.save();
    }

    await StockOut.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
