// customerControllers.js

const Customer = require('../models/Customer.js'); // Adjust path as needed
const mongoose = require('mongoose');

// GET all customers
exports.getCustomer = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single customer by ID
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid customer ID" });
  }
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE a new customer
exports.addCustomer = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      address,
      city,
      state,
      zipCode,
      status,
      notes
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !company ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !status ||
      !notes
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all the required fields" });
    }

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      company,
      address,
      city,
      state,
      zipCode,
      status,
      notes
    };
    
    const item = new Customer(payload); 
    await item.save();

    res.status(201).json({ message: "Customer item created", data: item });
  } catch (error) {
    next(error);
  }
};
// UPDATE a customer by ID
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid customer ID" });
  }
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true, // return modified doc
      runValidators: true // validate before update
    });
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a customer by ID
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid customer ID" });
  }
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted", customer: deletedCustomer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};