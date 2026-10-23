import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Grid, Chip, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { getMember } from '../api/members';
import { getSubscriptions, createSubscription } from '../api/subscriptions';
import { getPayments, createPayment } from '../api/payments';
import { getAttendance } from '../api/attendance';
import SubscriptionForm from '../components/SubscriptionForm';
import PaymentForm from '../components/PaymentForm';

function TabPanel({ value, index, children }) {
  return value === index ? <Box sx={{ mt: 2 }}>{children}</Box> : null;
}

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [subs, setSubs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [tab, setTab] = useState(0);
  const [subForm, setSubForm] = useState(false);
  const [payForm, setPayForm] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    getMember(id).then(r => setMember(r.data));
    getSubscriptions({ member: id }).then(r => setSubs(r.data.results || r.data));
    getPayments({ member: id }).then(r => setPayments(r.data.results || r.data));
    getAttendance({ member: id }).then(r => setAttendance(r.data.results || r.data));
  }, [id]);

  if (!member) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  const handleSubSave = async (data) => {
    try {
      await createSubscription(data); setSubForm(false);
      getSubscriptions({ member: id }).then(r => setSubs(r.data.results || r.data));
      setSnack({ open: true, msg: 'Subscription created!', severity: 'success' });
    } catch { setSnack({ open: true, msg: 'Error creating subscription', severity: 'error' }); }
  };

  const handlePaySave = async (data) => {
    try {
      await createPayment(data); setPayForm(false);
      getPayments({ member: id }).then(r => setPayments(r.data.results || r.data));
      setSnack({ open: true, msg: 'Payment recorded!', severity: 'success' });
    } catch { setSnack({ open: true, msg: 'Error recording payment', severity: 'error' }); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/members')} sx={{ mb: 2 }}>Back to Members</Button>

      <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{member.full_name}</Typography>
          <Typography color="text.secondary">{member.phone} {member.email ? `· ${member.email}` : ''}</Typography>
        </Box>
        <Chip label={member.is_active ? 'Active' : 'Inactive'} color={member.is_active ? 'success' : 'default'} />
      </Paper>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 1 }}>
        <Tab label="Profile" />
        <Tab label={`Subscriptions (${subs.length})`} />
        <Tab label={`Payments (${payments.length})`} />
        <Tab label={`Attendance (${attendance.length})`} />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {[['Full Name', member.full_name], ['Phone', member.phone], ['Email', member.email || '—'], ['Date of Birth', member.date_of_birth || '—'], ['Joined', member.joined_date || '—'], ['Status', member.is_active ? 'Active' : 'Inactive']].map(([label, value]) => (
              <Grid item xs={12} sm={6} key={label}>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography sx={{ fontWeight: 500 }}>{value}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setSubForm(true)}>New Subscription</Button>
        </Box>
        <Paper>
          <Table size="small">
            <TableHead><TableRow><TableCell>Plan</TableCell><TableCell>Start</TableCell><TableCell>End</TableCell><TableCell>Amount</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
            <TableBody>
              {subs.length === 0 ? <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: '#94a3b8' }}>No subscriptions</TableCell></TableRow>
                : subs.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.plan_name}</TableCell>
                    <TableCell>{new Date(s.start_date).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>{new Date(s.end_date).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>₹{Number(s.amount_paid).toLocaleString('en-IN')}</TableCell>
                    <TableCell><Chip size="small" label={s.end_date >= today ? 'Active' : 'Expired'} color={s.end_date >= today ? 'success' : 'error'} /></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setPayForm(true)}>Record Payment</Button>
        </Box>
        <Paper>
          <Table size="small">
            <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Amount</TableCell><TableCell>Method</TableCell><TableCell>Plan</TableCell></TableRow></TableHead>
            <TableBody>
              {payments.length === 0 ? <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: '#94a3b8' }}>No payments</TableCell></TableRow>
                : payments.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.date).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>₹{Number(p.amount).toLocaleString('en-IN')}</TableCell>
                    <TableCell><Chip size="small" label={p.method.toUpperCase()} /></TableCell>
                    <TableCell>{p.subscription_plan || '—'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      </TabPanel>

      <TabPanel value={tab} index={3}>
        <Paper>
          <Table size="small">
            <TableHead><TableRow><TableCell>Check-in Time</TableCell></TableRow></TableHead>
            <TableBody>
              {attendance.length === 0 ? <TableRow><TableCell align="center" sx={{ py: 3, color: '#94a3b8' }}>No attendance records</TableCell></TableRow>
                : attendance.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>{new Date(a.check_in_time).toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      </TabPanel>

      <SubscriptionForm open={subForm} onClose={() => setSubForm(false)} onSave={handleSubSave} memberId={parseInt(id)} />
      <PaymentForm open={payForm} onClose={() => setPayForm(false)} onSave={handlePaySave} memberId={parseInt(id)} />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
