import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

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

const Summary = () => {
  const { colors, isDark } = useTheme();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/transactions/summary?month=${month}&year=${year}`);
      setSummary(res.data.summary);
      setGrandTotal(res.data.grandTotal);
      setFetched(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: `1.5px solid ${colors.border}`,
    background: colors.inputBg,
    outline: 'none',
    fontSize: '0.95rem',
    color: colors.text,
    fontFamily: 'inherit'
  };

  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  return (
    <div style={{ background: colors.background, minHeight: '100vh' }}>

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
        <Link to="/dashboard" style={{ fontSize: '0.9rem', color: colors.accent }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem' }}>

        <h2 style={{ marginBottom: '1.5rem', color: colors.text }}>Monthly Summary</h2>

        {/* Picker card */}
        <div style={{
          background: colors.card,
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: `0 4px 20px ${colors.shadow}`,
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: colors.subtext, fontWeight: '500' }}>
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={inputStyle}
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: colors.subtext, fontWeight: '500' }}>
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                style={{ ...inputStyle, width: '90px' }}
              />
            </div>

            <button
              onClick={fetchSummary}
              style={{
                padding: '0.75rem 1.5rem',
                background: colors.accent,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Get Summary
            </button>
          </div>
        </div>

        {loading && <Spinner message="Calculating your summary..." />}

        {fetched && !loading && (
          <>
            {summary.length === 0 ? (
              <EmptyState
                emoji="📭"
                message="No expenses found"
                subMessage={`Nothing recorded for this month in ${year}`}
              />
            ) : (
              <>
                {/* Grand total card */}
                <div style={{
                  background: colors.accent,
                  color: 'white',
                  padding: '1.5rem 2rem',
                  borderRadius: '16px',
                  marginBottom: '1.5rem',
                  boxShadow: `0 4px 15px ${colors.shadow}`
                }}>
                  <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>
                    Total spent in {monthNames[month - 1]} {year}
                  </p>
                  <h2 style={{ margin: '0.3rem 0 0', fontSize: '2rem' }}>₹{grandTotal}</h2>
                </div>

                {/* Category cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {summary.map((item) => (
                    <div key={item.category} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem 1.25rem',
                      background: isDark ? colors.card : categoryColor[item.category] || '#fafafa',
                      borderRadius: '12px',
                      border: `1px solid ${colors.border}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{categoryEmoji[item.category] || '📦'}</span>
                        <strong style={{ textTransform: 'capitalize', color: colors.text }}>{item.category}</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: colors.accent, fontSize: '1rem' }}>₹{item.total}</strong>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: colors.subtext }}>
                          {((item.total / grandTotal) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bar chart */}
                <div style={{
                  background: colors.card,
                  padding: '1.5rem',
                  borderRadius: '16px',
                  boxShadow: `0 4px 20px ${colors.shadow}`
                }}>
                  <h3 style={{ marginBottom: '1rem', color: colors.text }}>Spending by category</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={summary} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12, fill: colors.subtext }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: colors.subtext }} />
                      <Tooltip
                        formatter={(value) => [`₹${value}`, 'Amount']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: `1px solid ${colors.border}`,
                          background: colors.inputBg
                        }}
                      />
                      <Bar dataKey="total" fill={colors.accent} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Summary;