import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Chip, TextField, MenuItem, Select, InputLabel, FormControl, Grid, Snackbar, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getPayments, createPayment } from '../api/payments';
import PaymentForm from '../components/PaymentForm';

const METHOD_COLORS = { cash: 'success', upi: 'info', card: 'secondary' };

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [method, setMethod] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const load = useCallback(() => {
    setLoading(true);
    getPayments({ date_from: dateFrom, date_to: dateTo, method: method || undefined, search, page: page + 1 })
      .then(r => { setPayments(r.data.results || r.data); setCount(r.data.count || (r.data.results || r.data).length); })
      .finally(() => setLoading(false));
  }, [dateFrom, dateTo, method, search, page]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      await createPayment(data); setFormOpen(false);
      setSnack({ open: true, msg: 'Payment recorded!', severity: 'success' }); load();
    } catch { setSnack({ open: true, msg: 'Error recording payment', severity: 'error' }); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Payments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>Record Payment</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}><TextField label="From Date" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} /></Grid>
        <Grid item xs={6} sm={3}><TextField label="To Date" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} /></Grid>
        <Grid item xs={6} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Method</InputLabel>
            <Select value={method} label="Method" onChange={e => setMethod(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="card">Card</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3}><TextField label="Search member" value={search} onChange={e => setSearch(e.target.value)} fullWidth size="small" /></Grid>
      </Grid>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell><TableCell>Member</TableCell><TableCell>Amount</TableCell><TableCell>Method</TableCell><TableCell>Plan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><CircularProgress size={28} /></TableCell></TableRow>
              : payments.length === 0 ? <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: '#94a3b8' }}>No payments found</TableCell></TableRow>
              : payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{new Date(p.date).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>{p.member_name}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₹{Number(p.amount).toLocaleString('en-IN')}</TableCell>
                  <TableCell><Chip size="small" label={p.method.toUpperCase()} color={METHOD_COLORS[p.method] || 'default'} /></TableCell>
                  <TableCell>{p.subscription_plan || '—'}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination component="div" count={count} page={page} rowsPerPage={10} onPageChange={(_, p) => setPage(p)} rowsPerPageOptions={[10]} />
      </Paper>

      <PaymentForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} memberId={null} />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
