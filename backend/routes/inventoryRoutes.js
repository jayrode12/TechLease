const express = require('express');
const router = express.Router();
const { getAllInventory, createInventory, updateInventory } = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllInventory);
router.post('/', createInventory);
router.put('/:id', authMiddleware, updateInventory);

module.exports = router;
