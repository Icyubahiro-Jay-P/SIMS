import { Router } from 'express';
import StockOut from '../models/StockOut.js';
import SparePart from '../models/SparePart.js';
import requireAuth from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const stockOuts = await StockOut.find().populate('sparePart').sort({ stockOutDate: -1 });
    return res.json(stockOuts);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const stockOut = await StockOut.findById(req.params.id).populate('sparePart');
    if (!stockOut) return res.status(404).json({ message: 'Stock out record not found' });
    return res.json(stockOut);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { stockOutQuantity, stockOutUnitPrice, stockOutDate, sparePartId } = req.body;

    const sparePart = await SparePart.findById(sparePartId);
    if (!sparePart) return res.status(404).json({ message: 'Spare part not found' });

    if (sparePart.quantity < stockOutQuantity) {
      return res.status(400).json({ message: `Insufficient stock. Available: ${sparePart.quantity}` });
    }

    const stockOutTotalPrice = stockOutQuantity * stockOutUnitPrice;

    const stockOut = new StockOut({
      stockOutQuantity,
      stockOutUnitPrice,
      stockOutTotalPrice,
      stockOutDate: stockOutDate || new Date(),
      sparePart: sparePartId,
    });
    await stockOut.save();

    sparePart.quantity -= stockOutQuantity;
    sparePart.totalPrice = sparePart.quantity * sparePart.unitPrice;
    await sparePart.save();

    const populated = await stockOut.populate('sparePart');
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const existing = await StockOut.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Stock out record not found' });

    const { stockOutQuantity, stockOutUnitPrice, stockOutDate, sparePartId } = req.body;

    const oldQty = existing.stockOutQuantity;
    const oldSparePartId = existing.sparePart.toString();

    const sparePart = await SparePart.findById(sparePartId || oldSparePartId);
    if (!sparePart) return res.status(404).json({ message: 'Spare part not found' });

    if (sparePartId && sparePartId !== oldSparePartId) {
      const oldSparePart = await SparePart.findById(oldSparePartId);
      if (oldSparePart) {
        oldSparePart.quantity += oldQty;
        oldSparePart.totalPrice = oldSparePart.quantity * oldSparePart.unitPrice;
        await oldSparePart.save();
      }
      if (sparePart.quantity < stockOutQuantity) {
        return res.status(400).json({ message: `Insufficient stock. Available: ${sparePart.quantity}` });
      }
      sparePart.quantity -= stockOutQuantity;
    } else {
      const diff = stockOutQuantity - oldQty;
      if (diff > 0 && sparePart.quantity < diff) {
        return res.status(400).json({ message: `Insufficient stock. Available: ${sparePart.quantity}` });
      }
      sparePart.quantity -= diff;
    }

    sparePart.totalPrice = sparePart.quantity * sparePart.unitPrice;
    await sparePart.save();

    existing.stockOutQuantity = stockOutQuantity ?? existing.stockOutQuantity;
    existing.stockOutUnitPrice = stockOutUnitPrice ?? existing.stockOutUnitPrice;
    existing.stockOutTotalPrice = (stockOutQuantity ?? existing.stockOutQuantity) * (stockOutUnitPrice ?? existing.stockOutUnitPrice);
    existing.stockOutDate = stockOutDate ? new Date(stockOutDate) : existing.stockOutDate;
    if (sparePartId) existing.sparePart = sparePartId;

    await existing.save();
    const populated = await existing.populate('sparePart');
    return res.json(populated);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const stockOut = await StockOut.findById(req.params.id);
    if (!stockOut) return res.status(404).json({ message: 'Stock out record not found' });

    const sparePart = await SparePart.findById(stockOut.sparePart);
    if (sparePart) {
      sparePart.quantity += stockOut.stockOutQuantity;
      sparePart.totalPrice = sparePart.quantity * sparePart.unitPrice;
      await sparePart.save();
    }

    await StockOut.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Stock out record deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
