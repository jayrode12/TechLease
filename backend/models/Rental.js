const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  inventoryId: { type: String, required: true },
  rentDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  status: { type: String, enum: ['rented', 'returned'], default: 'rented' }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);
