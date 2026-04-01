import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginToast = toast.loading('Logging in...');
    try {
      const res = await api.post('/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      toast.success('Welcome back!', { id: loginToast });
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials', { id: loginToast });
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Welcome Back</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to share and discover recipes.</p>
        
        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input required type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <input required type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>Login</button>
        </form>
        
        <p style={{ color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
