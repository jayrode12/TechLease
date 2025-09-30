const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
 
  brand:{
    type:String,
    required:true,
  },
  model:{
    type:String,
    required:true,
  },
  processor:{
    type:String,
    required:true,
  },
  ram:{
    type:String,
    required:true,
  },
  storage:{
    type:String,
    required:true,
  },
  graphics:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:true,
  },
    status:{
    type:String,
    required:true,
  },
  dailyRate:{
    type:String,
    required:true,
  },
  weeklyRate:{
    type:String,
    required:true,
  },
  monthlyRate:{
    type:String,
    required:true,
  },
  serialNumber:{
    type:String,
    required:true,
  },
  purchaseDate:{
    type:String,
    required:true,
  },
  notes:{
    type:String,
    required:true,
  },

}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
