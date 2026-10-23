import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import LoginIcon from '@mui/icons-material/Login';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StatCard from '../components/StatCard';
import { getDashboard } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Dashboard</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Welcome back, {user?.username} 👋</Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Members" value={data?.active_members ?? 0} icon={PeopleIcon} color="#10b981" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Expiring in 7 Days" value={data?.expiring_in_7_days ?? 0} icon={WarningIcon} color="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Today's Check-ins" value={data?.todays_checkins ?? 0} icon={LoginIcon} color="#3b82f6" />
        </Grid>
        {user?.role === 'admin' && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="This Month's Income" value={`₹${Number(data?.this_month_income ?? 0).toLocaleString('en-IN')}`} icon={CurrencyRupeeIcon} color="#8b5cf6" />
          </Grid>
        )}
      </Grid>

      {data?.expiring_members?.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>⚠️ Expiring Soon</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Days Left</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.expiring_members.map(m => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.plan}</TableCell>
                  <TableCell>{new Date(m.end_date).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <Chip label={`${m.days_left}d`} size="small" color={m.days_left <= 3 ? 'error' : 'warning'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
