import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const { colors } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form);
      setSuccess('Registered! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.background
    }}>
      <div style={{
        background: colors.card,
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: `0 4px 20px ${colors.shadow}`,
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem' }}>🌱</div>
          <h2 style={{ marginTop: '0.5rem', color: colors.text }}>Create account</h2>
          <p style={{ color: colors.subtext, fontSize: '0.9rem', marginTop: '0.3rem' }}>Start tracking your expenses</p>
        </div>

        {error && (
          <div style={{
            background: '#fff0f0',
            color: '#c0392b',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#f0fff4',
            color: '#27ae60',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' }
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: colors.subtext }}>
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `1.5px solid ${colors.border}`,
                  background: colors.inputBg,
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: colors.text
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.85rem',
              background: colors.accent,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              marginTop: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: colors.subtext }}>
          Already have an account? <Link to="/login" style={{ color: colors.accent }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;