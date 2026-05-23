import mongoose from 'mongoose';

const stockOutSchema = new mongoose.Schema({
  stockOutQuantity: { type: Number, required: true, min: 1 },
  stockOutUnitPrice: { type: Number, required: true, min: 0 },
  stockOutTotalPrice: { type: Number, required: true, min: 0 },
  stockOutDate: { type: Date, required: true, default: Date.now },
  sparePart: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true },
}, { timestamps: true });

export default mongoose.model('StockOut', stockOutSchema);
