import { useState } from 'react';
import axios from '../api/axios';
// take add from front to back
const categories = ['food', 'groceries', 'transport', 'education', 'clothing', 'health', 'other'];

const categoryEmoji = {
  food: '🍽️',
  groceries: '🛒',
  transport: '🚌',
  education: '📚',
  clothing: '👗',
  health: '💊',
  other: '📦'
};

const AddTransaction = ({ onAdd }) => {
  const [form, setForm] = useState({
    amount: '',
    category: 'food',
    date: '',
    note: ''
  });
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/transactions', form);
      onAdd(res.data);
      setForm({ amount: '', category: 'food', date: '', note: '' });
      setError('');
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1.5px solid #e8d5c4',
    background: '#fffaf7',
    outline: 'none',
    fontSize: '0.95rem',
    color: '#3d2c2c'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.4rem',
    fontSize: '0.85rem',
    color: '#7a5c52',
    fontWeight: '500'
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>

      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: '100%',
            padding: '0.85rem',
            background: '#c17c5a',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          + Add Expense
        </button>
      )}

      {/* Form */}
      {open && (
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(193,124,90,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ margin: 0 }}>Add Expense</h3>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#9e7b6b', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {error && (
            <div style={{ background: '#fff0f0', color: '#c0392b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Amount (₹)</label>
                <input
                  name="amount"
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Date</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={inputStyle}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {categoryEmoji[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Note (optional)</label>
              <input
                name="note"
                placeholder="e.g. lunch at canteen"
                value={form.note}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem',
                background: '#c17c5a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Save Expense
            </button>

          </form>
        </div>
      )}
    </div>
  );
};

export default AddTransaction;