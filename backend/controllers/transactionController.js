const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addTransaction = async (req, res) => {
    const { title, amount, category, type, date, note } = req.body;

    try {
        const transaction = new Transaction({
            user: req.user._id,
            title,
            amount,
            category,
            type,
            date,
            note,
        });

        const createdTransaction = await transaction.save();
        res.status(201).json(createdTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (transaction) {
            if (transaction.user.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }
            await transaction.deleteOne();
            res.json({ message: 'Transaction removed' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateTransaction = async (req, res) => {
    const { title, amount, category, type, date, note } = req.body;

    try {
        const transaction = await Transaction.findById(req.params.id);

        if (transaction) {
            if (transaction.user.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }

            transaction.title = title || transaction.title;
            transaction.amount = amount || transaction.amount;
            transaction.category = category || transaction.category;
            transaction.type = type || transaction.type;
            transaction.date = date || transaction.date;
            transaction.note = note || transaction.note;

            const updatedTransaction = await transaction.save();
            res.json(updatedTransaction);
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getTransactions, addTransaction, deleteTransaction, updateTransaction };
