import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Alert,
  CircularProgress, Grid, Stepper, Step, StepLabel
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { portalRegister, setMemberToken } from '../../api/portal';

export default function PortalRegister() {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', date_of_birth: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await portalRegister(form);
      setMemberToken(data.token);
      localStorage.setItem('member_data', JSON.stringify(data.member));
      navigate('/portal/home');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.phone) setError(errData.phone[0]);
      else setError('Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1040 100%)', py: 4 }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <FitnessCenterIcon sx={{ color: '#8b5cf6', fontSize: 36 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Join Tru Fitness</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">Create your member account</Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} fullWidth required size="small" placeholder="e.g. Rahul Sharma" />

        <TextField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} fullWidth required size="small" placeholder="e.g. 9876543210" helperText="This will be your login ID" />

        <TextField label="Email Address" name="email" value={form.email} onChange={handleChange} fullWidth size="small" type="email" placeholder="optional" />

        <TextField label="Date of Birth" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} fullWidth required size="small" type="date" InputLabelProps={{ shrink: true }} helperText="Used to verify your identity when logging in" />

        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading || !form.full_name || !form.phone || !form.date_of_birth}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
          sx={{ mt: 1, bgcolor: '#8b5cf6', '&:hover': { bgcolor: '#7c3aed' } }}>
          {loading ? 'Creating Account…' : 'Create Account'}
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Already a member?{' '}
          <Link to="/portal/login" style={{ color: '#a78bfa', fontWeight: 600 }}>Sign in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
