import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Chip, Snackbar, Alert, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, InputAdornment } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SearchIcon from '@mui/icons-material/Search';
import { getMembers } from '../api/members';
import { checkIn, getAttendance } from '../api/attendance';

export default function CheckIn() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [todayLogs, setTodayLogs] = useState([]);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const today = new Date().toISOString().split('T')[0];

  const loadToday = useCallback(() => {
    getAttendance({ date: today }).then(r => setTodayLogs(r.data.results || r.data));
  }, [today]);

  useEffect(() => { loadToday(); }, [loadToday]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(() => {
      getMembers({ search: query }).then(r => setResults(r.data.results || r.data));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleCheckIn = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const { data } = await checkIn({ member_id: selected.id });
      if (data.warning) setSnack({ open: true, msg: `⚠️ ${data.warning}`, severity: 'warning' });
      else setSnack({ open: true, msg: `✅ ${data.member} checked in!`, severity: 'success' });
      setSelected(null); setQuery(''); setResults([]);
      loadToday();
    } catch { setSnack({ open: true, msg: 'Check-in failed', severity: 'error' }); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <HowToRegIcon sx={{ fontSize: 56, color: '#3b82f6', mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Quick Check-In</Typography>
        <Typography color="text.secondary">Search member by name or phone number</Typography>
      </Box>

      <TextField fullWidth placeholder="Type name or phone…" value={query} onChange={e => { setQuery(e.target.value); setSelected(null); }}
        sx={{ mb: 2 }} size="medium"
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }} />

      {results.length > 0 && !selected && (
        <Paper sx={{ mb: 2 }}>
          <List dense>
            {results.map(m => (
              <ListItem key={m.id} button onClick={() => setSelected(m)} sx={{ '&:hover': { background: 'rgba(59,130,246,0.1)' } }}>
                <ListItemText primary={m.full_name} secondary={m.phone} />
                <ListItemSecondaryAction>
                  <Chip size="small" label={m.is_active ? 'Active' : 'Inactive'} color={m.is_active ? 'success' : 'default'} />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {selected && (
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center', border: '2px solid rgba(59,130,246,0.3)' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{selected.full_name}</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>{selected.phone}</Typography>
          <Button variant="contained" size="large" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <HowToRegIcon />}
            onClick={handleCheckIn} disabled={loading} sx={{ px: 4, py: 1.5, fontSize: 16 }}>
            Check In
          </Button>
        </Paper>
      )}

      <Typography variant="h6" sx={{ mb: 1 }}>Today's Check-ins ({todayLogs.length})</Typography>
      <Paper>
        <Table size="small">
          <TableHead><TableRow><TableCell>Member</TableCell><TableCell>Time</TableCell></TableRow></TableHead>
          <TableBody>
            {todayLogs.length === 0
              ? <TableRow><TableCell colSpan={2} align="center" sx={{ py: 3, color: '#94a3b8' }}>No check-ins today</TableCell></TableRow>
              : todayLogs.map(a => (
                <TableRow key={a.id}>
                  <TableCell>{a.member_name}</TableCell>
                  <TableCell>{new Date(a.check_in_time).toLocaleTimeString('en-IN')}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
