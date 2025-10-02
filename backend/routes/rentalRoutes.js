const express = require('express');
const router = express.Router();
const { getAllRentals, createRental, updateRental } = require('../controllers/rentalController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllRentals);
router.post('/', createRental);
router.put('/:id', authMiddleware, updateRental);

module.exports = router;