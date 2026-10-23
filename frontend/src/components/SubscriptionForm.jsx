import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import { getPlans } from '../api/plans';

export default function SubscriptionForm({ open, onClose, onSave, memberId }) {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) getPlans().then(r => setPlans(r.data.results || r.data));
  }, [open]);

  const handlePlanChange = (e) => {
    const plan = plans.find(p => p.id === e.target.value);
    setSelectedPlan(e.target.value);
    if (plan) setAmount(plan.price);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await onSave({ member: memberId, plan: selectedPlan, start_date: startDate, amount_paid: amount });
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { background: '#111827' } }}>
      <DialogTitle>New Subscription</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField select label="Plan" value={selectedPlan} onChange={handlePlanChange} fullWidth size="small">
          {plans.map(p => <MenuItem key={p.id} value={p.id}>{p.name} — ₹{Number(p.price).toLocaleString('en-IN')} / {p.duration_months}mo</MenuItem>)}
        </TextField>
        <TextField label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} />
        <TextField label="Amount Paid (₹)" type="number" value={amount} onChange={e => setAmount(e.target.value)} fullWidth size="small" />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !selectedPlan}>
          {loading ? <CircularProgress size={18} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
