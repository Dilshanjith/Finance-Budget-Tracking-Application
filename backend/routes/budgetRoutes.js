const express = require('express');
const router = express.Router();
const {
    getBudgets,
    createBudget,
    updateBudget,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getBudgets).post(protect, createBudget);
router.route('/:id').put(protect, updateBudget);

module.exports = router;
