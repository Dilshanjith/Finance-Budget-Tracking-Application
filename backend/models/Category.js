const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['Income', 'Expense'],
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
