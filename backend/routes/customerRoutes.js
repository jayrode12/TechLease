const express = require('express');
const router = express.Router();
const { getCustomer, getCustomerById, addCustomer } = require('../controllers/customerController'); 
router.get('/', getCustomer); // <-- Corrected: Use getAllCustomer instead of customerController.getAllCustomer
router.post('/', addCustomer);   // <-- Corrected: Use addCustomer instead of customerController.addCustomer
module.exports = router;