const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary
} = require('../controllers/transactionController');

// all routes here are protected — auth middleware runs first
router.post('/', auth, addTransaction);
router.get('/', auth, getTransactions);
router.put('/:id', auth, updateTransaction);
router.delete('/:id', auth, deleteTransaction);
router.get('/summary', auth, getMonthlySummary);
router.post('/', auth, addTransaction);
router.get('/', auth, getTransactions);
router.get('/summary', auth, getMonthlySummary);  // this must be before /:id
router.put('/:id', auth, updateTransaction);
router.delete('/:id', auth, deleteTransaction);

module.exports = router;