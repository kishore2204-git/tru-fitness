import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Chip, IconButton, Paper, Dialog, DialogTitle, DialogActions, Snackbar, Alert, CircularProgress, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import MemberForm from '../components/MemberForm';
import { getMembers, createMember, updateMember, deleteMember } from '../api/members';
import { createSubscription } from '../api/subscriptions';
import { createPayment } from '../api/payments';
import { exportToCSV } from '../utils/csvExport';

export default function Members() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const load = useCallback(() => {
    setLoading(true);
    getMembers({ search, page: page + 1, page_size: rowsPerPage })
      .then(r => { setMembers(r.data.results || r.data); setCount(r.data.count || (r.data.results || r.data).length); })
      .finally(() => setLoading(false));
  }, [search, page, rowsPerPage]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  const handleSave = async (data) => {
    const { plan_id, ...memberData } = data;
    // Remove empty date_of_birth
    if (!memberData.date_of_birth) delete memberData.date_of_birth;
    if (!memberData.email) delete memberData.email;

    if (editMember) {
      await updateMember(editMember.id, memberData);
      // Create new subscription if plan selected
      if (plan_id) {
        await createSubscription({
          member: editMember.id, plan: plan_id,
          start_date: new Date().toISOString().split('T')[0],
          amount_paid: data._planPrice || 0,
        });
      }
    } else {
      const res = await createMember(memberData);
      const newMember = res.data;
      // Auto-create subscription + payment for the selected plan
      if (plan_id) {
        const { getPlans } = await import('../api/plans');
        const plansRes = await getPlans();
        const plan = (plansRes.data.results || plansRes.data).find(p => p.id === plan_id);
        const sub = await createSubscription({
          member: newMember.id, plan: plan_id,
          start_date: new Date().toISOString().split('T')[0],
          amount_paid: plan?.price || 0,
        });
        await createPayment({
          member: newMember.id,
          subscription: sub.data.id,
          amount: plan?.price || 0,
          method: 'cash',
        });
      }
    }
    setFormOpen(false); setEditMember(null);
    setSnack({ open: true, msg: editMember ? 'Member updated!' : 'Member added & subscribed!', severity: 'success' });
    load();
  };

  const handleDelete = async () => {
    try {
      await deleteMember(deleteId); setDeleteId(null);
      setSnack({ open: true, msg: 'Member deleted', severity: 'success' }); load();
    } catch { setSnack({ open: true, msg: 'Error deleting member', severity: 'error' }); }
  };

  const handleExport = () => exportToCSV(members, 'members', [
    { key: 'full_name', label: 'Name' }, { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' }, { key: 'is_active', label: 'Active' }, { key: 'joined_date', label: 'Joined' },
  ]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Members</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport} size="small">Export CSV</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditMember(null); setFormOpen(true); }}>Add Member</Button>
        </Box>
      </Box>

      <TextField placeholder="Search by name or phone…" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
        size="small" sx={{ mb: 2, width: 320 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }} />

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell><TableCell>Phone</TableCell><TableCell>Email</TableCell>
              <TableCell>Status</TableCell><TableCell>Joined</TableCell><TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}><CircularProgress size={28} /></TableCell></TableRow>
            ) : members.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>No members found</TableCell></TableRow>
            ) : members.map(m => (
              <TableRow key={m.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/members/${m.id}`)}>
                <TableCell sx={{ fontWeight: 600 }}>{m.full_name}</TableCell>
                <TableCell>{m.phone}</TableCell>
                <TableCell>{m.email || '—'}</TableCell>
                <TableCell>
                  <Chip label={m.is_active ? 'Active' : 'Inactive'} size="small" color={m.is_active ? 'success' : 'default'} />
                </TableCell>
                <TableCell>{m.joined_date ? new Date(m.joined_date).toLocaleDateString('en-IN') : '—'}</TableCell>
                <TableCell align="right" onClick={e => e.stopPropagation()}>
                  <IconButton size="small" onClick={() => { setEditMember(m); setFormOpen(true); }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => setDeleteId(m.id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination component="div" count={count} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, p) => setPage(p)} rowsPerPageOptions={[10]} />
      </Paper>

      <MemberForm open={formOpen} onClose={() => { setFormOpen(false); setEditMember(null); }} onSave={handleSave} member={editMember} />

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { background: '#111827' } }}>
        <DialogTitle>Delete this member?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
