import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, CircularProgress, InputAdornment } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/login/', form);
      login(data.access, data.refresh);
      navigate('/dashboard');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a0e1a 0%, #1e1b4b 100%)' }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 2.5, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <FitnessCenterIcon sx={{ color: '#3b82f6', fontSize: 40 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f1f5f9' }}>Tru Fitness</Typography>
            <Typography variant="caption" color="text.secondary">Gym Management System</Typography>
          </Box>
        </Box>
        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
        <TextField
          label="Username" fullWidth value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
        />
        <TextField
          label="Password" type="password" fullWidth value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
        />
        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
        </Button>
      </Paper>
    </Box>
  );
}
