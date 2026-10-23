import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Alert,
  CircularProgress, InputAdornment, Tabs, Tab
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { portalLogin, setMemberToken } from '../api/portal';

// ─── Member Login ─────────────────────────────────────────────────────────────
function MemberLogin() {
  const [form, setForm] = useState({ phone: '', full_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await portalLogin(form);
      setMemberToken(data.token);
      localStorage.setItem('member_data', JSON.stringify(data.member));
      navigate('/portal/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Name or phone number not found.');
    } finally { setLoading(false); }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ textAlign: 'center', py: 1 }}>
        <FingerprintIcon sx={{ fontSize: 52, color: '#ef4444', mb: 0.5, filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.5))' }} />
        <Typography variant="body2" color="text.secondary">Enter your details to check in</Typography>
      </Box>

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      <TextField
        label="Full Name" value={form.full_name}
        onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
        fullWidth required size="small" placeholder="e.g. Rahul Sharma"
        InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#a89090', fontSize: 18 }} /></InputAdornment> }}
      />
      <TextField
        label="Phone Number" value={form.phone}
        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        fullWidth required size="small" placeholder="e.g. 9876543210"
        InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#a89090', fontSize: 18 }} /></InputAdornment> }}
      />

      <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FingerprintIcon />}
        sx={{ mt: 1, py: 1.4, fontSize: 15, fontWeight: 700 }}>
        {loading ? 'Verifying…' : 'Check In'}
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
        Not registered? Ask the gym staff to add you.
      </Typography>
    </Box>
  );
}

// ─── Staff / Admin Login ──────────────────────────────────────────────────────
function StaffLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/login/', form);
      login(data.access, data.refresh);
      navigate('/dashboard');
    } catch {
      setError('Invalid username or password');
    } finally { setLoading(false); }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
      <TextField
        label="Username" value={form.username}
        onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
        fullWidth required size="small"
        InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#a89090', fontSize: 18 }} /></InputAdornment> }}
      />
      <TextField
        label="Password" type="password" value={form.password}
        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        fullWidth required size="small"
        InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#a89090', fontSize: 18 }} /></InputAdornment> }}
      />
      <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
        sx={{ mt: 1, py: 1.4, fontSize: 15, fontWeight: 700 }}>
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
      </Button>
    </Box>
  );
}

// ─── Main Landing ─────────────────────────────────────────────────────────────
export default function Landing() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #2d0000 0%, #0a0000 50%, #000000 100%)',
      p: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>

        {/* Branding */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 72, height: 72, borderRadius: '50%', mb: 2,
            background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 70%)',
            border: '2px solid rgba(239,68,68,0.4)',
            boxShadow: '0 0 30px rgba(239,68,68,0.25)',
          }}>
            <FitnessCenterIcon sx={{ color: '#ef4444', fontSize: 36 }} />
          </Box>
          <Typography sx={{
            fontWeight: 900, fontSize: 34, letterSpacing: 3,
            color: '#ef4444',
            textShadow: '0 0 20px rgba(239,68,68,0.5), 0 0 40px rgba(239,68,68,0.2)',
            textTransform: 'uppercase', lineHeight: 1,
          }}>
            TRU FITNESS
          </Typography>
          <Typography variant="caption" sx={{ color: '#a89090', letterSpacing: 2, textTransform: 'uppercase', fontSize: 10 }}>
            Gym Management System
          </Typography>
        </Box>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 0 40px rgba(239,68,68,0.1)' }}>
          <Tabs
            value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth"
            sx={{
              borderBottom: '1px solid rgba(239,68,68,0.1)',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: 14, minHeight: 52, gap: 0.5, color: '#a89090' },
              '& .Mui-selected': { color: '#ef4444 !important' },
              '& .MuiTabs-indicator': { bgcolor: '#ef4444', height: 3, borderRadius: 2 },
            }}
          >
            <Tab label="Member" icon={<FingerprintIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
            <Tab label="Staff / Admin" icon={<AdminPanelSettingsIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
          </Tabs>

          <Box sx={{ p: 3.5 }}>
            {tab === 0 && <MemberLogin />}
            {tab === 1 && <StaffLogin />}
          </Box>
        </Paper>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2.5, color: '#5a3a3a', letterSpacing: 0.5 }}>
          © 2024 Tru Fitness · All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}
