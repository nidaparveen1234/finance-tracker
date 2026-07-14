import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from '../api/axios';
import AddTransaction from '../components/AddTransaction';
import TransactionList from '../components/TransactionList';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const categories = ['all', 'food', 'groceries', 'transport', 'education', 'clothing', 'health', 'other'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t._id !== id));
  };

  const handleUpdate = (updatedTransaction) => {
    setTransactions(prev => prev.map(t =>
      t._id === updatedTransaction._id ? updatedTransaction : t
    ));
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.category === filter);

  const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ background: colors.background, minHeight: '100vh', color: colors.text }}>

      {/* Navbar */}
      <div style={{
        background: colors.navbar,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: `0 2px 8px ${colors.shadow}`,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: colors.text }}>🌿 Finance Tracker</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/summary" style={{ fontSize: '0.9rem', color: colors.accent }}>Monthly Summary</Link>
          <span style={{ fontSize: '0.9rem', color: colors.subtext }}>Hi, {user?.name} 👋</span>

          {/* Dark/light toggle button */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.4rem 0.8rem',
              background: 'none',
              border: `1.5px solid ${colors.border}`,
              borderRadius: '8px',
              color: colors.text,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '0.4rem 1rem',
              background: 'none',
              border: `1.5px solid ${colors.border}`,
              borderRadius: '8px',
              color: colors.accent,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Total card */}
        <div style={{
          background: colors.totalCard,
          color: 'white',
          padding: '1.5rem 2rem',
          borderRadius: '16px',
          marginBottom: '1.5rem',
          boxShadow: `0 4px 15px ${colors.shadow}`
        }}>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>
            {filter === 'all' ? 'Total spent' : `Total in ${filter}`}
          </p>
          <h2 style={{ margin: '0.3rem 0 0', fontSize: '2rem' }}>₹{total}</h2>
        </div>

        {/* Add expense */}
        <AddTransaction onAdd={handleAdd} />

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                border: 'none',
                fontSize: '0.85rem',
                textTransform: 'capitalize',
                background: filter === cat ? colors.filterActive : colors.filterInactive,
                color: filter === cat ? 'white' : colors.filterInactiveText,
                boxShadow: `0 1px 4px ${colors.shadow}`,
                fontWeight: filter === cat ? '600' : '400',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        {loading ? (
          <Spinner message="Fetching your expenses..." />
        ) : transactions.length === 0 ? (
          <EmptyState
            emoji="💸"
            message="No expenses yet"
            subMessage="Add your first expense above!"
          />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            emoji="🔍"
            message={`No expenses in ${filter}`}
            subMessage="Try a different category"
          />
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}

      </div>
    </div>
  );
};

export default Dashboard;