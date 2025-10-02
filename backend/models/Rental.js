const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  customer : {  type : String, required : true, },
  computer : { type:String, required:true,},
  startdate : { type:String, required:true,},
  enddate : { type:String, required:true, },
  dailyrate : {  type:String, required:true,},
  deposit : { type:String, required:true,},
  totalcost : { type:String, required:true,},
  status : { type:String, required:true,  },
  paymentstatus : { type:String, required:true, }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);
