const Rental = require('../models/Rental');

exports.getAllRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find();
    res.status(200).json({ message: 'Rentals fetched successfully', data: rentals });
  } catch (error) {
    next(error);
  }
};

exports.createRental = async (req, res, next) => {
  try {
    const { customerName, inventoryId, rentDate, returnDate } = req.body;
    if (!customerName || !inventoryId || !rentDate || !returnDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const rental = await Rental.create({
      customerName,
      inventoryId,
      rentDate,
      returnDate,
      status: 'rented'
    });

    res.status(201).json({ message: 'Rental created successfully', data: rental });
  } catch (error) {
    next(error);
  }
};

exports.updateRental = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const rental = await Rental.findByIdAndUpdate(id, updateData, { new: true });

    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    res.status(200).json({ message: 'Rental updated successfully', data: rental });
  } catch (error) {
    next(error);
  }
};
