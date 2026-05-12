const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

const getCategories = async (req, res) => {
    try {
        let categories = await Category.find({ user: req.user._id });

        if (categories.length === 0) {
            const defaultCategories = [
                { user: req.user._id, name: 'Salary', type: 'Income' },
                { user: req.user._id, name: 'Freelance', type: 'Income' },
                { user: req.user._id, name: 'Food & Dining', type: 'Expense' },
                { user: req.user._id, name: 'Rent & Utilities', type: 'Expense' },
                { user: req.user._id, name: 'Transportation', type: 'Expense' },
                { user: req.user._id, name: 'Entertainment', type: 'Expense' },
                { user: req.user._id, name: 'Shopping', type: 'Expense' },
                { user: req.user._id, name: 'Health', type: 'Expense' }
            ];
            categories = await Category.insertMany(defaultCategories);
        }

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addCategory = async (req, res) => {
    const { name, type } = req.body;

    try {
        const category = new Category({
            user: req.user._id,
            name,
            type,
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            if (category.user.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }
            
            const categoryName = category.name;
            await category.deleteOne();
            
            // Cascade delete: remove all budgets and transactions with this category name
            await Budget.deleteMany({ user: req.user._id, category: categoryName });
            await Transaction.deleteMany({ user: req.user._id, category: categoryName });
            
            res.json({ message: 'Category and associated data removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateCategory = async (req, res) => {
    const { name, type } = req.body;

    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            if (category.user.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }

            const oldName = category.name;
            const oldType = category.type;
            
            category.name = name || category.name;
            category.type = type || category.type;

            const updatedCategory = await category.save();
            
            // Cascade update: update all budgets and transactions with the old category name
            if (oldName !== updatedCategory.name || oldType !== updatedCategory.type) {
                if (oldName !== updatedCategory.name) {
                    await Budget.updateMany(
                        { user: req.user._id, category: oldName },
                        { $set: { category: updatedCategory.name } }
                    );
                }
                
                const transactionUpdate = {};
                if (oldName !== updatedCategory.name) transactionUpdate.category = updatedCategory.name;
                if (oldType !== updatedCategory.type) transactionUpdate.type = updatedCategory.type;
                
                await Transaction.updateMany(
                    { user: req.user._id, category: oldName },
                    { $set: transactionUpdate }
                );
            }

            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getCategories, addCategory, deleteCategory, updateCategory };
