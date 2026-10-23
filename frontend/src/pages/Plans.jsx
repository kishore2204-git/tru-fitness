import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { getPlans, createPlan, updatePlan } from '../api/plans';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [form, setForm] = useState({ name: '', duration_months: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const load = () => getPlans().then(r => setPlans(r.data.results || r.data));
  useEffect(() => { load(); }, []);

  const openForm = (plan = null) => {
    setEditPlan(plan);
    setForm(plan ? { name: plan.name, duration_months: plan.duration_months, price: plan.price } : { name: '', duration_months: '', price: '' });
    setOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editPlan) await updatePlan(editPlan.id, form);
      else await createPlan(form);
      setOpen(false); load();
      setSnack({ open: true, msg: editPlan ? 'Plan updated!' : 'Plan created!', severity: 'success' });
    } catch { setSnack({ open: true, msg: 'Error saving plan', severity: 'error' }); }
    finally { setLoading(false); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Membership Plans</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => openForm()}>Add Plan</Button>
      </Box>

      <Grid container spacing={2}>
        {plans.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Paper sx={{ p: 3, position: 'relative', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 30px rgba(59,130,246,0.2)' }, transition: 'all 0.2s' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#3b82f6', mb: 1 }}>{p.name}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>₹{Number(p.price).toLocaleString('en-IN')}</Typography>
              <Typography color="text.secondary">{p.duration_months} Month{p.duration_months > 1 ? 's' : ''}</Typography>
              <Button size="small" startIcon={<EditIcon />} sx={{ mt: 2 }} onClick={() => openForm(p)}>Edit</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { background: '#111827' } }}>
        <DialogTitle>{editPlan ? 'Edit Plan' : 'New Plan'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Plan Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth size="small" />
          <TextField label="Duration (months)" type="number" value={form.duration_months} onChange={e => setForm(f => ({ ...f, duration_months: e.target.value }))} fullWidth size="small" />
          <TextField label="Price (₹)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} fullWidth size="small" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading || !form.name}>
            {loading ? <CircularProgress size={18} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
