import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, CircularProgress,
  Table, TableHead, TableRow, TableCell, TableBody,
  Snackbar, Alert, LinearProgress, Avatar, Paper
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { portalMe, portalCheckIn, portalAttendance, getMemberToken, removeMemberToken } from '../../api/portal';

export default function PortalHome() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanState, setScanState] = useState('idle'); // idle | scanning | success | warning | error
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const load = useCallback(async () => {
    const token = getMemberToken();
    if (!token) { navigate('/login'); return; }
    try {
      const [meRes, attRes] = await Promise.all([portalMe(), portalAttendance()]);
      setMember(meRes.data);
      setAttendance(attRes.data);
      const today = new Date().toISOString().split('T')[0];
      setCheckedInToday(attRes.data.some(a => a.check_in_time.startsWith(today)));
    } catch (err) {
      if (err.response?.status === 401) { removeMemberToken(); navigate('/login'); }
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const handleCheckIn = async () => {
    if (scanning || checkedInToday) return;
    setScanning(true);
    setScanState('scanning');
    try {
      const { data } = await portalCheckIn();
      if (data.warning) {
        setScanState('warning');
        setSnack({ open: true, msg: `⚠️ ${data.warning}`, severity: 'warning' });
      } else {
        setScanState('success');
        setSnack({ open: true, msg: '✅ Attendance recorded!', severity: 'success' });
      }
      setCheckedInToday(true);
      load();
    } catch {
      setScanState('error');
      setSnack({ open: true, msg: 'Check-in failed. Try again.', severity: 'error' });
      setTimeout(() => setScanState('idle'), 2000);
    } finally { setScanning(false); }
  };

  const handleLogout = () => { removeMemberToken(); localStorage.removeItem('member_data'); navigate('/login'); };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0e1a' }}>
      <CircularProgress sx={{ color: '#8b5cf6' }} />
    </Box>
  );

  const sub = member?.active_subscription;
  const daysLeft = sub?.days_left ?? 0;
  const totalDays = sub ? Math.max(1, Math.round((new Date(sub.end_date) - new Date(sub.start_date)) / 86400000)) : 1;
  const progress = sub ? Math.min(100, Math.round((daysLeft / totalDays) * 100)) : 0;

  // Fingerprint button colors & states
  const fpColors = {
    idle: '#8b5cf6',
    scanning: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };
  const fpColor = checkedInToday ? '#10b981' : fpColors[scanState];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0a0e1a 0%, #1a1040 50%, #0a0e1a 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FitnessCenterIcon sx={{ color: '#ef4444', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#ef4444', letterSpacing: 1, textTransform: 'uppercase' }}>Tru Fitness</Typography>
        </Box>
        <Button size="small" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}>
          Logout
        </Button>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2, pt: 3, pb: 4, maxWidth: 480, mx: 'auto', width: '100%' }}>

        {/* Member info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, width: '100%' }}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: '#8b5cf6', fontSize: 20, fontWeight: 800 }}>
            {member?.full_name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{member?.full_name}</Typography>
            <Typography variant="body2" color="text.secondary">{member?.phone}</Typography>
          </Box>
          {sub
            ? <Chip label={sub.plan} size="small" sx={{ ml: 'auto', bgcolor: '#8b5cf620', color: '#a78bfa', fontWeight: 600 }} />
            : <Chip label="No Plan" size="small" color="error" sx={{ ml: 'auto' }} />
          }
        </Box>

        {/* Plan progress */}
        {sub ? (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Plan expires {new Date(sub.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: daysLeft <= 7 ? '#f59e0b' : '#10b981' }}>{daysLeft} days left</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress}
              sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', '& .MuiLinearProgress-bar': { bgcolor: daysLeft <= 7 ? '#f59e0b' : '#10b981', borderRadius: 3 } }} />
            {daysLeft <= 7 && <Typography variant="caption" sx={{ color: '#f59e0b', mt: 0.5, display: 'block' }}>⚠️ Membership expiring soon — contact the gym to renew!</Typography>}
          </Box>
        ) : (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>No active membership. Contact the gym counter to subscribe.</Alert>
        )}

        {/* ── Fingerprint Scanner ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          {/* Outer glow ring */}
          <Box
            onClick={!checkedInToday ? handleCheckIn : undefined}
            sx={{
              width: 180, height: 180, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: checkedInToday ? 'default' : 'pointer',
              position: 'relative',
              background: `radial-gradient(circle, ${fpColor}18 0%, transparent 70%)`,
              border: `3px solid ${fpColor}40`,
              boxShadow: scanState === 'scanning'
                ? `0 0 40px ${fpColor}60, 0 0 80px ${fpColor}30`
                : `0 0 20px ${fpColor}30`,
              transition: 'all 0.4s ease',
              animation: scanState === 'scanning' ? 'pulse 1s ease-in-out infinite' : 'none',
              '@keyframes pulse': {
                '0%, 100%': { boxShadow: `0 0 20px ${fpColor}40, 0 0 40px ${fpColor}20` },
                '50%': { boxShadow: `0 0 60px ${fpColor}80, 0 0 100px ${fpColor}40` },
              },
              '&:hover': !checkedInToday ? { transform: 'scale(1.04)', boxShadow: `0 0 40px ${fpColor}50` } : {},
            }}
          >
            {/* Inner circle */}
            <Box sx={{ width: 140, height: 140, borderRadius: '50%', bgcolor: `${fpColor}12`, border: `2px solid ${fpColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {checkedInToday
                ? <CheckCircleIcon sx={{ fontSize: 72, color: '#10b981' }} />
                : scanState === 'scanning'
                  ? <CircularProgress size={72} thickness={2} sx={{ color: fpColor }} />
                  : <FingerprintIcon sx={{ fontSize: 80, color: fpColor, opacity: 0.9, transition: 'color 0.3s' }} />
              }
            </Box>
          </Box>

          <Typography variant="h6" sx={{ mt: 2.5, fontWeight: 700, color: fpColor, transition: 'color 0.3s' }}>
            {checkedInToday
              ? '✅ Present Today!'
              : scanState === 'scanning'
                ? 'Scanning…'
                : 'Tap to Check In'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {checkedInToday
              ? `Great workout! See you tomorrow 💪`
              : 'Tap the fingerprint to mark your attendance'}
          </Typography>
        </Box>

        {/* Attendance history */}
        <Paper sx={{ width: '100%', borderRadius: 2 }}>
          <Box sx={{ px: 2.5, pt: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Recent Visits</Typography>
            <Chip label={`${attendance.length} total`} size="small" sx={{ bgcolor: '#3b82f620', color: '#60a5fa' }} />
          </Box>
          {attendance.length === 0
            ? <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3, fontSize: 14 }}>No visits yet — check in today!</Typography>
            : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.slice(0, 10).map(a => {
                    const d = new Date(a.check_in_time);
                    const isToday = d.toISOString().startsWith(new Date().toISOString().split('T')[0]);
                    return (
                      <TableRow key={a.id} sx={{ bgcolor: isToday ? 'rgba(16,185,129,0.06)' : 'transparent' }}>
                        <TableCell>
                          {isToday
                            ? <Chip label="Today" size="small" color="success" sx={{ height: 20, fontSize: 11 }} />
                            : d.toLocaleDateString('en-IN', { weekday: 'short' })}
                        </TableCell>
                        <TableCell>{d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</TableCell>
                        <TableCell align="right" sx={{ color: '#94a3b8' }}>{d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
        </Paper>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} sx={{ minWidth: 280 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
