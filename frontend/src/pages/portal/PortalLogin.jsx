import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Alert,
  CircularProgress, InputAdornment, Divider, Grid
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import { portalLogin, setMemberToken } from '../../api/portal';

export default function PortalLogin() {
  const [form, setForm] = useState({ phone: '', date_of_birth: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await portalLogin(form);
      setMemberToken(data.token);
      localStorage.setItem('member_data', JSON.stringify(data.member));
      navigate('/portal/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid phone number or date of birth');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1040 100%)' }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 2.5, alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <FitnessCenterIcon sx={{ color: '#8b5cf6', fontSize: 44, mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Member Portal</Typography>
          <Typography variant="body2" color="text.secondary">Tru Fitness</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

        <TextField
          label="Phone Number" fullWidth required value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          placeholder="e.g. 9876543210"
          InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
        />
        <TextField
          label="Date of Birth" type="date" fullWidth required value={form.date_of_birth}
          onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
          InputLabelProps={{ shrink: true }}
          InputProps={{ startAdornment: <InputAdornment position="start"><CakeIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
        />

        <Button type="submit" variant="contained" fullWidth size="large"
          disabled={loading} sx={{ bgcolor: '#8b5cf6', '&:hover': { bgcolor: '#7c3aed' } }}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
        </Button>

        <Divider sx={{ width: '100%' }}><Typography variant="caption" color="text.secondary">New here?</Typography></Divider>

        <Button component={Link} to="/portal/register" variant="outlined" fullWidth
          sx={{ borderColor: '#8b5cf6', color: '#a78bfa', '&:hover': { borderColor: '#7c3aed', bgcolor: '#8b5cf610' } }}>
          Register as New Member
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Staff? <Link to="/login" style={{ color: '#60a5fa' }}>Login here</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
