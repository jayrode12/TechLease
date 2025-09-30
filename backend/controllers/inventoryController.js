const Inventory = require("../models/Inventory");

exports.getAllInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find();
    res
      .status(200)
      .json({ message: "Inventory fetched successfully", data: inventory });
  } catch (error) {
    next(error);
  }
};

exports.createInventory = async (req, res, next) => {
  try {
    const {
      brand,
      model,
      processor,
      ram,
      storage,
      graphics,
      category,
      status,
      dailyRate,
      weeklyRate,
      monthlyRate,
      serialNumber,
      purchaseDate,
      notes,
    } = req.body;

    if (
      !brand ||
      !model ||
      !processor ||
      !ram ||
      !storage ||
      !graphics ||
      !category ||
      !status ||
      !dailyRate ||
      !weeklyRate ||
      !monthlyRate ||
      !serialNumber ||
      !purchaseDate ||
      !notes
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all the required fields" });
    }

    const payload = {
      brand,
      model,
      processor,
      ram,
      storage,
      graphics,
      category,
      status,
      dailyRate,
      weeklyRate,
      monthlyRate,
      serialNumber,
      purchaseDate,
      notes,
    };
    
    const item = new Inventory(payload); 
    await item.save();

    res.status(201).json({ message: "Inventory item created", data: item });
  } catch (error) {
    next(error);
  }
};

exports.updateInventory = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item updated", data: item });
  } catch (error) {
    next(error);
  }
};
