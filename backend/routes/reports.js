import express from 'express';
import StockOut from '../models/StockOut.js';
import SparePart from '../models/SparePart.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/daily-stockout', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    const start = new Date(queryDate.setHours(0, 0, 0, 0));
    const end = new Date(queryDate.setHours(23, 59, 59, 999));

    const records = await StockOut.find({
      stockOutDate: { $gte: start, $lte: end },
    }).populate('sparePart').sort({ stockOutDate: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/daily-stock-status', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    const start = new Date(queryDate.setHours(0, 0, 0, 0));
    const end = new Date(queryDate.setHours(23, 59, 59, 999));

    const parts = await SparePart.find().sort({ name: 1 });

    const stockOuts = await StockOut.aggregate([
      { $match: { stockOutDate: { $gte: start, $lte: end } } },
      { $group: { _id: '$sparePart', totalOut: { $sum: '$stockOutQuantity' } } },
    ]);

    const outMap = {};
    stockOuts.forEach((s) => { outMap[s._id.toString()] = s.totalOut; });

    const report = parts.map((p) => ({
      name: p.name,
      storedQty: p.quantity + (outMap[p._id.toString()] || 0),
      stockOut: outMap[p._id.toString()] || 0,
      remainingQty: p.quantity,
    }));

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
