import { Router } from 'express';
import StockOut from '../models/StockOut.js';
import SparePart from '../models/SparePart.js';
import StockIn from '../models/StockIn.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/daily-stockout', async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();

    const start = new Date(queryDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(queryDate);
    end.setHours(23, 59, 59, 999);

    const stockOuts = await StockOut.find({
      stockOutDate: { $gte: start, $lte: end },
    }).populate('sparePart').sort({ stockOutDate: -1 });

    return res.json(stockOuts);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/daily-stock-status', async (req, res) => {
  try {
    const spareParts = await SparePart.find().sort({ name: 1 });

    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    const start = new Date(queryDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(queryDate);
    end.setHours(23, 59, 59, 999);

    const result = await Promise.all(spareParts.map(async (sp) => {
      const stockOutAgg = await StockOut.aggregate([
        { $match: { sparePart: sp._id, stockOutDate: { $gte: start, $lte: end } } },
        { $group: { _id: null, totalOut: { $sum: '$stockOutQuantity' } } },
      ]);

      const stockOutQty = stockOutAgg.length > 0 ? stockOutAgg[0].totalOut : 0;

      return {
        sparePartName: sp.name,
        storedQty: sp.quantity + stockOutQty,
        stockOutQty,
        remainingQty: sp.quantity,
      };
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
