import mongoose from 'mongoose';

const sparePartSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
}, { timestamps: true });

sparePartSchema.pre('save', function (next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

export default mongoose.model('SparePart', sparePartSchema);
