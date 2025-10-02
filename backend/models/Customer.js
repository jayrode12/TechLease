const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true, 
    trim: true,
  },
  company: {
    type: String,
    required: false, 
    trim: true,
  },
  address: {
    type: String,
    required: false,
    trim: true,
  },
  city: {
    type: String,
    required: false,
    trim: true,
  },
  state: {
    type: String,
    required: false,
    trim: true,
  },
  zipCode: {
    type: String,
    required: false,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Inactive', 'Lead'],
    default: 'Active',
  },
  notes: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
  updatedAt: {
    type: String,
    default: Date.now,
  },
});

// Update the updatedAt field on save
customerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model from the schema
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;