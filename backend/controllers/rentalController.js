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
    const {
      customer,
      computer,
      startdate,
      enddate,
      dailyrate,
      deposit,
      totalcost,
      status,
      paymentstatus,
    } = req.body;

    if (
      !customer ||
      !computer ||
      !startdate ||
      !enddate ||
      !dailyrate ||
      !deposit ||
      !totalcost ||
      !status ||
      !paymentstatus
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all the required fields" });
    }

    const payload = {
      customer,
      computer,
      startdate,
      enddate,
      dailyrate,
      deposit,
      totalcost,
      status,
      paymentstatus,
    };
    
    const item = new Rental(payload); 
    await item.save();

    res.status(201).json({ message: "Item created", data: item });
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
