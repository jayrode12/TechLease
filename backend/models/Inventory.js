const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['available', 'rented', 'maintenance'], default: 'available' },
  location: { type: String },
  purchaseDate: { type: Date },
  price: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
