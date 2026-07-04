const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Add a transaction
const addTransaction = async (req, res) => {
  const { amount, category, date, note } = req.body;

  // Algorithm:
  // 1. Take data from request body
  // 2. Attach the logged-in user's id (from token via middleware)
  // 3. Save to database
  // 4. Return the saved transaction

  try {
    const transaction = new Transaction({
      user: req.user.id,   // comes from auth middleware
      amount,
      category,
      date,
      note
    });

    await transaction.save();
    res.status(201).json(transaction);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all transactions (with optional category filter)
const getTransactions = async (req, res) => {
  const { category, month, year } = req.query;

  // Algorithm:
  // 1. Always filter by logged-in user first
  // 2. If category is sent → also filter by category
  // 3. If month+year is sent → filter by that month
  // 4. Return the matching transactions

  try {
    let filter = { user: req.user.id };

    if (category) {
      filter.category = category;
    }

    if (month && year) {
      const start = new Date(year, month - 1, 1);    // first day of month
      const end = new Date(year, month, 1);           // first day of next month
      filter.date = { $gte: start, $lt: end };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a transaction
const updateTransaction = async (req, res) => {
  // Algorithm:
  // 1. Find the transaction by id
  // 2. Check it belongs to the logged-in user (security!)
  // 3. Update it
  // 4. Return updated transaction

  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }   // returns the updated version, not the old one
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  // Algorithm:
  // 1. Find transaction by id
  // 2. Check ownership
  // 3. Delete it

  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Monthly summary — total per category
const getMonthlySummary = async (req, res) => {
  const { month, year } = req.query;

  // Algorithm:
  // 1. Filter by user + month + year
  // 2. Group all transactions by category
  // 3. Sum the amounts in each group
  // 4. Return: [ { category: 'food', total: 500 }, { category: 'clothing', total: 2000 } ]

  try {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

   const summary = await Transaction.aggregate([
  {
    $match: {
      user: new mongoose.Types.ObjectId(req.user.id),
      date: { $gte: start, $lt: end }
    }
  },
      {
        $group: {
          _id: '$category',       // group by category
          total: { $sum: '$amount' }  // sum all amounts in that group
        }
      },
      {
        $project: {
          category: '$_id',       // rename _id to category
          total: 1,
          _id: 0
        }
      }
    ]);

    // Also calculate grand total
    const grandTotal = summary.reduce((sum, item) => sum + item.total, 0);

    res.json({ summary, grandTotal });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary
};