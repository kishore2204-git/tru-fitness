import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, RadioGroup, FormControlLabel, Radio, FormLabel, CircularProgress } from '@mui/material';

export default function PaymentForm({ open, onClose, onSave, memberId }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onSave({ member: memberId, amount, method });
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { background: '#111827' } }}>
      <DialogTitle>Record Payment</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="Amount (₹)" type="number" value={amount} onChange={e => setAmount(e.target.value)} fullWidth size="small" />
        <FormLabel>Method</FormLabel>
        <RadioGroup row value={method} onChange={e => setMethod(e.target.value)}>
          <FormControlLabel value="cash" control={<Radio size="small" />} label="Cash" />
          <FormControlLabel value="upi" control={<Radio size="small" />} label="UPI" />
          <FormControlLabel value="card" control={<Radio size="small" />} label="Card" />
        </RadioGroup>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !amount}>
          {loading ? <CircularProgress size={18} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
