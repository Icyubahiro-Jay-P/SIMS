import mongoose from 'mongoose';

const sparePartSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, default: 0, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
}, { timestamps: true });

export default mongoose.model('SparePart', sparePartSchema);
