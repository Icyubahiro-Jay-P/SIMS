import mongoose from 'mongoose';

const stockInSchema = new mongoose.Schema({
  stockInQuantity: { type: Number, required: true, min: 1 },
  stockInDate: { type: Date, required: true, default: Date.now },
  sparePart: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true },
}, { timestamps: true });

export default mongoose.model('StockIn', stockInSchema);
