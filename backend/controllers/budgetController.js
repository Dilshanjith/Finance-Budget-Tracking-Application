const Budget = require('../models/Budget');

const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createBudget = async (req, res) => {
    const { category, amount, period } = req.body;

    try {
        const budget = new Budget({
            user: req.user._id,
            category,
            amount,
            period,
        });

        const createdBudget = await budget.save();
        res.status(201).json(createdBudget);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateBudget = async (req, res) => {
    const { category, amount, period } = req.body;

    try {
        const budget = await Budget.findById(req.params.id);

        if (budget) {
            if (budget.user.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }

            budget.category = category || budget.category;
            budget.amount = amount || budget.amount;
            budget.period = period || budget.period;

            const updatedBudget = await budget.save();
            res.json(updatedBudget);
        } else {
            res.status(404).json({ message: 'Budget not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getBudgets, createBudget, updateBudget };
