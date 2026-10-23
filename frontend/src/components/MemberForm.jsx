import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, CircularProgress, Alert,
  MenuItem, InputAdornment, Typography, Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import { getPlans } from '../api/plans';

export default function MemberForm({ open, onClose, onSave, member }) {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', date_of_birth: '', plan_id: '' });
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const selectedPlan = plans.find(p => p.id === form.plan_id);

  useEffect(() => {
    if (open) {
      setForm({
        full_name: member?.full_name || '',
        phone: member?.phone || '',
        email: member?.email || '',
        date_of_birth: member?.date_of_birth || '',
        plan_id: '',
      });
      setError('');
      getPlans().then(r => setPlans(r.data.results || r.data));
    }
  }, [open, member]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await onSave(form);
    } catch (err) {
      const data = err?.response?.data;
      if (data) {
        const messages = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(' | ');
        setError(messages);
      } else {
        setError('Failed to save member. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { background: '#111827' } }}>
      <DialogTitle sx={{ pb: 1 }}>{member ? 'Edit Member' : 'Add New Member'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
            </Grid>
          )}

          {/* Name */}
          <Grid item xs={12}>
            <TextField
              label="Full Name" name="full_name" value={form.full_name}
              onChange={handleChange} fullWidth required size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment> }}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number" name="phone" value={form.phone}
              onChange={handleChange} fullWidth required size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment> }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email (optional)" name="email" value={form.email}
              onChange={handleChange} fullWidth size="small" type="email"
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment> }}
            />
          </Grid>

          {/* DOB */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth (optional)" name="date_of_birth" value={form.date_of_birth}
              onChange={handleChange} fullWidth size="small"
              type="date" InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Plan */}
          <Grid item xs={12} sm={6}>
            <TextField
              select label="Gym Plan" name="plan_id" value={form.plan_id}
              onChange={handleChange} fullWidth size="small"
              helperText={!member ? "Required for new member" : "Leave blank to keep existing"}
              InputProps={{ startAdornment: <InputAdornment position="start"><CardMembershipIcon sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment> }}
            >
              {!member && <MenuItem value=""><em>— Select a plan —</em></MenuItem>}
              {member && <MenuItem value=""><em>— No change —</em></MenuItem>}
              {plans.map(p => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} &nbsp;·&nbsp; ₹{Number(p.price).toLocaleString('en-IN')} / {p.duration_months}mo
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Plan summary */}
          {selectedPlan && (
            <Grid item xs={12}>
              <Chip
                icon={<CardMembershipIcon />}
                label={`${selectedPlan.name} — ₹${Number(selectedPlan.price).toLocaleString('en-IN')} for ${selectedPlan.duration_months} month${selectedPlan.duration_months > 1 ? 's' : ''}`}
                color="primary" variant="outlined" size="small"
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained" onClick={handleSubmit}
          disabled={loading || !form.full_name || !form.phone || (!member && !form.plan_id)}
        >
          {loading ? <CircularProgress size={18} /> : member ? 'Update' : 'Add Member'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
