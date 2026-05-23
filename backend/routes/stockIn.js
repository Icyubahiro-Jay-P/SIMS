import { Router } from 'express';
import StockIn from '../models/StockIn.js';
import SparePart from '../models/SparePart.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const stockIns = await StockIn.find().populate('sparePart').sort({ stockInDate: -1 });
    return res.json(stockIns);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { stockInQuantity, stockInDate, sparePartId } = req.body;

    const sparePart = await SparePart.findById(sparePartId);
    if (!sparePart) return res.status(404).json({ message: 'Spare part not found' });

    const stockIn = new StockIn({
      stockInQuantity,
      stockInDate: stockInDate || new Date(),
      sparePart: sparePartId,
    });
    await stockIn.save();

    sparePart.quantity += stockInQuantity;
    sparePart.totalPrice = sparePart.quantity * sparePart.unitPrice;
    await sparePart.save();

    const populated = await stockIn.populate('sparePart');
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
