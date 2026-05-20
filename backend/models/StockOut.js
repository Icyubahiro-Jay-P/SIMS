import mongoose from 'mongoose';

const stockOutSchema = new mongoose.Schema({
  stockOutQuantity: { type: Number, required: true },
  stockOutUnitPrice: { type: Number, required: true },
  stockOutTotalPrice: { type: Number, required: true },
  stockOutDate: { type: Date, required: true, default: Date.now },
  sparePart: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true },
}, { timestamps: true });

export default mongoose.model('StockOut', stockOutSchema);
