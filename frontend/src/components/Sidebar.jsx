import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Chip, Avatar, IconButton, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PaymentIcon from '@mui/icons-material/Payment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const WIDTH = 240;

const NAV = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
  { label: 'Members', icon: PeopleIcon, path: '/members' },
  { label: 'Plans', icon: CardMembershipIcon, path: '/plans' },
  { label: 'Check-In', icon: HowToRegIcon, path: '/checkin' },
  { label: 'Payments', icon: PaymentIcon, path: '/payments' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <Drawer variant="permanent" sx={{
      width: WIDTH, flexShrink: 0,
      '& .MuiDrawer-paper': { width: WIDTH, boxSizing: 'border-box' },
    }}>
      {/* Logo */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(239,68,68,0.3)' }}>
          <FitnessCenterIcon sx={{ color: '#ef4444', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: 17, color: '#ef4444', letterSpacing: 0.5, lineHeight: 1.1 }}>
            TRU FITNESS
          </Typography>
          <Typography sx={{ fontSize: 9, color: '#a89090', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Management
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(239,68,68,0.1)', mx: 1.5 }} />

      <List sx={{ flex: 1, pt: 1.5, px: 0.5 }}>
        {NAV.map(({ label, icon: Icon, path }) => (
          <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
            <NavLink to={path} style={{ textDecoration: 'none', width: '100%' }}>
              {({ isActive }) => (
                <ListItemButton sx={{
                  mx: 0.5, borderRadius: 2,
                  background: isActive ? 'linear-gradient(90deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid #ef4444' : '3px solid transparent',
                  '&:hover': { background: 'rgba(239,68,68,0.1)' },
                }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon sx={{ fontSize: 20, color: isActive ? '#ef4444' : '#a89090' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 700 : 400, color: isActive ? '#f9f4f4' : '#a89090' }}
                  />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(239,68,68,0.1)', mx: 1.5 }} />

      {/* User info */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#dc2626', fontSize: 14, fontWeight: 700 }}>
          {user?.username?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#f9f4f4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
            {user?.username}
          </Typography>
          <Chip label={user?.role} size="small" sx={{ height: 16, fontSize: 10, bgcolor: 'rgba(239,68,68,0.15)', color: '#f87171' }} />
        </Box>
        <IconButton size="small" onClick={handleLogout} sx={{ color: '#a89090', '&:hover': { color: '#ef4444' } }}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
    </Drawer>
  );
}
