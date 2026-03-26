import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartPulse } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const user = await login(email, password);
      if (user.role === 'doctor') {
        navigate('/urban/dashboard');
      } else {
        navigate('/phc/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="premium-card" style={styles.card}>
        <div style={styles.header}>
          <HeartPulse size={48} color="var(--color-secondary)" />
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to access your SehatSetu dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input} 
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input} 
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={styles.button} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg-base)',
    padding: '1rem'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '2.5rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    margin: '1rem 0 0.5rem',
    color: 'var(--color-primary)'
  },
  subtitle: {
    color: 'var(--color-text-muted)',
    fontSize: '0.95rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--color-text-main)'
  },
  input: {
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid #E2E8F0',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color var(--transition-fast)'
  },
  button: {
    marginTop: '0.5rem',
    width: '100%'
  },
  error: {
    backgroundColor: '#FEF2F2',
    color: 'var(--color-danger)',
    padding: '0.75rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    textAlign: 'center',
    border: '1px solid #FCA5A5'
  }
};
