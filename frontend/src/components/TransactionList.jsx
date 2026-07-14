import { useState } from 'react';
import axios from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const categoryEmoji = {
  food: '🍽️',
  groceries: '🛒',
  transport: '🚌',
  education: '📚',
  clothing: '👗',
  health: '💊',
  other: '📦'
};

const categoryColor = {
  food: '#fff3e0',
  groceries: '#f1f8e9',
  transport: '#e3f2fd',
  education: '#fce4ec',
  clothing: '#f3e5f5',
  health: '#e0f2f1',
  other: '#fafafa'
};

const categories = ['food', 'groceries', 'transport', 'education', 'clothing', 'health', 'other'];

const TransactionList = ({ transactions, onDelete, onUpdate }) => {
  const { colors, isDark } = useTheme();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (t) => {
    setEditingId(t._id);
    setEditForm({
      amount: t.amount,
      category: t.category,
      date: t.date.slice(0, 10),
      note: t.note || ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      const res = await axios.put(`/transactions/${id}`, editForm);
      onUpdate(res.data);
      setEditingId(null);
    } catch (err) {
      alert('Failed to update');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/transactions/${id}`);
      onDelete(id);
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    border: `1.5px solid ${colors.border}`,
    background: colors.inputBg,
    outline: 'none',
    fontSize: '0.9rem',
    color: colors.text,
    fontFamily: 'inherit'
  };

  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: colors.subtext }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌿</div>
        <p>No expenses here yet!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {transactions.map((t) => (
        <div key={t._id} style={{
          padding: '1rem 1.25rem',
          background: isDark ? colors.card : categoryColor[t.category] || '#fafafa',
          borderRadius: '12px',
          border: `1px solid ${colors.border}`
        }}>

          {editingId === t._id ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: colors.subtext, display: 'block', marginBottom: '0.3rem' }}>Amount (₹)</label>
                  <input
                    name="amount"
                    type="number"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: colors.subtext, display: 'block', marginBottom: '0.3rem' }}>Date</label>
                  <input
                    name="date"
                    type="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.8rem', color: colors.subtext, display: 'block', marginBottom: '0.3rem' }}>Category</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  style={inputStyle}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {categoryEmoji[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', color: colors.subtext, display: 'block', marginBottom: '0.3rem' }}>Note</label>
                <input
                  name="note"
                  value={editForm.note}
                  onChange={handleEditChange}
                  placeholder="optional"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEditSave(t._id)}
                  style={{
                    padding: '0.5rem 1.2rem',
                    background: colors.accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '0.5rem 1.2rem',
                    background: 'none',
                    border: `1.5px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.subtext,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

          ) : (

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{categoryEmoji[t.category] || '📦'}</span>
                <div>
                  <strong style={{ textTransform: 'capitalize', fontSize: '0.95rem', color: colors.text }}>{t.category}</strong>
                  {t.note && <p style={{ margin: 0, fontSize: '0.82rem', color: colors.subtext }}>{t.note}</p>}
                  <p style={{ margin: 0, fontSize: '0.78rem', color: colors.subtext }}>
                    {new Date(t.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <strong style={{ color: colors.accent, fontSize: '1rem' }}>₹{t.amount}</strong>
                <button
                  onClick={() => handleEditClick(t)}
                  style={{
                    background: 'none',
                    border: `1px solid ${colors.border}`,
                    color: colors.subtext,
                    padding: '0.3rem 0.7rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  style={{
                    background: 'none',
                    border: `1px solid ${colors.border}`,
                    color: colors.accent,
                    padding: '0.3rem 0.7rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionList;