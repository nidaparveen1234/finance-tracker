import { useState } from 'react';
import axios from '../api/axios';
// the job of this to show data on screen 
// and cannot create anything new it shows on screen
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

  // editingId → which transaction is currently being edited
  // null means nothing is being edited
  const [editingId, setEditingId] = useState(null);

  // editForm → holds the current values in the edit form
  const [editForm, setEditForm] = useState({});

  // When user clicks Edit on a card:
  // 1. Set editingId to that transaction's id
  // 2. Pre-fill editForm with that transaction's existing data
  const handleEditClick = (t) => {
    setEditingId(t._id);
    setEditForm({
      amount: t.amount,
      category: t.category,
      date: t.date.slice(0, 10),  // MongoDB date comes as full ISO string, we only need YYYY-MM-DD for the input
      note: t.note || ''
    });// put req with updated form and 
    //passes it to dashboard and goes to original mode
  };

  // When user types in the edit form
  // Same pattern as AddTransaction's handleChange
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // When user clicks Save:
  // 1. Send PUT request to backend with updated data
  // 2. Tell Dashboard the updated transaction (onUpdate)
  // 3. Close the edit form by setting editingId back to null
  const handleEditSave = async (id) => {
    try {
      const res = await axios.put(`/transactions/${id}`, editForm);
      onUpdate(res.data);       // tells Dashboard: replace the old one with this
      setEditingId(null);       // close edit mode
    } catch (err) {
      alert('Failed to update');
    }
  };

  // When user clicks Cancel — just close edit mode, no changes saved
  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Delete — same as before
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
    border: '1.5px solid #e8d5c4',
    background: '#fffaf7',
    outline: 'none',
    fontSize: '0.9rem',
    color: '#3d2c2c',
    fontFamily: 'inherit'
  };

  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#9e7b6b' }}>
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
          background: categoryColor[t.category] || '#fafafa',
          borderRadius: '12px',
          border: '1px solid #f0e0d0'
        }}>

          {/* 
            This is the key logic:
            If this transaction's id matches editingId → show edit form
            Otherwise → show normal card view
          */}
          {editingId === t._id ? (

            /* EDIT MODE — this card becomes a form */
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#7a5c52', display: 'block', marginBottom: '0.3rem' }}>Amount (₹)</label>
                  <input
                    name="amount"
                    type="number"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#7a5c52', display: 'block', marginBottom: '0.3rem' }}>Date</label>
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
                <label style={{ fontSize: '0.8rem', color: '#7a5c52', display: 'block', marginBottom: '0.3rem' }}>Category</label>
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
                <label style={{ fontSize: '0.8rem', color: '#7a5c52', display: 'block', marginBottom: '0.3rem' }}>Note</label>
                <input
                  name="note"
                  value={editForm.note}
                  onChange={handleEditChange}
                  placeholder="optional"
                  style={inputStyle}
                />
              </div>

              {/* Save and Cancel buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEditSave(t._id)}
                  style={{
                    padding: '0.5rem 1.2rem',
                    background: '#c17c5a',
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
                    border: '1.5px solid #e8d5c4',
                    borderRadius: '8px',
                    color: '#7a5c52',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

          ) : (

            /* NORMAL VIEW — regular card */
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{categoryEmoji[t.category] || '📦'}</span>
                <div>
                  <strong style={{ textTransform: 'capitalize', fontSize: '0.95rem' }}>{t.category}</strong>
                  {t.note && <p style={{ margin: 0, fontSize: '0.82rem', color: '#9e7b6b' }}>{t.note}</p>}
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#b89a8a' }}>
                    {new Date(t.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <strong style={{ color: '#c17c5a', fontSize: '1rem' }}>₹{t.amount}</strong>
                <button
                  onClick={() => handleEditClick(t)}
                  style={{
                    background: 'none',
                    border: '1px solid #e8d5c4',
                    color: '#7a5c52',
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
                    border: '1px solid #e8d5c4',
                    color: '#c17c5a',
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